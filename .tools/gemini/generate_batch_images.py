#!/usr/bin/env python3
"""
Gemini Batch Image Generation Script
=====================================
Submits JSONL batch image requests to the Gemini Batch API,
polls for job completion, downloads generated images, and
replaces existing images in the site's image directories.

Usage:
    # Submit all 4 series (default):
    python3 generate_batch_images.py

    # Submit specific series only:
    python3 generate_batch_images.py --series embedded-systems assembly-mastery

    # Resume: poll + download for existing jobs (skips upload/submit):
    python3 generate_batch_images.py --resume

    # Download results for completed jobs only:
    python3 generate_batch_images.py --download-only

    # Check status of active jobs without downloading:
    python3 generate_batch_images.py --status

Environment:
    GEMINI_API_KEY  - Required. Your Gemini API key.

Model: gemini-3.1-flash-image-preview
API docs: https://ai.google.dev/gemini-api/docs/batch-api?batch=file
"""

import argparse
import base64
import json
import os
import sys
import time
from io import BytesIO
from pathlib import Path

try:
    from google import genai
    from google.genai import types
except ImportError:
    print("ERROR: google-genai package not installed. Run: pip install google-genai")
    sys.exit(1)

try:
    from PIL import Image
except ImportError:
    print("ERROR: Pillow package not installed. Run: pip install Pillow")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
MODEL = "gemini-3.1-flash-image-preview"
POLL_INTERVAL = 30          # seconds between status checks
STATE_FILE = "batch-jobs-state.json"  # tracks submitted job metadata

SERIES_CONFIG = {
    "embedded-systems": {
        "jsonl": "embedded-systems-batch-image-requests.jsonl",
        "image_dir": "images/series/embedded-systems",
        "count": 60,
    },
    "assembly-mastery": {
        "jsonl": "assembly-mastery-batch-image-requests.jsonl",
        "image_dir": "images/series/assembly-mastery",
        "count": 125,
    },
    "gnu-make": {
        "jsonl": "gnu-make-batch-image-requests.jsonl",
        "image_dir": "images/series/gnu-make",
        "count": 80,
    },
    "system-design": {
        "jsonl": "system-design-batch-image-requests.jsonl",
        "image_dir": "images/series/system-design",
        "count": 75,
    },
    "api-development": {
        "jsonl": "api-development-batch-image-requests.jsonl",
        "image_dir": "images/series/api-development",
        "count": 85,
    },
    "protocols-master": {
        "jsonl": "protocols-master-batch-image-requests.jsonl",
        "image_dir": "images/series/protocols-master",
        "count": 100,
    },
    "cloud-computing": {
        "jsonl": "cloud-computing-batch-image-requests.jsonl",
        "image_dir": "images/series/cloud-computing",
        "count": 55,
    },
    "data-structures": {
        "jsonl": "data-structures-batch-image-requests.jsonl",
        "image_dir": "images/series/data-structures",
        "count": 60,
    },
    "kernel-development": {
        "jsonl": "kernel-development-batch-image-requests.jsonl",
        "image_dir": "images/series/kernel-development",
        "count": 90,
    },
    "computer-architecture": {
        "jsonl": "computer-architecture-batch-image-requests.jsonl",
        "image_dir": "images/series/computer-architecture",
        "count": 120,
    },
}

COMPLETED_STATES = {
    "JOB_STATE_SUCCEEDED",
    "JOB_STATE_FAILED",
    "JOB_STATE_CANCELLED",
    "JOB_STATE_EXPIRED",
}


# ---------------------------------------------------------------------------
# State persistence — survive script restarts
# ---------------------------------------------------------------------------
def load_state() -> dict:
    """Load persisted job state from disk."""
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE) as f:
            return json.load(f)
    return {"jobs": {}}


def save_state(state: dict):
    """Persist job state to disk."""
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)
    print(f"  State saved to {STATE_FILE}")


# ---------------------------------------------------------------------------
# Step 1: Upload JSONL + submit batch job
# ---------------------------------------------------------------------------
def submit_batch_job(client: genai.Client, series: str, config: dict, state: dict) -> str:
    """Upload JSONL file and create a batch job. Returns the job name."""
    jsonl_path = config["jsonl"]

    if not os.path.exists(jsonl_path):
        print(f"  ERROR: JSONL file not found: {jsonl_path}")
        return None

    # Check if already submitted
    if series in state["jobs"] and state["jobs"][series].get("job_name"):
        job_name = state["jobs"][series]["job_name"]
        print(f"  Already submitted: {job_name}")
        print(f"  (Use --resume to poll this job, or delete {STATE_FILE} to re-submit)")
        return job_name

    print(f"  Uploading {jsonl_path} ({config['count']} requests)...")
    uploaded_file = client.files.upload(
        file=jsonl_path,
        config=types.UploadFileConfig(
            display_name=f"{series}-batch-images",
            mime_type="jsonl",
        ),
    )
    print(f"  Uploaded: {uploaded_file.name}")

    print(f"  Creating batch job with model {MODEL}...")
    batch_job = client.batches.create(
        model=MODEL,
        src=uploaded_file.name,
        config={
            "display_name": f"{series}-image-generation",
        },
    )
    job_name = batch_job.name
    print(f"  Batch job created: {job_name}")

    # Persist
    state["jobs"][series] = {
        "job_name": job_name,
        "uploaded_file": uploaded_file.name,
        "status": "SUBMITTED",
        "submitted_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "images_downloaded": 0,
    }
    save_state(state)
    return job_name


# ---------------------------------------------------------------------------
# Step 2: Poll for job completion
# ---------------------------------------------------------------------------
def poll_job(client: genai.Client, job_name: str, series: str, state: dict, poll_interval: int = 30) -> object:
    """Poll until the batch job reaches a terminal state. Returns the job object."""
    print(f"\n  Polling job: {job_name}")
    iteration = 0

    while True:
        batch_job = client.batches.get(name=job_name)
        current_state = batch_job.state.name
        iteration += 1

        # Update persisted state
        if series in state["jobs"]:
            state["jobs"][series]["status"] = current_state

        if current_state in COMPLETED_STATES:
            print(f"  Job finished: {current_state}")

            if current_state == "JOB_STATE_FAILED":
                error_msg = str(getattr(batch_job, "error", "unknown error"))
                print(f"  ERROR: {error_msg}")
                if series in state["jobs"]:
                    state["jobs"][series]["error"] = error_msg

            save_state(state)
            return batch_job

        # Progress info
        stats = getattr(batch_job, "batch_stats", None)
        if stats:
            total = getattr(stats, "total_request_count", "?")
            success = getattr(stats, "success_request_count", "?")
            failed = getattr(stats, "failed_request_count", "?")
            print(
                f"  [{iteration:>3}] {current_state}  "
                f"(success={success}, failed={failed}, total={total})  "
                f"Next check in {poll_interval}s..."
            )
        else:
            print(f"  [{iteration:>3}] {current_state}  Next check in {poll_interval}s...")

        time.sleep(poll_interval)


# ---------------------------------------------------------------------------
# Step 3: Download result images and save as .webp
# ---------------------------------------------------------------------------
def download_and_replace_images(
    client: genai.Client, batch_job, series: str, config: dict, state: dict
):
    """Download generated images from a succeeded batch job and save to disk."""
    image_dir = config["image_dir"]
    os.makedirs(image_dir, exist_ok=True)

    if batch_job.state.name != "JOB_STATE_SUCCEEDED":
        print(f"  Skipping download — job state is {batch_job.state.name}")
        return

    # Get result file
    if not (batch_job.dest and batch_job.dest.file_name):
        print("  ERROR: No result file found in job destination.")
        return

    result_file_name = batch_job.dest.file_name
    print(f"  Downloading result file: {result_file_name}")

    file_content_bytes = client.files.download(file=result_file_name)
    file_content = file_content_bytes.decode("utf-8")

    lines = [line for line in file_content.splitlines() if line.strip()]
    print(f"  Result file contains {len(lines)} entries")

    saved = 0
    failed = 0
    errors = []

    for line in lines:
        parsed = json.loads(line)
        key = parsed.get("key", "unknown")
        output_path = os.path.join(image_dir, f"{key}.webp")

        # Check for error response
        if "error" in parsed and parsed["error"]:
            error_msg = str(parsed["error"])
            errors.append(f"{key}: {error_msg}")
            failed += 1
            continue

        # Extract image from response
        response = parsed.get("response", {})
        candidates = response.get("candidates", [])
        if not candidates:
            errors.append(f"{key}: No candidates in response")
            failed += 1
            continue

        parts = candidates[0].get("content", {}).get("parts", [])

        # Find the image part (inlineData with image MIME type)
        image_data = None
        image_mime = None
        for part in parts:
            inline = part.get("inlineData", {})
            if inline and inline.get("mimeType", "").startswith("image/"):
                image_data = inline.get("data")
                image_mime = inline.get("mimeType")
                break

        if not image_data:
            errors.append(f"{key}: No image data found in response parts")
            failed += 1
            continue

        # Decode base64 and convert to WebP
        try:
            raw_bytes = base64.b64decode(image_data)
            img = Image.open(BytesIO(raw_bytes))

            # Convert to RGB if necessary (e.g., RGBA PNGs)
            if img.mode in ("RGBA", "LA", "P"):
                img = img.convert("RGB")

            img.save(output_path, "WEBP", quality=90)
            saved += 1

            if saved % 10 == 0 or saved == 1:
                print(f"    [{saved}/{len(lines)}] Saved {output_path} ({img.size[0]}x{img.size[1]})")
        except Exception as e:
            errors.append(f"{key}: Failed to process image — {e}")
            failed += 1

    # Summary
    print(f"\n  === {series} Download Summary ===")
    print(f"  Total entries:  {len(lines)}")
    print(f"  Images saved:   {saved}")
    print(f"  Failed:         {failed}")
    print(f"  Output dir:     {image_dir}/")

    if errors:
        print(f"\n  Errors ({len(errors)}):")
        for err in errors:
            print(f"    - {err}")

    # Update state
    if series in state["jobs"]:
        state["jobs"][series]["images_downloaded"] = saved
        state["jobs"][series]["images_failed"] = failed
        state["jobs"][series]["download_completed_at"] = time.strftime(
            "%Y-%m-%dT%H:%M:%SZ", time.gmtime()
        )
        if errors:
            state["jobs"][series]["download_errors"] = errors
    save_state(state)


# ---------------------------------------------------------------------------
# Main workflow
# ---------------------------------------------------------------------------
def process_series(client: genai.Client, series: str, state: dict, args):
    """Full pipeline for one series: submit → poll → download."""
    config = SERIES_CONFIG[series]
    print(f"\n{'='*60}")
    print(f"  Series: {series}")
    print(f"  JSONL:  {config['jsonl']} ({config['count']} images)")
    print(f"  Output: {config['image_dir']}/")
    print(f"{'='*60}")

    job_name = None

    if args.download_only or args.resume:
        # Must have an existing job
        job_info = state["jobs"].get(series, {})
        job_name = job_info.get("job_name")
        if not job_name:
            print(f"  No existing job found for {series}. Run without --resume/--download-only first.")
            return
        print(f"  Resuming job: {job_name}")
    elif args.status:
        job_info = state["jobs"].get(series, {})
        job_name = job_info.get("job_name")
        if not job_name:
            print(f"  No job submitted yet.")
            return
        batch_job = client.batches.get(name=job_name)
        current_state = batch_job.state.name
        print(f"  Job: {job_name}")
        print(f"  Status: {current_state}")
        stats = getattr(batch_job, "batch_stats", None)
        if stats:
            print(f"  Success: {getattr(stats, 'success_request_count', '?')}")
            print(f"  Failed:  {getattr(stats, 'failed_request_count', '?')}")
            print(f"  Total:   {getattr(stats, 'total_request_count', '?')}")
        return
    else:
        # Normal flow: submit
        job_name = submit_batch_job(client, series, config, state)
        if not job_name:
            return

    if args.status:
        return

    # Poll (skip if download_only and already succeeded)
    if args.download_only:
        batch_job = client.batches.get(name=job_name)
        if batch_job.state.name != "JOB_STATE_SUCCEEDED":
            print(f"  Job not yet succeeded (state: {batch_job.state.name})")
            print(f"  Use --resume to poll until completion.")
            return
    else:
        batch_job = poll_job(client, job_name, series, state, poll_interval=args.poll_interval)

    # Download
    if batch_job.state.name == "JOB_STATE_SUCCEEDED":
        download_and_replace_images(client, batch_job, series, config, state)
    else:
        print(f"  Cannot download — job state: {batch_job.state.name}")


def main():
    parser = argparse.ArgumentParser(
        description="Gemini Batch Image Generation — submit, poll, and download",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 generate_batch_images.py                          # Submit all 4 series
  python3 generate_batch_images.py --series embedded-systems # Submit one series
  python3 generate_batch_images.py --resume                 # Poll existing jobs
  python3 generate_batch_images.py --download-only          # Download completed results
  python3 generate_batch_images.py --status                 # Check job status
        """,
    )
    parser.add_argument(
        "--series",
        nargs="+",
        choices=list(SERIES_CONFIG.keys()),
        default=list(SERIES_CONFIG.keys()),
        help="Series to process (default: all)",
    )
    parser.add_argument(
        "--resume",
        action="store_true",
        help="Resume polling for already-submitted jobs",
    )
    parser.add_argument(
        "--download-only",
        action="store_true",
        help="Download results for completed jobs (skip submit/poll)",
    )
    parser.add_argument(
        "--status",
        action="store_true",
        help="Check current status of submitted jobs",
    )
    parser.add_argument(
        "--poll-interval",
        type=int,
        default=POLL_INTERVAL,
        help=f"Seconds between status polls (default: {POLL_INTERVAL})",
    )
    args = parser.parse_args()

    # API key
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY environment variable not set.")
        print("  export GEMINI_API_KEY='your-api-key-here'")
        sys.exit(1)

    # Initialize client
    client = genai.Client(api_key=api_key)

    # Load persisted state
    state = load_state()

    print(f"Model:  {MODEL}")
    print(f"Series: {', '.join(args.series)}")
    print(f"Mode:   {'status' if args.status else 'download-only' if args.download_only else 'resume' if args.resume else 'submit + poll + download'}")
    print(f"State:  {STATE_FILE}")

    # Process each series
    for series in args.series:
        try:
            process_series(client, series, state, args)
        except Exception as e:
            print(f"\n  EXCEPTION processing {series}: {e}")
            import traceback
            traceback.print_exc()
            # Save state so we don't lose progress
            save_state(state)
            continue

    # Final summary
    print(f"\n{'='*60}")
    print("  FINAL SUMMARY")
    print(f"{'='*60}")
    for series in args.series:
        job_info = state["jobs"].get(series, {})
        status = job_info.get("status", "NOT SUBMITTED")
        downloaded = job_info.get("images_downloaded", 0)
        failed_dl = job_info.get("images_failed", 0)
        expected = SERIES_CONFIG[series]["count"]
        print(f"  {series:25s}  {status:25s}  {downloaded}/{expected} images  ({failed_dl} failed)")
    print()


if __name__ == "__main__":
    main()
