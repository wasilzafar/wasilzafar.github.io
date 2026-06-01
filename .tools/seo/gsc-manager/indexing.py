# ------------------------------------------------------------------
# SEO-GSC-Manager  ·  Instant URL Manager  (Indexing API v3)
# ------------------------------------------------------------------
# submit_url()       — single URL update / delete
# submit_urls_batch() — batch up to 200 URLs (daily quota)
# get_notification_status() — check last notification for a URL
# ------------------------------------------------------------------

from __future__ import annotations

from auth import get_indexing_service, retry_api_call
from config import INDEXING_API_DAILY_QUOTA, BATCH_CHUNK_SIZE

_VALID_ACTIONS = {"URL_UPDATED", "URL_DELETED"}


# ---- Single URL -------------------------------------------------------

def submit_url(url: str, action_type: str = "URL_UPDATED") -> dict:
    """Publish an UPDATED or DELETED notification for *url*.

    Returns the API response dict on success.
    """
    action_type = action_type.upper()
    if action_type not in _VALID_ACTIONS:
        raise ValueError(
            f"action_type must be one of {_VALID_ACTIONS}, got '{action_type}'"
        )

    service = get_indexing_service()
    body = {"url": url, "type": action_type}

    result = retry_api_call(
        service.urlNotifications().publish(body=body).execute
    )
    print(f"  ✅  {action_type} → {url}")
    return result


# ---- Batch URLs -------------------------------------------------------

def submit_urls_batch(
    urls: list[str],
    action_type: str = "URL_UPDATED",
) -> list[dict]:
    """Submit up to *INDEXING_API_DAILY_QUOTA* URLs in batches of
    *BATCH_CHUNK_SIZE*.

    Returns a list of per-URL result dicts.
    """
    action_type = action_type.upper()
    if action_type not in _VALID_ACTIONS:
        raise ValueError(
            f"action_type must be one of {_VALID_ACTIONS}, got '{action_type}'"
        )

    if len(urls) > INDEXING_API_DAILY_QUOTA:
        print(
            f"  ⚠️  {len(urls)} URLs exceeds the daily quota of "
            f"{INDEXING_API_DAILY_QUOTA}. Only the first "
            f"{INDEXING_API_DAILY_QUOTA} will be submitted."
        )
        urls = urls[:INDEXING_API_DAILY_QUOTA]

    service = get_indexing_service()
    all_results: list[dict] = []

    for chunk_start in range(0, len(urls), BATCH_CHUNK_SIZE):
        chunk = urls[chunk_start : chunk_start + BATCH_CHUNK_SIZE]

        # google-api-python-client batch helper
        batch = service.new_batch_http_request()

        responses: dict[str, dict] = {}

        def _callback(request_id, response, exception, _url=None):
            if exception is not None:
                print(f"  ❌  {_url or request_id}: {exception}")
                responses[request_id] = {"error": str(exception)}
            else:
                responses[request_id] = response

        for idx, url in enumerate(chunk):
            body = {"url": url, "type": action_type}
            batch.add(
                service.urlNotifications().publish(body=body),
                request_id=str(idx),
                callback=lambda rid, resp, exc, u=url: _callback(rid, resp, exc, u),
            )

        retry_api_call(batch.execute)

        for idx, url in enumerate(chunk):
            res = responses.get(str(idx), {})
            if "error" not in res:
                print(f"  ✅  {action_type} → {url}")
            all_results.append(res)

    print(f"\n  📊  Batch complete: {len(all_results)} URL(s) processed.")
    return all_results


# ---- Notification status -----------------------------------------------

def get_notification_status(url: str) -> dict:
    """Return the latest update/delete notification timestamps for *url*.

    Returns an empty dict with a message if the URL was never submitted.
    """
    from googleapiclient.errors import HttpError

    service = get_indexing_service()
    try:
        return retry_api_call(
            service.urlNotifications().getMetadata(url=url).execute
        )
    except HttpError as exc:
        if exc.resp.status == 404:
            return {
                "url": url,
                "message": "No notification found — this URL has not been "
                           "submitted via the Indexing API yet.",
            }
        raise
