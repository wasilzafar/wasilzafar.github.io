#!/usr/bin/env python3
"""Add <small> topic tags to step-info elements missing them in series-nav-path."""
import os, glob

# Mapping: series_name -> { step_title: small_text }
SERIES_TOPICS = {
    "assembly-mastery": {
        "Development Environment, Tooling & Workflow": "IDEs, debuggers, build tools, workflow setup",
        "Assembly Language Fundamentals & Toolchain Setup": "Syntax basics, assemblers, linkers, object files",
        "x86 CPU Architecture Overview": "Instruction pipeline, execution units, microarchitecture",
        "Registers – Complete Deep Dive": "GPRs, segment, control, flags, MSRs",
        "Instruction Encoding & Binary Layout": "Opcode bytes, ModR/M, SIB, prefixes, encoding schemes",
        "NASM Syntax, Directives & Macros": "Sections, labels, EQU, %macro, conditional assembly",
        "Complete Assembler Comparison": "NASM vs MASM vs GAS vs FASM, syntax differences",
        "Memory Addressing Modes": "Direct, indirect, indexed, base+displacement, RIP-relative",
        "Stack Internals & Calling Conventions": "Push/pop, stack frames, cdecl, System V ABI, fastcall",
        "Control Flow & Procedures": "Jumps, loops, conditionals, CALL/RET, function design",
        "Integer, Bitwise & Arithmetic Operations": "ADD, SUB, MUL, DIV, AND, OR, XOR, shifts, rotates",
        "Floating Point & SIMD Foundations": "x87 FPU, IEEE 754, SSE scalar, precision control",
        "SIMD, Vectorization & Performance": "SSE, AVX, AVX-512, data-parallel processing",
        "System Calls, Interrupts & Privilege Transitions": "INT, SYSCALL, IDT, ring transitions, exception handling",
        "Debugging & Reverse Engineering": "GDB, breakpoints, disassembly, binary analysis, IDA",
        "Linking, Relocation & Loader Behavior": "ELF/PE formats, symbol resolution, dynamic linking, GOT/PLT",
        "x86-64 Long Mode & Advanced Features": "64-bit extensions, RIP addressing, canonical addresses",
        "Assembly + C/C++ Interoperability": "Inline assembly, calling C from ASM, ABI compliance",
        "Memory Protection & Security Concepts": "DEP, ASLR, stack canaries, ROP, mitigations",
        "Bootloaders & Bare-Metal Programming": "BIOS/UEFI, MBR, real mode, protected mode transition",
        "Kernel-Level Assembly": "Context switching, interrupt handlers, TSS, GDT/LDT",
        "Complete Emulator & Simulator Guide": "QEMU, Bochs, instruction-level simulation, debugging VMs",
        "Advanced Optimization & CPU Internals": "Pipeline hazards, branch prediction, cache optimization, ILP",
        "Real-World Assembly Projects": "Shellcode, drivers, cryptography, signal processing",
        "Assembly Mastery Capstone": "Final project, comprehensive review, advanced techniques",
    },
    "consulting-frameworks": {
        "Structured Problem Solving": "Hypothesis-driven thinking, problem structuring, root cause analysis",
        "MECE & Issue Trees": "Mutually exclusive, collectively exhaustive, logic trees",
        "Strategy Frameworks": "Porter's Five Forces, SWOT, BCG Matrix, value chain",
        "McKinsey 7S & Organizational Analysis": "Structure, strategy, systems, shared values, skills",
        "Financial Due Diligence": "Financial statements, valuation, M&A analysis, modeling",
        "Client Communication & Delivery": "Pyramid principle, slide design, stakeholder management",
        "Advanced Frameworks": "Blue ocean, disruption theory, scenario planning",
        "Case Interview Master Pack (Bonus)": "Market sizing, profitability, M&A, pricing cases",
        "Consultant Toolkit (Bonus)": "Templates, checklists, presentation frameworks",
    },
    "data-structures": {
        "Foundations, Memory & Complexity": "Big-O notation, time/space analysis, memory layout",
        "Recursion Complete Guide": "Base cases, call stack, tail recursion, memoization",
        "Arrays & Array ADT": "Static/dynamic arrays, operations, amortized analysis",
        "Strings": "Pattern matching, string algorithms, encoding, manipulation",
        "Matrices": "2D arrays, sparse matrices, matrix operations, traversals",
        "Linked Lists": "Singly, doubly, circular lists, pointer manipulation",
        "Stack": "LIFO, push/pop, expression evaluation, backtracking",
        "Queue": "FIFO, circular queue, deque, priority queue",
        "Trees": "Binary trees, traversals, expression trees, threaded trees",
        "BST & Balanced Trees": "Search, insert, delete, AVL, red-black, B-trees",
        "Heaps, Sorting & Hashing": "Min/max heaps, heapsort, hash tables, collision handling",
        "Graphs, DP, Greedy & Backtracking": "BFS, DFS, shortest paths, dynamic programming, optimization",
    },
    "dddm": {
        "Introduction to Business Analytics & DDDM": "Analytics maturity, data-driven culture, business value",
        "Defining & Tracking KPIs": "OKRs, leading/lagging indicators, scorecard design",
        "Dashboard Design & BI Tools": "Tableau, Power BI, dashboard best practices, data viz",
        "Experimentation & A/B Testing": "Hypothesis testing, control groups, sample sizing",
        "Statistical Significance & Interpretation": "P-values, confidence intervals, effect size, power analysis",
        "Decision Frameworks & Structured Decision Making": "Decision matrices, Bayesian thinking, risk analysis",
        "Data Collection & Quality Management": "Surveys, ETL, data governance, cleaning pipelines",
        "Business Storytelling & Visualization": "Narrative structure, chart selection, audience design",
        "Predictive Analytics & Forecasting": "Regression, time series, ML models, forecasting methods",
        "Data-Driven Culture & Organizational Adoption": "Change management, data literacy, organizational buy-in",
        "Function-Specific Data Applications": "Marketing, finance, operations, HR analytics",
        "Capstone Projects (Portfolio-Ready)": "End-to-end analytics projects, portfolio building",
        "Advanced Analytics & Automation": "ML pipelines, AutoML, real-time analytics, AI integration",
    },
    "entrepreneurship": {
        "Ideation & Opportunity Recognition": "Problem discovery, market gaps, idea generation frameworks",
        "Idea Validation & MVP Prototyping": "Customer discovery, landing pages, prototype testing",
        "Business Models & Canvas": "BMC, lean canvas, revenue models, value propositions",
        "Lean Startup Methodology": "Build-measure-learn, pivoting, validated learning",
        "Fundraising & Financial Modeling": "VC, angels, SAFE notes, cap tables, financial projections",
        "Building Your Founding Team": "Co-founder selection, equity splits, team dynamics",
        "Hiring & Company Culture": "Recruiting, culture building, OKRs, team scaling",
        "Scaling Operations & Growth Hacking": "Growth loops, viral mechanics, operational scaling",
        "Marketing Campaigns & Digital Growth": "CAC/LTV, digital marketing, positioning, channels",
        "Legal, Financial & Risk Foundations": "Entity structure, IP, compliance, burn rate management",
        "Data-Driven Decision Making": "SaaS metrics, NPS, analytics dashboards, A/B testing",
        "Exit Strategies & Investor Pitches": "Valuations, pitch decks, M&A, IPO preparation",
        "Startup Ecosystem & Networking": "Accelerators, mentors, communities, ecosystem mapping",
        "Innovation, Technology & Future Trends": "Emerging tech, AI/ML, deep tech, future markets",
        "Capstone Projects & Portfolio": "Comprehensive startup plan, portfolio presentation",
    },
    "game-development": {
        "Introduction to Game Development": "Industry overview, roles, game design pipeline",
        "Choosing a Game Engine": "Unity, Unreal, Godot, engine comparison, tradeoffs",
        "Programming Basics for Games": "Game loops, input handling, state machines, OOP",
        "2D Game Development": "Sprites, tilemaps, platformers, 2D physics, animation",
        "3D Game Development": "Meshes, materials, lighting, cameras, 3D math",
        "Physics & Collision Systems": "Rigidbodies, colliders, raycasting, physics engines",
        "Audio & Sound Design": "Sound effects, music, spatial audio, audio middleware",
        "Publishing Your Game": "Store submission, marketing, monetization, launch strategy",
        "Game Design Fundamentals": "Mechanics, dynamics, aesthetics, level design, balancing",
        "AI in Games": "Pathfinding, behavior trees, state machines, NPC intelligence",
        "Multiplayer & Networking": "Client-server, peer-to-peer, netcode, synchronization",
        "Professional Game Dev Workflow": "Version control, CI/CD, QA testing, agile for games",
        "Building a Portfolio": "Showcasing projects, demo reels, job applications, indie dev",
    },
    "nlp": {
        "NLP Fundamentals & Linguistic Basics": "Phonology, morphology, syntax, semantics, pragmatics",
        "Tokenization & Text Cleaning": "Subword tokenization, BPE, stopwords, normalization",
        "Text Representation & Feature Engineering": "Bag-of-words, TF-IDF, feature extraction, vectorization",
        "Word Embeddings": "Word2Vec, GloVe, FastText, embedding spaces, analogies",
        "Statistical Language Models & N-grams": "Probability chains, smoothing, perplexity, Markov models",
        "Neural Networks for NLP": "Feedforward nets, backpropagation, activation functions",
        "RNNs, LSTMs & GRUs": "Sequence modeling, vanishing gradients, gated architectures",
        "Transformers & Attention Mechanism": "Self-attention, multi-head attention, positional encoding",
        "Pretrained Language Models & Transfer Learning": "BERT, RoBERTa, fine-tuning, feature extraction",
        "GPT Models & Text Generation": "Autoregressive generation, prompting, GPT architecture",
        "Core NLP Tasks": "NER, POS tagging, sentiment analysis, text classification",
        "Advanced NLP Tasks": "Question answering, summarization, machine translation",
        "Multilingual & Cross-lingual NLP": "mBERT, XLM-R, zero-shot transfer, language diversity",
        "Evaluation, Ethics & Responsible NLP": "BLEU, ROUGE, bias detection, fairness, responsible AI",
        "NLP Systems, Optimization & Production": "Model serving, quantization, distillation, deployment",
        "Cutting-Edge & Research Topics": "LLMs, multimodal NLP, reasoning, emerging research",
    },
}

total_files_fixed = 0
total_replacements = 0

for series_name, topics in SERIES_TOPICS.items():
    sdir = f"pages/series/{series_name}/"
    files = sorted(glob.glob(os.path.join(sdir, "*.html")))
    series_fixes = 0

    for filepath in files:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        if "series-nav-path" not in content:
            continue

        original = content
        for title, small_text in topics.items():
            old = f'<div class="step-info"><h6>{title}</h6></div>'
            new = f'<div class="step-info"><h6>{title}</h6><small>{small_text}</small></div>'
            if old in content:
                content = content.replace(old, new)
                series_fixes += 1

        if content != original:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)
            total_files_fixed += 1

    total_replacements += series_fixes
    print(f"  {series_name}: {len(files)} files, {series_fixes} step-info tags updated")

print(f"\nDONE: {total_files_fixed} files modified, {total_replacements} step-info elements updated")
