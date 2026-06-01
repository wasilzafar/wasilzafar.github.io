/**
 * Batch Quiz Generator — Part 2 (additional series)
 * Run: node .tools/build-quizzes-batch2.js
 */
const fs = require('fs');
const path = require('path');

function encode(answer, salt) {
    const json = JSON.stringify(answer);
    let shifted = '';
    for (let i = 0; i < json.length; i++) {
        shifted += String.fromCharCode(json.charCodeAt(i) ^ salt.charCodeAt(i % salt.length));
    }
    return Buffer.from(shifted, 'binary').toString('base64');
}

function buildQuiz(config) {
    const { series, title, salt, totalParts, questions } = config;
    return {
        series, title, version: 1, totalParts,
        security: { method: "xor-b64", salt },
        questions: questions.map(q => { q.answer = encode(q._answer, salt); delete q._answer; return q; })
    };
}

function writeQuiz(quiz) {
    const outDir = path.join(__dirname, '..', 'pages', 'series', quiz.series);
    if (!fs.existsSync(outDir)) { console.warn('  ⚠ Directory missing:', quiz.series); return false; }
    fs.writeFileSync(path.join(outDir, 'quiz.json'), JSON.stringify(quiz, null, 2));
    return true;
}

// ═══════════════════════════════════════════════════════════════════════════════
// KERNEL DEVELOPMENT
// ═══════════════════════════════════════════════════════════════════════════════
const kernelDev = buildQuiz({
    series: "kernel-development",
    title: "Kernel Development",
    salt: "kernel-dev-2026",
    totalParts: 18,
    questions: [
        {
            id: "kd-q001", part: 1, difficulty: "beginner", type: "mcq",
            question: "What is the primary role of an operating system kernel?",
            options: ["Rendering graphics on screen", "Managing hardware resources and providing abstractions to userspace", "Compiling source code into executables", "Connecting to the internet"],
            _answer: 1,
            explanation: "The kernel is the core of the OS — it manages CPU scheduling, memory allocation, I/O devices, and provides system calls as the interface between hardware and user programs.",
            articleSlug: "kernel-development-fundamentals", tags: ["kernel", "fundamentals"]
        },
        {
            id: "kd-q002", part: 2, difficulty: "intermediate", type: "true-false",
            question: "A monolithic kernel runs all OS services (file system, networking, drivers) in a single address space.",
            _answer: true,
            explanation: "Monolithic kernels (Linux, BSD) run everything in kernel space for performance. Microkernels (Minix, QNX) run services in userspace for isolation. Hybrid kernels (Windows NT, macOS XNU) combine both approaches.",
            articleSlug: "kernel-development-architecture", tags: ["monolithic", "microkernel"]
        },
        {
            id: "kd-q003", part: 3, difficulty: "intermediate", type: "fill-blank",
            question: "The mechanism by which user programs request kernel services is called a ___.",
            _answer: "system call",
            acceptAlso: ["syscall", "system call interface", "trap", "software interrupt"],
            explanation: "System calls (syscalls) are the API between userspace and kernel. They trigger a privilege transition (ring 3 → ring 0 on x86, EL0 → EL1 on ARM) via a trap/interrupt instruction.",
            articleSlug: "kernel-development-syscalls", tags: ["syscall", "interface"]
        },
        {
            id: "kd-q004", part: 4, difficulty: "advanced", type: "code-output",
            question: "What will dmesg show after this kernel module's init function runs?",
            code: "static int __init hello_init(void) {\n    int x = 42;\n    pr_info(\"hello: x=%d, PAGE_SIZE=%lu\\n\", x, PAGE_SIZE);\n    return 0;\n}\nmodule_init(hello_init);",
            _answer: "hello: x=42, PAGE_SIZE=4096",
            acceptAlso: ["x=42, PAGE_SIZE=4096", "hello: x=42, PAGE_SIZE=4096\n"],
            explanation: "pr_info prints to the kernel ring buffer (dmesg). PAGE_SIZE is typically 4096 bytes (4KB) on x86_64 and ARM64. The module loads successfully (return 0).",
            articleSlug: "kernel-development-modules", tags: ["modules", "printk"]
        },
        {
            id: "kd-q005", part: 5, difficulty: "advanced", type: "debug",
            question: "This kernel code causes a deadlock. Find the bug:",
            code: "spinlock_t lock_a, lock_b;\n\n// Thread 1 (CPU 0)\nvoid handler_x(void) {\n    spin_lock(&lock_a);\n    spin_lock(&lock_b);\n    // critical section\n    spin_unlock(&lock_b);\n    spin_unlock(&lock_a);\n}\n\n// Thread 2 (CPU 1)\nvoid handler_y(void) {\n    spin_lock(&lock_b);\n    spin_lock(&lock_a);\n    // critical section\n    spin_unlock(&lock_a);\n    spin_unlock(&lock_b);\n}",
            options: [
                "Lock ordering violation — Thread 1 acquires A→B, Thread 2 acquires B→A",
                "Missing spin_lock_irqsave() — interrupts should be disabled",
                "Spinlocks shouldn't be used — should use mutexes instead",
                "Missing memory barrier between lock acquisitions"
            ],
            _answer: 0,
            explanation: "Classic ABBA deadlock: Thread 1 holds lock_a, waits for lock_b. Thread 2 holds lock_b, waits for lock_a. Fix: always acquire locks in the same global order (e.g., always A before B). Linux's lockdep detects this at runtime.",
            articleSlug: "kernel-development-locking", tags: ["deadlock", "spinlock", "locking"]
        },
        {
            id: "kd-q006", part: 6, difficulty: "advanced", type: "scenario",
            question: "Your kernel driver has a memory leak that slowly consumes all system RAM over 48 hours. The driver allocates buffers for DMA transfers. What's the likely cause?",
            scenario: {
                context: "Network driver handling 10Gbps traffic. Uses kmalloc() for packet buffers. System OOMs after 48 hours under load.",
                findings: ["slabinfo shows sk_buff cache growing unbounded", "Driver calls kmalloc() in receive path", "kfree() called in transmit completion handler", "/proc/meminfo: Slab grows by ~100MB/hour"]
            },
            options: [
                "Error path doesn't free buffers — when packet processing fails, kmalloc'd memory is leaked",
                "Using GFP_KERNEL in interrupt context causes silent allocation failures",
                "DMA mapping isn't released — dma_unmap_single() never called",
                "kmalloc size calculation overflows on jumbo frames"
            ],
            _answer: 0,
            explanation: "Memory leaks in drivers almost always happen in error paths. The happy path frees correctly, but when a checksum fails or queue is full, the code returns early without calling kfree(). Fix: use goto-based cleanup pattern.",
            articleSlug: "kernel-development-memory", tags: ["memory leak", "kmalloc", "driver"]
        },
        {
            id: "kd-q007", part: 7, difficulty: "intermediate", type: "ordering",
            question: "Arrange the Linux boot sequence in correct order:",
            items: ["init/systemd (PID 1) starts", "Bootloader (GRUB) loads kernel", "BIOS/UEFI firmware runs POST", "Kernel mounts root filesystem", "Kernel initializes subsystems (memory, scheduler, drivers)"],
            _answer: ["BIOS/UEFI firmware runs POST", "Bootloader (GRUB) loads kernel", "Kernel initializes subsystems (memory, scheduler, drivers)", "Kernel mounts root filesystem", "init/systemd (PID 1) starts"],
            explanation: "Boot sequence: Firmware (hardware init) → Bootloader (load kernel+initrd) → Kernel early init (memory, CPU) → Kernel late init (drivers, FS) → Mount rootfs → Start PID 1.",
            articleSlug: "kernel-development-boot", tags: ["boot", "init", "sequence"]
        },
        {
            id: "kd-q008", part: 8, difficulty: "advanced", type: "matching",
            question: "Match each Linux memory allocator to its use case:",
            pairs: {
                left: ["kmalloc()", "vmalloc()", "kmem_cache_create()", "alloc_pages()"],
                right: ["Small physically-contiguous allocations (< 128KB)", "Large virtually-contiguous allocations (page tables, modules)", "Slab allocator for fixed-size objects (inodes, dentries)", "Raw page-frame allocations (DMA buffers, huge pages)"]
            },
            _answer: [0, 1, 2, 3],
            explanation: "Each allocator serves different needs: kmalloc for small fast allocations, vmalloc for large ones that don't need physical contiguity, slab for frequently allocated same-size objects, alloc_pages for page-granular or DMA needs.",
            articleSlug: "kernel-development-memory-allocators", tags: ["memory", "allocators", "slab"]
        },
        {
            id: "kd-q009", part: 9, difficulty: "advanced", type: "architecture",
            question: "You're designing a new filesystem for NVMe SSDs. Which architecture maximizes throughput?",
            scenario: "Enterprise NVMe SSD: 1M IOPS random read, 7GB/s sequential, 64 hardware queues. Current ext4 bottlenecks at 200K IOPS due to journal lock contention.",
            options: [
                { label: "Copy-on-Write (COW) B-tree like Btrfs/ZFS", tradeoffs: ["Atomic updates", "Write amplification", "Good snapshots", "Fragmentation over time"] },
                { label: "Per-CPU log-structured design with parallel journals", tradeoffs: ["Lock-free writes", "Near-hardware IOPS", "Complex garbage collection", "Read amplification"] },
                { label: "Direct-mapped extent-based like XFS with multi-queue", tradeoffs: ["Simple layout", "Excellent sequential", "Less metadata overhead", "Single allocation group lock"] },
                { label: "Key-value LSM-tree (like RocksDB as filesystem)", tradeoffs: ["Write-optimized", "Space amplification", "Good for small files", "Compaction storms"] }
            ],
            _answer: 1,
            explanation: "Per-CPU log-structured designs (inspired by F2FS, NOVA) eliminate lock contention by giving each CPU its own log. With 64 NVMe queues mapped to CPU cores, you can approach hardware IOPS limits. The tradeoff is complex GC.",
            articleSlug: "kernel-development-filesystem", tags: ["filesystem", "NVMe", "architecture"]
        },
        {
            id: "kd-q010", part: 10, difficulty: "intermediate", type: "mcq",
            question: "What is the purpose of the Linux OOM (Out-Of-Memory) killer?",
            options: [
                "To defragment physical memory",
                "To select and kill processes when the system runs out of memory",
                "To swap memory pages to disk",
                "To prevent memory allocation above a threshold"
            ],
            _answer: 1,
            explanation: "When the system exhausts all RAM and swap, the OOM killer selects a process to kill based on a badness score (memory usage, oom_score_adj). It's a last resort to prevent total system hang.",
            articleSlug: "kernel-development-mm-oom", tags: ["OOM", "memory management"]
        },
        {
            id: "kd-q011", part: 11, difficulty: "advanced", type: "calculation",
            question: "A system has 16GB RAM with 4KB pages. How many entries does the page table need (flat single-level, ignoring multi-level)?",
            formula: "Entries = Total_RAM / Page_size",
            _answer: 4194304,
            unit: "entries",
            tolerance: 0,
            explanation: "16GB = 16 × 1024³ = 17,179,869,184 bytes. Entries = 17,179,869,184 / 4,096 = 4,194,304 page frames. This is why multi-level page tables exist — a flat table would consume 32MB just for the table itself.",
            articleSlug: "kernel-development-paging", tags: ["paging", "page table"]
        },
        {
            id: "kd-q012", part: 12, difficulty: "intermediate", type: "true-false",
            question: "In Linux, the scheduler can preempt a process running in kernel mode (with CONFIG_PREEMPT enabled).",
            _answer: true,
            explanation: "With CONFIG_PREEMPT=y, the kernel is fully preemptible except within critical sections (spinlocks, RCU read sections). This improves latency for interactive/real-time workloads at a small throughput cost.",
            articleSlug: "kernel-development-scheduler", tags: ["scheduler", "preemption"]
        },
        {
            id: "kd-q013", part: 13, difficulty: "advanced", type: "diagnosis",
            question: "A production server experiences random kernel panics every 2-3 days. Diagnose from the crash dump:",
            presentation: {
                context: "CentOS 8 server, 64GB RAM, running Java application. Panics with 'BUG: unable to handle page fault at ffffc900...'",
                findings: [
                    "Crash address: 0xffffc900_1a2b3c4d (vmalloc range)",
                    "Backtrace: vfs_read → ext4_file_read_iter → copy_to_user → __copy_from_user_ll",
                    "ECC memory: no errors reported",
                    "Kernel: 4.18.0-305 (known stable)",
                    "Recently installed: proprietary GPU driver (out-of-tree module)"
                ]
            },
            options: [
                "Out-of-tree GPU driver corrupting kernel memory (vmalloc area)",
                "EXT4 filesystem corruption on disk",
                "Physical RAM failure not detected by ECC",
                "Java application causing stack overflow in syscall path"
            ],
            _answer: 0,
            explanation: "Out-of-tree drivers are the #1 cause of mysterious kernel crashes. The vmalloc-range fault during a copy_to_user suggests a corrupted page table entry. Proprietary drivers can't be debugged by kernel developers — remove it to confirm.",
            articleSlug: "kernel-development-debugging", tags: ["panic", "debugging", "drivers"]
        },
        {
            id: "kd-q014", part: 14, difficulty: "advanced", type: "ethical",
            question: "Should Linux accept proprietary/binary-only kernel modules (like NVIDIA's driver)?",
            scenario: "NVIDIA ships a binary blob kernel module. It taints the kernel (printk shows 'Tainted: P'), can't be debugged by kernel developers, and breaks with kernel updates. But it provides the only high-performance GPU driver for Linux.",
            options: [
                { label: "Accept them — users need working hardware; pragmatism over purity", framework: "Utilitarian — maximize user benefit" },
                { label: "Ban them — they violate the GPL spirit and make debugging impossible", framework: "Copyleft — enforce software freedom" },
                { label: "Require stable ABI for out-of-tree modules (like Windows does)", framework: "Compatibility — stable interface contract" },
                { label: "Encourage open-source alternatives (Nouveau/NVK) while tolerating blobs", framework: "Gradual transition — build alternatives first" }
            ],
            _answer: 3,
            explanation: "Linux's current approach: tolerate binary modules but mark kernel as 'tainted' (no support). Meanwhile, invest in open alternatives (Nouveau, NVK, xe). NVIDIA eventually open-sourced their kernel module in 2022, validating this strategy.",
            articleSlug: "kernel-development-modules-licensing", tags: ["GPL", "binary blobs", "ethics"]
        }
    ]
});

// ═══════════════════════════════════════════════════════════════════════════════
// EMBEDDED SYSTEMS
// ═══════════════════════════════════════════════════════════════════════════════
const embeddedSystems = buildQuiz({
    series: "embedded-systems",
    title: "Embedded Systems",
    salt: "embed-sys-2026",
    totalParts: 12,
    questions: [
        {
            id: "es-q001", part: 1, difficulty: "beginner", type: "mcq",
            question: "What distinguishes an embedded system from a general-purpose computer?",
            options: ["It has no operating system", "It's designed for a specific dedicated function", "It must be smaller than a credit card", "It can't connect to the internet"],
            _answer: 1,
            explanation: "Embedded systems are designed for specific functions (washing machine controller, car ECU, pacemaker). They may have an OS, vary in size, and can have connectivity — but dedicated purpose is the defining trait.",
            articleSlug: "embedded-systems-fundamentals", tags: ["fundamentals", "definition"]
        },
        {
            id: "es-q002", part: 2, difficulty: "intermediate", type: "true-false",
            question: "An RTOS (Real-Time Operating System) guarantees that tasks always complete within their deadline.",
            _answer: false,
            explanation: "A hard RTOS guarantees deterministic SCHEDULING (worst-case response time is bounded), but it's the developer's responsibility to ensure tasks complete within deadlines. An RTOS provides the tools; correct design ensures timing.",
            articleSlug: "embedded-systems-rtos", tags: ["RTOS", "real-time"]
        },
        {
            id: "es-q003", part: 3, difficulty: "intermediate", type: "fill-blank",
            question: "In embedded C, the keyword ___ tells the compiler that a variable may change unexpectedly (e.g., hardware register or ISR-modified).",
            _answer: "volatile",
            acceptAlso: ["volatile"],
            explanation: "The 'volatile' keyword prevents the compiler from optimizing away reads/writes to that variable. Essential for: memory-mapped hardware registers, variables shared with ISRs, and multi-threaded shared data.",
            articleSlug: "embedded-systems-c-programming", tags: ["volatile", "C", "registers"]
        },
        {
            id: "es-q004", part: 4, difficulty: "intermediate", type: "code-output",
            question: "What value does this function return? (Assume 32-bit unsigned integers)",
            code: "uint32_t read_bit(uint32_t reg, uint8_t bit) {\n    return (reg >> bit) & 0x01;\n}\n// Call: read_bit(0xA5, 5)",
            _answer: "1",
            acceptAlso: ["0x01", "true"],
            explanation: "0xA5 = 10100101 in binary. Shift right by 5: 00000101. AND with 0x01: result = 1. Bit 5 of 0xA5 is set. This is the standard embedded pattern for reading individual bits from hardware registers.",
            articleSlug: "embedded-systems-bit-manipulation", tags: ["bit manipulation", "registers"]
        },
        {
            id: "es-q005", part: 5, difficulty: "advanced", type: "debug",
            question: "This ISR causes sporadic system crashes. Find the bug:",
            code: "volatile uint8_t buffer[256];\nvolatile uint8_t head = 0;\n\nvoid UART_IRQHandler(void) {\n    if (UART->SR & UART_SR_RXNE) {\n        buffer[head] = UART->DR;\n        head++;\n    }\n}",
            options: [
                "Buffer overflow — head wraps around from 255 to 0 (uint8_t), which is fine, but no overflow check before write",
                "Missing volatile on head — compiler may cache it in a register",
                "Not clearing the interrupt flag — ISR fires repeatedly in an infinite loop",
                "Race condition — main loop reading buffer while ISR writes"
            ],
            _answer: 2,
            explanation: "Reading UART->DR typically clears RXNE on STM32, but on some peripherals the flag must be explicitly cleared. If RXNE remains set, the ISR re-enters immediately after return, starving the system. The uint8_t wraparound is intentional (circular buffer).",
            articleSlug: "embedded-systems-interrupts", tags: ["ISR", "UART", "debugging"]
        },
        {
            id: "es-q006", part: 6, difficulty: "advanced", type: "scenario",
            question: "Your battery-powered IoT sensor must last 5 years on a CR2032 coin cell (225mAh). The sensor takes a reading every 15 minutes. What's your power strategy?",
            scenario: {
                context: "Temperature/humidity sensor. BLE transmission after each reading. MCU: STM32L4 (1.5μA sleep, 12mA active).",
                metrics: { "Battery": "225mAh", "Target life": "5 years (43,800 hours)", "Readings": "4/hour", "BLE TX time": "3ms per packet" },
                constraints: ["Must achieve < 5.1μA average current", "BLE range: 10m minimum", "Accuracy: ±0.5°C"]
            },
            options: [
                "Use deep sleep (STOP2 mode) between readings; wake via RTC alarm every 15 min",
                "Keep MCU in run mode but reduce clock to 32kHz",
                "Use energy harvesting (solar) to supplement the battery",
                "Batch readings and transmit every hour instead of every 15 minutes"
            ],
            _answer: 0,
            explanation: "STOP2 mode at 1.5μA with 15-min RTC wakeup gives: active time = ~5ms sensor + 3ms BLE = 8ms, 4×/hour. Average current ≈ 1.5μA + (12mA × 8ms × 4)/3600s ≈ 1.5μA + 0.1μA ≈ 1.6μA. Battery life = 225mAh/1.6μA ≈ 16 years. Well within target.",
            articleSlug: "embedded-systems-low-power", tags: ["low power", "sleep modes", "IoT"]
        },
        {
            id: "es-q007", part: 7, difficulty: "intermediate", type: "matching",
            question: "Match each communication protocol to its typical embedded use case:",
            pairs: {
                left: ["SPI", "I²C", "UART", "CAN"],
                right: ["High-speed peripheral access (display, flash, ADC)", "Multi-device sensor bus (short distance, few wires)", "Debug console and GPS modules (point-to-point)", "Automotive networks (multi-node, noise-immune)"]
            },
            _answer: [0, 1, 2, 3],
            explanation: "SPI: fastest, full-duplex, point-to-point (displays, SD cards). I²C: multi-device, 2 wires, slower (sensors, EEPROM). UART: simple async, debugging. CAN: differential, robust in noisy environments (vehicles, industrial).",
            articleSlug: "embedded-systems-communication", tags: ["SPI", "I2C", "UART", "CAN"]
        },
        {
            id: "es-q008", part: 8, difficulty: "advanced", type: "ordering",
            question: "Arrange the steps of a DMA transfer in correct order:",
            items: ["DMA controller generates transfer-complete interrupt", "CPU configures DMA: source, destination, length, direction", "CPU resumes other work while transfer occurs", "DMA controller moves data between peripheral and memory", "CPU enables the DMA channel"],
            _answer: ["CPU configures DMA: source, destination, length, direction", "CPU enables the DMA channel", "CPU resumes other work while transfer occurs", "DMA controller moves data between peripheral and memory", "DMA controller generates transfer-complete interrupt"],
            explanation: "DMA offloads bulk data transfer from the CPU: configure → enable → CPU is free → DMA handles transfer autonomously → interrupt signals completion. This is why DMA is essential for high-throughput embedded systems.",
            articleSlug: "embedded-systems-dma", tags: ["DMA", "transfer"]
        },
        {
            id: "es-q009", part: 9, difficulty: "advanced", type: "calculation",
            question: "A 12-bit ADC with 3.3V reference reads value 2482. What is the analog input voltage?",
            formula: "Voltage = (ADC_value / (2^bits - 1)) × V_ref",
            _answer: 2.0,
            unit: "V",
            tolerance: 0.02,
            explanation: "V = (2482 / 4095) × 3.3V = 0.606 × 3.3 = 2.0V. A 12-bit ADC has 4096 levels (0-4095). Resolution = 3.3V/4095 ≈ 0.806mV per step.",
            articleSlug: "embedded-systems-adc", tags: ["ADC", "analog", "conversion"]
        },
        {
            id: "es-q010", part: 10, difficulty: "beginner", type: "mcq",
            question: "What does a watchdog timer do in an embedded system?",
            options: ["Measures elapsed time for the application", "Resets the system if software hangs (not periodically refreshed)", "Generates PWM signals for motor control", "Counts external events from a sensor"],
            _answer: 1,
            explanation: "A watchdog timer must be periodically 'fed' (refreshed) by software. If the software crashes or enters an infinite loop, the watchdog expires and triggers a system reset — a critical safety mechanism.",
            articleSlug: "embedded-systems-watchdog", tags: ["watchdog", "safety"]
        },
        {
            id: "es-q011", part: 11, difficulty: "advanced", type: "architecture",
            question: "You're designing a safety-critical system (automotive ADAS). Which architecture ensures fault tolerance?",
            scenario: "Forward collision warning system. Must meet ASIL-D (highest automotive safety integrity level). Failure could result in injury.",
            options: [
                { label: "Single MCU with software watchdog and ECC RAM", tradeoffs: ["Low cost", "Single point of failure", "Meets ASIL-B at most"] },
                { label: "Dual-core lockstep MCU (identical cores, outputs compared)", tradeoffs: ["Hardware fault detection", "100% CPU redundancy", "No performance gain from dual core"] },
                { label: "Triple modular redundancy (3 MCUs with majority voting)", tradeoffs: ["Tolerates 1 failure", "High cost/power", "ASIL-D capable", "Complex voting logic"] },
                { label: "Primary + monitoring MCU (asymmetric redundancy)", tradeoffs: ["Lower cost than TMR", "Monitor detects primary failures", "Graceful degradation"] }
            ],
            _answer: 1,
            explanation: "Dual-core lockstep (used in TI Hercules, Infineon AURIX) is the automotive industry standard for ASIL-D. Both cores execute the same code; a comparator detects any divergence within 1 clock cycle. Cost-effective for single-fault detection.",
            articleSlug: "embedded-systems-safety", tags: ["ASIL", "lockstep", "safety"]
        },
        {
            id: "es-q012", part: 12, difficulty: "intermediate", type: "ethical",
            question: "Should embedded firmware in medical devices be open-sourced for security auditing?",
            scenario: "Insulin pumps and pacemakers run proprietary firmware. Security researchers have found critical vulnerabilities (remote code execution) by reverse-engineering these devices.",
            options: [
                { label: "Yes — lives depend on this code; transparency enables community auditing", framework: "Public safety — security through transparency" },
                { label: "No — open-sourcing enables malicious actors to find exploits faster", framework: "Security through obscurity — limit attack surface knowledge" },
                { label: "Regulated disclosure — share with certified auditors, not publicly", framework: "Controlled access — balance transparency and safety" },
                { label: "Require formal verification (mathematical proof of correctness) instead", framework: "Engineering rigor — prove correctness, don't just review" }
            ],
            _answer: 2,
            explanation: "Regulated disclosure (as proposed by FDA guidance) balances safety and security. Independent certified labs can audit code under NDA. Full open-source may enable attacks before patches deploy; full secrecy enables zero-day vulnerabilities to persist.",
            articleSlug: "embedded-systems-security", tags: ["security", "medical", "ethics"]
        }
    ]
});

// ═══════════════════════════════════════════════════════════════════════════════
// COMPUTER ARCHITECTURE
// ═══════════════════════════════════════════════════════════════════════════════
const computerArch = buildQuiz({
    series: "computer-architecture",
    title: "Computer Architecture",
    salt: "comp-arch-2026",
    totalParts: 24,
    questions: [
        {
            id: "ca-q001", part: 1, difficulty: "beginner", type: "mcq",
            question: "Which component of a CPU performs arithmetic and logical operations?",
            options: ["Control Unit", "ALU (Arithmetic Logic Unit)", "Register File", "Cache Controller"],
            _answer: 1,
            explanation: "The ALU performs all arithmetic (+, -, ×, ÷) and logical (AND, OR, NOT, XOR, shifts) operations. The Control Unit coordinates instruction execution. Registers store data. Cache speeds up memory access.",
            articleSlug: "computer-architecture-cpu-fundamentals", tags: ["ALU", "CPU", "fundamentals"]
        },
        {
            id: "ca-q002", part: 2, difficulty: "intermediate", type: "true-false",
            question: "Von Neumann architecture stores instructions and data in separate memory systems.",
            _answer: false,
            explanation: "Von Neumann architecture uses a SINGLE unified memory for both instructions and data (shared bus). Harvard architecture uses SEPARATE memories. Modern CPUs use a modified Harvard design: separate L1 caches but unified main memory.",
            articleSlug: "computer-architecture-von-neumann", tags: ["Von Neumann", "Harvard"]
        },
        {
            id: "ca-q003", part: 3, difficulty: "intermediate", type: "fill-blank",
            question: "Amdahl's Law states that the maximum speedup from parallelization is limited by the ___ portion of the program.",
            _answer: "sequential",
            acceptAlso: ["serial", "non-parallelizable", "sequential portion"],
            explanation: "Amdahl's Law: Speedup = 1 / (s + (1-s)/p) where s = serial fraction, p = processors. Even with infinite processors, if 10% of code is serial, max speedup = 10×. The serial bottleneck dominates.",
            articleSlug: "computer-architecture-parallelism", tags: ["Amdahl's Law", "parallelism"]
        },
        {
            id: "ca-q004", part: 4, difficulty: "advanced", type: "calculation",
            question: "A processor has a 2GHz clock and averages 1.5 CPI. A new design reduces CPI to 1.2 but runs at 1.8GHz. Which is faster and by what percentage?",
            formula: "Execution time = Instructions × CPI / Clock_rate\nSpeedup = Old_time / New_time",
            _answer: 11,
            unit: "% faster (new design)",
            tolerance: 2,
            explanation: "Old: time ∝ I × 1.5 / 2G = 0.75I/G. New: time ∝ I × 1.2 / 1.8G = 0.667I/G. Speedup = 0.75/0.667 = 1.125, so new is 12.5% faster despite lower clock. CPI improvement outweighs clock reduction.",
            articleSlug: "computer-architecture-performance", tags: ["CPI", "performance", "clock"]
        },
        {
            id: "ca-q005", part: 5, difficulty: "advanced", type: "scenario",
            question: "Your CPU design team must choose between a deeper pipeline (15 stages) or wider superscalar (4-wide, 8 stages). The target market is smartphones. Which do you recommend?",
            scenario: {
                context: "ARM-based mobile SoC. Constraints: 3W thermal budget, 7nm process. Workload: mixed integer/FP, many branches.",
                metrics: { "Branch mispredict rate": "5%", "ILP available": "2.5 avg", "Target clock": "3GHz" }
            },
            options: [
                "Deeper pipeline — achieves higher clock speed, compensate for branches with better predictor",
                "Wider superscalar — exploits ILP without branch penalty, lower clock but higher throughput",
                "Hybrid: moderate depth (10 stages) + moderate width (3-wide) for balance",
                "Neither — use many simple in-order cores (throughput computing)"
            ],
            _answer: 2,
            explanation: "Mobile workloads have high branch rates, making deep pipelines wasteful (flush penalty = 14 cycles). Limited ILP (2.5) means 4-wide is over-provisioned. A balanced 10-stage 3-wide design maximizes perf/watt — the strategy Apple's M-series uses.",
            articleSlug: "computer-architecture-pipeline-design", tags: ["pipeline", "superscalar", "mobile"]
        },
        {
            id: "ca-q006", part: 6, difficulty: "intermediate", type: "ordering",
            question: "Arrange the memory hierarchy from fastest (lowest latency) to slowest:",
            items: ["DRAM (Main Memory)", "L1 Cache", "Registers", "SSD (Storage)", "L3 Cache"],
            _answer: ["Registers", "L1 Cache", "L3 Cache", "DRAM (Main Memory)", "SSD (Storage)"],
            explanation: "Registers: <1ns → L1 Cache: 1-2ns → L2: 3-10ns → L3: 10-30ns → DRAM: 50-100ns → SSD: 25-100μs → HDD: 5-10ms. Each level is ~10× slower but ~10× larger.",
            articleSlug: "computer-architecture-memory-hierarchy", tags: ["cache", "memory hierarchy"]
        },
        {
            id: "ca-q007", part: 7, difficulty: "advanced", type: "debug",
            question: "A CPU benchmark shows 15% lower performance than expected despite correct clock speed and instruction count. The L1 cache miss rate is 2%. What's the hidden bottleneck?",
            code: "// Benchmark profile:\n// Instructions executed: 10 billion\n// Clock cycles: 18 billion (expected: 15 billion)\n// L1 miss rate: 2%, L1 miss penalty: 20 cycles\n// L2 miss rate: 0.5% of L1 misses, penalty: 200 cycles\n// Branch mispredict: 3%, penalty: 12 cycles",
            options: [
                "L1 misses: 2% × 10B × 20 = 4B extra cycles — but that's already expected in the 15B figure",
                "Branch mispredictions: 3% × 10B × 12 = 3.6B extra cycles explains the gap",
                "L2 misses: 0.5% × 2% × 10B × 200 = 200M cycles — negligible",
                "Memory bandwidth saturation causing stalls not visible in miss rate"
            ],
            _answer: 1,
            explanation: "Expected extra cycles from branches: 10B × 0.03 × 12 = 3.6B. This accounts for the 3B cycle gap (18B actual - 15B expected). Branch misprediction cost is often underestimated because the penalty applies to every mispredicted branch, not just misses.",
            articleSlug: "computer-architecture-branch-prediction", tags: ["branch prediction", "performance"]
        },
        {
            id: "ca-q008", part: 8, difficulty: "intermediate", type: "mcq",
            question: "What does 'out-of-order execution' allow a processor to do?",
            options: [
                "Execute instructions in random order for parallelism",
                "Execute later instructions while earlier ones wait for data, preserving logical correctness",
                "Skip instructions that aren't needed",
                "Run multiple programs simultaneously"
            ],
            _answer: 1,
            explanation: "OoO execution lets the CPU find and execute independent instructions while others wait (e.g., for cache miss). A reorder buffer ensures results commit in program order, maintaining the illusion of sequential execution.",
            articleSlug: "computer-architecture-ooo", tags: ["OoO", "ILP"]
        },
        {
            id: "ca-q009", part: 9, difficulty: "advanced", type: "matching",
            question: "Match each cache coherence protocol state (MESI) to its meaning:",
            pairs: {
                left: ["Modified", "Exclusive", "Shared", "Invalid"],
                right: ["Cache line is dirty and only copy — must write back before eviction", "Cache line is clean and only copy — can be written without bus transaction", "Cache line is clean and may exist in other caches — must invalidate others before writing", "Cache line is not valid — must fetch from memory or another cache"]
            },
            _answer: [0, 1, 2, 3],
            explanation: "MESI protocol enables cache coherence in multi-core systems. M: exclusive dirty, E: exclusive clean, S: shared clean, I: invalid. Transitions happen on read/write from local or remote cores.",
            articleSlug: "computer-architecture-cache-coherence", tags: ["MESI", "cache coherence", "multicore"]
        },
        {
            id: "ca-q010", part: 10, difficulty: "advanced", type: "architecture",
            question: "You're designing a next-gen processor for AI inference workloads. Which approach maximizes TOPS/watt?",
            scenario: "Target: 100 TOPS at 10W for edge AI. Workload: primarily INT8 matrix multiplications with occasional FP16.",
            options: [
                { label: "Wide SIMD extensions on general-purpose cores (like AVX-512)", tradeoffs: ["Flexible", "Poor INT8 efficiency", "High power per core"] },
                { label: "Dedicated systolic array (like Google TPU)", tradeoffs: ["Maximum MAC/watt", "Fixed function", "Limited flexibility"] },
                { label: "Massive VLIW core with exposed parallelism", tradeoffs: ["Compiler-scheduled", "No dynamic overhead", "Poor branch handling"] },
                { label: "Dataflow architecture with reconfigurable compute grid", tradeoffs: ["Adaptive to model shapes", "Higher complexity", "Good energy efficiency for sparse models"] }
            ],
            _answer: 1,
            explanation: "Systolic arrays achieve maximum TOPS/watt for dense matrix operations by eliminating instruction fetch/decode overhead and reusing data spatially. Google TPU, Apple ANE, and most AI accelerators use this approach for the INT8 matmul-dominated workload.",
            articleSlug: "computer-architecture-accelerators", tags: ["AI", "systolic array", "TPU"]
        },
        {
            id: "ca-q011", part: 11, difficulty: "beginner", type: "true-false",
            question: "A 64-bit processor can always address more physical memory than a 32-bit processor.",
            _answer: false,
            explanation: "A 64-bit processor has a larger VIRTUAL address space (2^64 vs 2^32), but physical memory depends on the physical address bus width. Some 32-bit CPUs support PAE (36-bit physical = 64GB). Some 64-bit CPUs only implement 48 physical address bits.",
            articleSlug: "computer-architecture-addressing", tags: ["addressing", "64-bit"]
        },
        {
            id: "ca-q012", part: 12, difficulty: "intermediate", type: "code-output",
            question: "A direct-mapped cache has 256 entries and 64-byte lines. Which cache set does memory address 0x1A3F0 map to?",
            code: "# Address: 0x1A3F0 = 0001_1010_0011_1111_0000\n# Line size: 64 bytes = 6 offset bits\n# Sets: 256 = 8 index bits\n# Set index = (address >> 6) & 0xFF",
            _answer: "252",
            acceptAlso: ["0xFC", "set 252"],
            explanation: "Remove offset bits: 0x1A3F0 >> 6 = 0x68FC. Extract 8 index bits: 0x68FC & 0xFF = 0xFC = 252. Address maps to cache set 252.",
            articleSlug: "computer-architecture-cache-mapping", tags: ["cache", "direct-mapped"]
        },
        {
            id: "ca-q013", part: 13, difficulty: "advanced", type: "ethical",
            question: "Should CPU vendors disclose microarchitectural details that could enable side-channel attacks (like Spectre/Meltdown)?",
            scenario: "Spectre exploits speculative execution. Researchers discovered it by understanding undocumented branch predictor behavior. Full disclosure helps both defenders (build mitigations) and attackers (craft exploits).",
            options: [
                { label: "Full disclosure — security researchers need details to find and fix vulnerabilities", framework: "Transparency — sunlight is the best disinfectant" },
                { label: "No disclosure — keeps attack surface hidden from adversaries", framework: "Security through obscurity" },
                { label: "Coordinated disclosure to security researchers under NDA, public details after patches", framework: "Responsible disclosure — fix first, publish later" },
                { label: "Redesign hardware to be inherently resistant regardless of disclosure", framework: "Security by design — make disclosure irrelevant" }
            ],
            _answer: 2,
            explanation: "Coordinated disclosure is industry practice for CPU vulnerabilities (Project Zero's 90-day policy). It gives vendors time to develop microcode patches while enabling researchers to validate fixes. Spectre was disclosed this way.",
            articleSlug: "computer-architecture-security", tags: ["Spectre", "side-channel", "disclosure"]
        }
    ]
});

// ═══════════════════════════════════════════════════════════════════════════════
// MARKETING STRATEGY
// ═══════════════════════════════════════════════════════════════════════════════
const marketingStrategy = buildQuiz({
    series: "marketing-strategy",
    title: "Marketing Strategy",
    salt: "mktg-strat-2026",
    totalParts: 21,
    questions: [
        {
            id: "ms-q001", part: 1, difficulty: "beginner", type: "mcq",
            question: "The 4 Ps of marketing are Product, Price, Place, and ___.",
            options: ["People", "Promotion", "Purpose", "Platform"],
            _answer: 1,
            explanation: "McCarthy's 4 Ps (1960): Product (what you sell), Price (what you charge), Place (where/how you sell), Promotion (how you communicate). Extended to 7 Ps: +People, Process, Physical Evidence.",
            articleSlug: "marketing-strategy-fundamentals", tags: ["4Ps", "marketing mix"]
        },
        {
            id: "ms-q002", part: 2, difficulty: "intermediate", type: "fill-blank",
            question: "STP in marketing stands for Segmentation, Targeting, and ___.",
            _answer: "Positioning",
            acceptAlso: ["positioning"],
            explanation: "STP is the strategic marketing framework: Segment the market into groups, Target the most attractive segments, Position your product distinctly in the minds of the target audience.",
            articleSlug: "marketing-strategy-stp", tags: ["STP", "segmentation", "positioning"]
        },
        {
            id: "ms-q003", part: 3, difficulty: "intermediate", type: "true-false",
            question: "A brand's positioning should try to appeal to all customer segments simultaneously.",
            _answer: false,
            explanation: "Effective positioning requires sacrifice — owning a specific idea in the customer's mind. Trying to be everything to everyone results in a diluted, forgettable brand. 'The essence of positioning is sacrifice.' — Jack Trout",
            articleSlug: "marketing-strategy-positioning", tags: ["positioning", "differentiation"]
        },
        {
            id: "ms-q004", part: 4, difficulty: "advanced", type: "calculation",
            question: "A digital ad campaign has 1M impressions, 2.5% CTR, 4% conversion rate, and $50 average order value. With a CPC of $0.80, what's the ROAS (Return on Ad Spend)?",
            formula: "ROAS = Revenue / Ad_Spend = (Impressions × CTR × Conv_Rate × AOV) / (Impressions × CTR × CPC)",
            _answer: 2.5,
            unit: "x",
            tolerance: 0.1,
            explanation: "Clicks = 1M × 2.5% = 25,000. Cost = 25,000 × $0.80 = $20,000. Conversions = 25,000 × 4% = 1,000. Revenue = 1,000 × $50 = $50,000. ROAS = $50,000 / $20,000 = 2.5×.",
            articleSlug: "marketing-strategy-digital-metrics", tags: ["ROAS", "digital marketing", "metrics"]
        },
        {
            id: "ms-q005", part: 5, difficulty: "intermediate", type: "matching",
            question: "Match each pricing strategy to its description:",
            pairs: {
                left: ["Penetration pricing", "Price skimming", "Freemium", "Value-based pricing"],
                right: ["Low initial price to gain market share quickly", "High initial price, gradually reduced as market matures", "Free basic version, charge for premium features", "Price set by perceived customer value, not cost"]
            },
            _answer: [0, 1, 2, 3],
            explanation: "Penetration gains share (Netflix early days). Skimming maximizes early adopter revenue (new iPhones). Freemium converts free users (Spotify). Value-based charges what it's worth to the customer (B2B SaaS).",
            articleSlug: "marketing-strategy-pricing", tags: ["pricing", "strategy"]
        },
        {
            id: "ms-q006", part: 6, difficulty: "advanced", type: "scenario",
            question: "A B2B SaaS company has 10% monthly churn and $500 CAC. Monthly subscription is $49. Is this business sustainable?",
            scenario: {
                context: "Cloud project management tool. 2,000 customers. Growing 5% monthly. NPS: 32.",
                metrics: { "Monthly churn": "10%", "CAC": "$500", "MRR per customer": "$49", "Average lifespan": "10 months" }
            },
            options: [
                "Yes — growth rate (5%) offsets churn and LTV exceeds CAC",
                "No — LTV ($490) barely covers CAC ($500); payback period is 10+ months and churn is unsustainable",
                "Depends on whether they can reduce churn below 5% within 6 months",
                "Yes — if they raise prices to $99/month to improve unit economics"
            ],
            _answer: 1,
            explanation: "LTV = $49/month × 10 months = $490. LTV:CAC ratio = 0.98:1 (below the 3:1 minimum for healthy SaaS). The company is spending more to acquire a customer than they'll ever earn back. Must fix retention before spending on growth.",
            articleSlug: "marketing-strategy-metrics", tags: ["LTV", "CAC", "SaaS", "churn"]
        },
        {
            id: "ms-q007", part: 7, difficulty: "advanced", type: "ordering",
            question: "Arrange the customer journey stages (AARRR pirate metrics) in order:",
            items: ["Revenue (pay you money)", "Acquisition (find you)", "Retention (come back)", "Referral (tell others)", "Activation (first value moment)"],
            _answer: ["Acquisition (find you)", "Activation (first value moment)", "Retention (come back)", "Revenue (pay you money)", "Referral (tell others)"],
            explanation: "AARRR framework (Dave McClure): Acquisition → Activation → Retention → Revenue → Referral. Each stage is a funnel — optimize the leakiest stage first for maximum impact.",
            articleSlug: "marketing-strategy-growth", tags: ["AARRR", "pirate metrics", "funnel"]
        },
        {
            id: "ms-q008", part: 8, difficulty: "intermediate", type: "mcq",
            question: "What is a 'positioning statement'?",
            options: [
                "A company's mission and vision combined",
                "A concise internal statement defining target audience, category, unique benefit, and reason to believe",
                "The tagline used in advertising campaigns",
                "A legal disclaimer about product capabilities"
            ],
            _answer: 1,
            explanation: "Format: 'For [target audience], [brand] is the [category] that [unique benefit] because [reason to believe].' It's internal strategy, not an ad copy — it guides all marketing decisions.",
            articleSlug: "marketing-strategy-positioning-statement", tags: ["positioning", "brand strategy"]
        },
        {
            id: "ms-q009", part: 9, difficulty: "advanced", type: "debug",
            question: "A company's email campaign has a 45% open rate but only 0.3% click-through rate. Find the gap:",
            code: "Subject line: '50% OFF — Today Only! 🔥'\nOpen rate: 45% (industry avg: 21%)\nEmail content: 2000-word blog post about product features\nCTA: Small text link at the bottom: 'Shop now'\nClick rate: 0.3% (industry avg: 2.6%)",
            options: [
                "Clickbait subject creates opens but content doesn't match the promise — expectation mismatch",
                "Email is too long — people opened expecting a deal but found a blog post",
                "CTA is buried and unclear — should be prominent button above the fold",
                "All of the above — subject/content mismatch + poor content + weak CTA"
            ],
            _answer: 3,
            explanation: "Triple failure: (1) Subject promises 50% off, content doesn't deliver immediately, (2) 2000 words is far too long for a promotional email, (3) CTA buried as text link vs. prominent button. Fix: match promise in subject, short copy, bold CTA above fold.",
            articleSlug: "marketing-strategy-email", tags: ["email marketing", "CTR", "CTA"]
        },
        {
            id: "ms-q010", part: 10, difficulty: "advanced", type: "architecture",
            question: "You're launching a new product in a category dominated by one incumbent (70% market share). What's your go-to-market strategy?",
            scenario: "New cloud-based design tool competing with Figma. Your tool has better AI features but less mature collaboration. Budget: $2M for launch year.",
            options: [
                { label: "Head-to-head — compete on features, lower price", tradeoffs: ["Direct comparison", "Requires 10× marketing budget vs. incumbent", "Price war risk"] },
                { label: "Niche first — dominate one underserved segment before expanding", tradeoffs: ["Defensible beachhead", "Smaller initial market", "Build reputation before scaling"] },
                { label: "Platform play — build ecosystem/marketplace that incumbent can't replicate", tradeoffs: ["Network effects moat", "Requires scale to start", "Chicken-and-egg problem"] },
                { label: "Category creation — redefine the market so you're not compared to incumbent", tradeoffs: ["No direct competitor", "Expensive education cost", "Risk of category not resonating"] }
            ],
            _answer: 1,
            explanation: "Geoffrey Moore's 'Crossing the Chasm': new entrants should dominate a niche (beachhead strategy) where the incumbent underserves. Figma themselves did this — started with web designers before expanding to all product design. Your AI features serve a specific segment better.",
            articleSlug: "marketing-strategy-go-to-market", tags: ["GTM", "competition", "positioning"]
        },
        {
            id: "ms-q011", part: 11, difficulty: "beginner", type: "mcq",
            question: "What does SEO stand for?",
            options: ["Social Engagement Optimization", "Search Engine Optimization", "Sales Efficiency Operations", "Strategic Equity Outcomes"],
            _answer: 1,
            explanation: "SEO (Search Engine Optimization) is the practice of improving your website's visibility in organic (unpaid) search results. It involves content quality, technical optimization, and building authority through backlinks.",
            articleSlug: "marketing-strategy-seo", tags: ["SEO", "digital marketing"]
        },
        {
            id: "ms-q012", part: 12, difficulty: "advanced", type: "diagnosis",
            question: "A brand's social media followers grew 300% in 3 months but revenue dropped 15%. Diagnose the disconnect:",
            presentation: {
                context: "DTC fashion brand. Hired influencer marketing agency. Instagram went from 50K to 200K followers.",
                findings: [
                    "Follower growth: 50K → 200K (4x)",
                    "Engagement rate dropped: 4.2% → 1.1%",
                    "New followers demographics: 60% outside target market (wrong country/age)",
                    "Influencer audience: entertainment/comedy, not fashion buyers",
                    "Website traffic from social: unchanged (same as before campaign)"
                ]
            },
            options: [
                "Vanity metrics — followers are bots or wrong audience; no purchase intent",
                "Algorithm penalty from sudden follower spike",
                "Brand dilution from being associated with non-fashion influencers",
                "Seasonal decline in fashion retail unrelated to social"
            ],
            _answer: 0,
            explanation: "Classic vanity metric trap. The influencer brought their audience (entertainment fans) who have no interest in buying fashion. Followers ≠ customers. The brand optimized for the wrong metric. True KPIs: conversion rate, revenue per follower, customer acquisition.",
            articleSlug: "marketing-strategy-analytics", tags: ["vanity metrics", "influencer", "analytics"]
        },
        {
            id: "ms-q013", part: 13, difficulty: "intermediate", type: "ethical",
            question: "Should brands use dark patterns (manipulative UI/UX) to increase conversion rates?",
            scenario: "Examples: pre-checked 'subscribe' boxes, confusing unsubscribe flows, fake urgency timers ('Only 2 left!'), hidden fees revealed at checkout, shame-based opt-outs ('No, I don't want to save money').",
            options: [
                { label: "Whatever converts — business exists to maximize revenue", framework: "Shareholder primacy — profit maximization" },
                { label: "Never — dark patterns erode trust and create long-term brand damage", framework: "Brand equity — trust is the asset" },
                { label: "Some urgency/scarcity is fine if truthful; manipulation is not", framework: "Truthfulness — line between persuasion and deception" },
                { label: "Regulate with fines — let the market decide ethics within legal bounds", framework: "Legal compliance — law as moral minimum" }
            ],
            _answer: 2,
            explanation: "Genuine scarcity ('3 tickets left at this price') and social proof ('1,247 people bought today') are ethical persuasion. Fake timers, hidden costs, and shame-based language are deception. The FTC increasingly treats dark patterns as unfair trade practices.",
            articleSlug: "marketing-strategy-ethics", tags: ["dark patterns", "ethics", "UX"]
        }
    ]
});

// ═══════════════════════════════════════════════════════════════════════════════
// BEHAVIORAL PSYCHOLOGY
// ═══════════════════════════════════════════════════════════════════════════════
const behavioralPsych = buildQuiz({
    series: "behavioral-psychology",
    title: "Behavioral Psychology",
    salt: "behav-psy-2026",
    totalParts: 11,
    questions: [
        {
            id: "bp-q001", part: 1, difficulty: "beginner", type: "mcq",
            question: "In classical conditioning, Pavlov's dogs learned to salivate at the sound of a bell. The bell is the:",
            options: ["Unconditioned stimulus", "Conditioned stimulus", "Unconditioned response", "Conditioned response"],
            _answer: 1,
            explanation: "The bell starts as neutral, becomes the conditioned stimulus (CS) after pairing with food (unconditioned stimulus). Salivation to the bell is the conditioned response (CR). Food naturally causing salivation is the unconditioned stimulus-response pair.",
            articleSlug: "behavioral-psychology-classical-conditioning", tags: ["classical conditioning", "Pavlov"]
        },
        {
            id: "bp-q002", part: 2, difficulty: "intermediate", type: "matching",
            question: "Match each reinforcement schedule to its description:",
            pairs: {
                left: ["Fixed Ratio", "Variable Ratio", "Fixed Interval", "Variable Interval"],
                right: ["Reward after set number of responses (factory piece work)", "Reward after unpredictable number of responses (slot machines)", "Reward after set time period (weekly paycheck)", "Reward after unpredictable time periods (checking email)"]
            },
            _answer: [0, 1, 2, 3],
            explanation: "Variable ratio (VR) produces the highest, most steady response rates because the unpredictability prevents extinction. This is why gambling and social media (variable reward) are so engaging.",
            articleSlug: "behavioral-psychology-operant-conditioning", tags: ["reinforcement", "schedules"]
        },
        {
            id: "bp-q003", part: 3, difficulty: "intermediate", type: "true-false",
            question: "Negative reinforcement means punishing someone for unwanted behavior.",
            _answer: false,
            explanation: "Negative reinforcement INCREASES behavior by REMOVING something aversive. Example: taking aspirin (behavior) removes headache (aversive stimulus), making you more likely to take aspirin next time. It's not punishment — punishment decreases behavior.",
            articleSlug: "behavioral-psychology-reinforcement", tags: ["negative reinforcement", "punishment"]
        },
        {
            id: "bp-q004", part: 4, difficulty: "intermediate", type: "fill-blank",
            question: "Albert Bandura's Social Learning Theory introduced the concept of ___ learning — learning by watching others.",
            _answer: "observational",
            acceptAlso: ["vicarious", "observational learning", "modeling"],
            explanation: "Bandura's Bobo doll experiment (1961) demonstrated that children learn aggressive behavior by observing adult models — without direct reinforcement. This challenged the behaviorist view that learning requires direct experience.",
            articleSlug: "behavioral-psychology-social-learning", tags: ["Bandura", "observational", "modeling"]
        },
        {
            id: "bp-q005", part: 5, difficulty: "advanced", type: "scenario",
            question: "A parent wants to stop their child's tantrum behavior in grocery stores. The child screams until the parent buys candy. What's the behavioral analysis?",
            scenario: {
                context: "Child throws tantrums in stores. Parent consistently gives in after 3-5 minutes of screaming. Tantrums have increased in frequency and duration over months.",
                findings: ["Antecedent: child sees candy display", "Behavior: screaming, crying, falling on floor", "Consequence: parent buys candy (tantrum stops)"]
            },
            options: [
                "The parent has positively reinforced tantrums — candy (reward) follows screaming",
                "The child has negatively reinforced the parent — buying candy removes the aversive screaming",
                "Both A and B — a dual reinforcement trap maintaining the behavior for both parties",
                "The child has a sensory processing disorder triggered by the store environment"
            ],
            _answer: 2,
            explanation: "Coercion trap (Patterson, 1982): The child is positively reinforced (gets candy). The parent is negatively reinforced (screaming stops). Both parties' behavior is strengthened, escalating the cycle. Fix: extinction (planned ignoring) + positive reinforcement for appropriate behavior.",
            articleSlug: "behavioral-psychology-applied", tags: ["reinforcement trap", "ABA", "extinction"]
        },
        {
            id: "bp-q006", part: 6, difficulty: "advanced", type: "ordering",
            question: "Arrange the stages of systematic desensitization (for phobia treatment) in correct order:",
            items: ["Practice relaxation while imagining least-feared item", "Create anxiety hierarchy (least to most feared situations)", "Learn progressive muscle relaxation", "Gradually progress to most-feared situation while maintaining relaxation", "Confront real-world situation (in vivo exposure)"],
            _answer: ["Learn progressive muscle relaxation", "Create anxiety hierarchy (least to most feared situations)", "Practice relaxation while imagining least-feared item", "Gradually progress to most-feared situation while maintaining relaxation", "Confront real-world situation (in vivo exposure)"],
            explanation: "Wolpe's (1958) systematic desensitization: learn relaxation → build hierarchy → pair relaxation with progressively feared stimuli. Based on reciprocal inhibition — you can't be relaxed and anxious simultaneously.",
            articleSlug: "behavioral-psychology-therapy", tags: ["desensitization", "phobia", "therapy"]
        },
        {
            id: "bp-q007", part: 7, difficulty: "advanced", type: "debug",
            question: "A token economy in a classroom isn't working — students initially improved but behavior reverted after 2 weeks. Find the implementation flaw:",
            code: "Token Economy Design:\n- Students earn tokens for completing homework\n- Token store: prizes available at end of month\n- All students earn 1 token per assignment regardless of quality\n- No tokens can be lost (no response cost)\n- Prize tier: 30 tokens = small prize, 60 = medium, 90 = large",
            options: [
                "Delay too long — monthly rewards don't maintain motivation; need daily/weekly exchange opportunities",
                "No quality differential — 1 token regardless of effort removes motivation to excel",
                "No response cost — there's no consequence for disruptive behavior",
                "All of the above — multiple design flaws undermine the system"
            ],
            _answer: 3,
            explanation: "Three flaws: (1) Monthly exchange is too delayed for behavior maintenance (should be daily/weekly), (2) Flat reward regardless of quality doesn't shape improvement, (3) Without response cost, students earn tokens but face no token loss for misbehavior. Good token economies need immediate exchange, graduated rewards, and balanced incentives.",
            articleSlug: "behavioral-psychology-token-economy", tags: ["token economy", "applied behavior analysis"]
        },
        {
            id: "bp-q008", part: 8, difficulty: "intermediate", type: "mcq",
            question: "The 'extinction burst' phenomenon means that when reinforcement stops, the behavior initially:",
            options: ["Immediately decreases", "Temporarily increases in frequency and intensity", "Stays the same for several days", "Transfers to a new behavior immediately"],
            _answer: 1,
            explanation: "When reinforcement is withdrawn, organisms initially respond more frequently and intensely (extinction burst) before the behavior eventually decreases. A child whose tantrums stop 'working' will tantrum harder before giving up.",
            articleSlug: "behavioral-psychology-extinction", tags: ["extinction", "extinction burst"]
        },
        {
            id: "bp-q009", part: 9, difficulty: "advanced", type: "code-output",
            question: "A rat in a Skinner box presses a lever 45 times in 15 minutes on a VR-5 schedule. How many reinforcements did it receive?",
            code: "# VR-5 = Variable Ratio 5\n# Average: 1 reinforcement per 5 responses\ntotal_responses = 45\navg_ratio = 5\nreinforcements = total_responses // avg_ratio\nprint(reinforcements)",
            _answer: "9",
            acceptAlso: ["approximately 9", "~9"],
            explanation: "VR-5 means on average, every 5th response is reinforced. 45 responses ÷ 5 = 9 reinforcements. The actual number varies (might be after 3, 7, 4, 6, 5 presses) but averages to 5 responses per reinforcement.",
            articleSlug: "behavioral-psychology-schedules", tags: ["variable ratio", "operant"]
        },
        {
            id: "bp-q010", part: 10, difficulty: "advanced", type: "ethical",
            question: "Should behavioral modification techniques (ABA) be used to make autistic children appear 'neurotypical'?",
            scenario: "Applied Behavior Analysis (ABA) is the most evidence-supported intervention for autism. Critics from the neurodiversity movement argue it aims to suppress autistic traits (stimming, special interests) rather than support autistic thriving.",
            options: [
                { label: "Yes — ABA improves functional outcomes and independence for autistic individuals", framework: "Outcomes-based — measurable improvement in life skills" },
                { label: "No — suppressing natural behaviors causes psychological harm (masking trauma)", framework: "Neurodiversity — autism is difference, not deficit" },
                { label: "Modernized ABA should focus on communication and safety, not compliance and conformity", framework: "Balanced — target functional goals, respect identity" },
                { label: "Let autistic adults decide which behaviors they want to change (self-determination)", framework: "Autonomy — nothing about us without us" }
            ],
            _answer: 2,
            explanation: "Modern 'naturalistic' ABA focuses on functional communication, safety skills, and autonomy — not suppressing stimming or enforcing eye contact. The field has evolved from compliance-based to person-centered, but debate continues.",
            articleSlug: "behavioral-psychology-ethics", tags: ["ABA", "autism", "ethics", "neurodiversity"]
        },
        {
            id: "bp-q011", part: 11, difficulty: "intermediate", type: "diagnosis",
            question: "A dog that was housetrained starts urinating indoors again after the owner's schedule changed. Diagnose the behavioral mechanism:",
            presentation: {
                context: "Dog housetrained for 2 years. Owner switched from work-from-home to office job (gone 9 hours/day). Accidents started in week 2.",
                findings: [
                    "No medical issues (vet clearance)",
                    "Accidents only occur during owner's absence",
                    "Dog shows distress signs when owner prepares to leave (pacing, whining)",
                    "No accidents on weekends when owner is home",
                    "Previously on a predictable 4-hour outdoor schedule, now 9 hours between breaks"
                ]
            },
            options: [
                "Separation anxiety — distress-driven behavior, not a training failure",
                "Schedule disruption — bladder capacity exceeded (9 hours too long)",
                "Extinction of trained behavior — reinforcement schedule for outdoor elimination disrupted",
                "Both B and C — physical need + disrupted reinforcement schedule"
            ],
            _answer: 3,
            explanation: "Two factors: (1) The dog physically can't hold it for 9 hours (schedule disruption), and (2) the reliable outdoor-elimination→reward pattern was broken (extinction). The distress signs suggest mild separation anxiety as a complicating factor. Fix: midday walk + re-establish outdoor reinforcement.",
            articleSlug: "behavioral-psychology-animal", tags: ["animal behavior", "extinction", "diagnosis"]
        }
    ]
});

// ═══════════════════════════════════════════════════════════════════════════════
// GAME DEVELOPMENT
// ═══════════════════════════════════════════════════════════════════════════════
const gameDevelopment = buildQuiz({
    series: "game-development",
    title: "Game Development",
    salt: "game-dev-2026",
    totalParts: 13,
    questions: [
        {
            id: "gd-q001", part: 1, difficulty: "beginner", type: "mcq",
            question: "What is the 'game loop' in game development?",
            options: ["A for-loop that counts game levels", "The continuous cycle of input→update→render that runs every frame", "A marketing strategy for game releases", "The lifecycle from concept to release"],
            _answer: 1,
            explanation: "The game loop is the heartbeat of every game: Process Input (keyboard/controller) → Update Game State (physics, AI, logic) → Render (draw to screen). This runs 30-60+ times per second.",
            articleSlug: "game-development-fundamentals", tags: ["game loop", "fundamentals"]
        },
        {
            id: "gd-q002", part: 2, difficulty: "intermediate", type: "true-false",
            question: "A fixed timestep update loop guarantees deterministic game simulation regardless of frame rate.",
            _answer: true,
            explanation: "Fixed timestep (e.g., physics updates at exactly 60Hz) ensures identical results regardless of rendering speed. Variable timestep causes non-determinism (different results on fast vs. slow machines). Fix: decouple update from render.",
            articleSlug: "game-development-game-loop", tags: ["timestep", "determinism"]
        },
        {
            id: "gd-q003", part: 3, difficulty: "intermediate", type: "fill-blank",
            question: "In game physics, detecting when two objects overlap is called ___ detection.",
            _answer: "collision",
            acceptAlso: ["collision detection", "overlap"],
            explanation: "Collision detection determines IF objects intersect (broad phase: AABB, spatial hashing → narrow phase: GJK, SAT). Collision resolution determines WHAT happens (bounce, stick, destroy). Both run every physics update.",
            articleSlug: "game-development-physics", tags: ["collision", "physics"]
        },
        {
            id: "gd-q004", part: 4, difficulty: "intermediate", type: "code-output",
            question: "What's the result of this lerp (linear interpolation) call?",
            code: "function lerp(a, b, t) {\n    return a + (b - a) * t;\n}\n// Player position moving from 100 to 500\n// t = 0.25 (25% of the way)\nconsole.log(lerp(100, 500, 0.25));",
            _answer: "200",
            acceptAlso: ["200.0"],
            explanation: "lerp(100, 500, 0.25) = 100 + (500-100) × 0.25 = 100 + 100 = 200. At t=0: returns a (start). At t=1: returns b (end). At t=0.25: 25% of the way from a to b. Lerp is fundamental to smooth movement and animation.",
            articleSlug: "game-development-math", tags: ["lerp", "interpolation", "math"]
        },
        {
            id: "gd-q005", part: 5, difficulty: "advanced", type: "debug",
            question: "A 2D platformer has a 'double jump' bug — players can jump infinite times. Find the error:",
            code: "class Player {\n    constructor() {\n        this.jumpsLeft = 2;\n        this.isGrounded = false;\n    }\n    \n    update() {\n        if (this.checkGround()) {\n            this.isGrounded = true;\n        }\n        \n        if (input.jumpPressed && this.jumpsLeft > 0) {\n            this.velocity.y = -JUMP_FORCE;\n            this.jumpsLeft--;\n        }\n    }\n    \n    checkGround() {\n        // raycast down...\n    }\n}",
            options: [
                "jumpsLeft is never reset to 2 when the player lands — isGrounded is set but jumpsLeft stays at 0",
                "jumpPressed should be jumpJustPressed — holding jump fires every frame",
                "Both A and B — missing reset AND missing input edge detection",
                "The jump force should be applied differently"
            ],
            _answer: 2,
            explanation: "Two bugs: (1) jumpsLeft never resets when isGrounded becomes true (need: if grounded, jumpsLeft = 2). (2) jumpPressed fires every frame the button is held — need edge detection (pressed this frame, not last frame) to prevent consuming all jumps instantly.",
            articleSlug: "game-development-player-controller", tags: ["platformer", "jump", "debugging"]
        },
        {
            id: "gd-q006", part: 6, difficulty: "advanced", type: "scenario",
            question: "Your open-world game stutters when the player moves between zones. Each zone loads 500MB of assets. What's your streaming strategy?",
            scenario: {
                context: "3D open-world RPG. 16 zones, each 500MB. Player moves freely between zones. Target: 60fps with no visible loading.",
                metrics: { "Disk read speed": "2GB/s (NVMe)", "RAM budget": "8GB for game assets", "Zone transition time": "~10 seconds of walking" },
                constraints: ["No loading screens", "Max 2 zones in RAM at once (1GB limit)", "Player can reverse direction"]
            },
            options: [
                "Load adjacent zones asynchronously when player enters a trigger boundary",
                "Stream individual assets based on camera frustum + distance (LOD streaming)",
                "Predictive loading based on player velocity vector — preload in movement direction",
                "All zones loaded at lowest LOD; high-detail streamed on approach"
            ],
            _answer: 2,
            explanation: "Velocity-based predictive loading (used in Spider-Man, Horizon) starts streaming assets in the player's movement direction well before they arrive. Combined with LOD streaming for immediate visual coverage. Reversals trigger emergency low-LOD fallbacks.",
            articleSlug: "game-development-streaming", tags: ["streaming", "open world", "LOD"]
        },
        {
            id: "gd-q007", part: 7, difficulty: "advanced", type: "matching",
            question: "Match each design pattern to its game development use:",
            pairs: {
                left: ["Object Pool", "State Machine", "Observer/Event", "Entity Component System (ECS)"],
                right: ["Reuse pre-allocated objects (bullets, particles) to avoid GC spikes", "Manage character animations and AI behavior transitions", "Decouple systems (UI reacts to health change without direct reference)", "Compose game entities from reusable data components (position, health, render)"]
            },
            _answer: [0, 1, 2, 3],
            explanation: "Object Pool avoids allocation (critical for 60fps). State Machine handles transitions cleanly. Observer decouples systems. ECS is the modern architecture for cache-friendly, composable game objects (used by Unity DOTS, Bevy).",
            articleSlug: "game-development-patterns", tags: ["patterns", "ECS", "architecture"]
        },
        {
            id: "gd-q008", part: 8, difficulty: "advanced", type: "calculation",
            question: "A game renders at 60fps. Each frame has 16.67ms budget. If physics takes 4ms, AI takes 3ms, and rendering takes 8ms, how much time remains for gameplay logic?",
            formula: "Remaining = Frame_budget - (Physics + AI + Rendering)",
            _answer: 1.67,
            unit: "ms",
            tolerance: 0.1,
            explanation: "16.67ms - 4ms - 3ms - 8ms = 1.67ms remaining. This is extremely tight — one unexpected spike in any system causes a frame drop. Optimization or moving work to background threads is essential.",
            articleSlug: "game-development-performance", tags: ["frame budget", "performance", "60fps"]
        },
        {
            id: "gd-q009", part: 9, difficulty: "intermediate", type: "ordering",
            question: "Arrange the typical game render pipeline in correct order:",
            items: ["Post-processing (bloom, color grading, AA)", "Geometry processing (vertex shaders, transforms)", "Rasterization (triangles to pixels)", "Fragment/Pixel shading (texturing, lighting)", "Draw call submission (CPU to GPU)"],
            _answer: ["Draw call submission (CPU to GPU)", "Geometry processing (vertex shaders, transforms)", "Rasterization (triangles to pixels)", "Fragment/Pixel shading (texturing, lighting)", "Post-processing (bloom, color grading, AA)"],
            explanation: "CPU submits draw calls → GPU vertex shader transforms geometry → Rasterizer converts triangles to fragments → Fragment shader computes color/lighting → Post-processing applies screen-space effects.",
            articleSlug: "game-development-rendering", tags: ["render pipeline", "GPU", "shaders"]
        },
        {
            id: "gd-q010", part: 10, difficulty: "advanced", type: "architecture",
            question: "You're building a multiplayer battle royale for 100 players. Which networking architecture?",
            scenario: "100-player shooter. Map size: 4km². Need: position updates 20Hz, hit detection authority, anti-cheat. Platform: PC + console cross-play.",
            options: [
                { label: "Peer-to-peer mesh (each player connects to all others)", tradeoffs: ["No server cost", "O(n²) connections", "No authority for anti-cheat", "NAT traversal nightmare"] },
                { label: "Dedicated server with client-side prediction + server reconciliation", tradeoffs: ["Authoritative anti-cheat", "Server cost", "Latency compensation needed", "Industry standard"] },
                { label: "Relay server (forwards packets, no game logic)", tradeoffs: ["Simple server", "Low cost", "No authoritative state", "Can't prevent cheating"] },
                { label: "Distributed server cluster (zone-based authority)", tradeoffs: ["Scales to 1000+ players", "Complex", "Zone handoff latency", "Expensive infrastructure"] }
            ],
            _answer: 1,
            explanation: "Dedicated server with client-side prediction is the standard for competitive shooters (Fortnite, Apex, PUBG). The server is authoritative (prevents cheating), clients predict locally for responsiveness, server reconciles discrepancies. 100 players is within single-server capability.",
            articleSlug: "game-development-networking", tags: ["multiplayer", "netcode", "prediction"]
        },
        {
            id: "gd-q011", part: 11, difficulty: "intermediate", type: "mcq",
            question: "What does 'juice' refer to in game design?",
            options: ["The game's monetization strategy", "Excessive visual/audio feedback that makes interactions feel satisfying", "The narrative storyline or 'plot juice'", "Performance optimization (squeezing out more FPS)"],
            _answer: 1,
            explanation: "'Juice' (Jan Willem Nijman, 2012) is the excessive positive feedback for player actions: screen shake, particles, sound effects, slow-motion hits, camera effects. It makes simple mechanics feel incredible and is the difference between 'functional' and 'fun'.",
            articleSlug: "game-development-game-feel", tags: ["game feel", "juice", "feedback"]
        },
        {
            id: "gd-q012", part: 12, difficulty: "advanced", type: "ethical",
            question: "Should games with loot boxes (random paid rewards) be regulated as gambling?",
            scenario: "FIFA Ultimate Team, Genshin Impact, and others generate billions from randomized paid rewards. Belgium and Netherlands banned them. Children can access these systems. The psychological mechanisms mirror slot machines.",
            options: [
                { label: "Yes — random paid rewards exploit the same neural pathways as gambling", framework: "Harm prevention — protect vulnerable populations" },
                { label: "No — players know they're buying randomized content; it's entertainment", framework: "Consumer choice — informed adults can decide" },
                { label: "Require probability disclosure + spending limits, but don't ban", framework: "Regulation — transparency without prohibition" },
                { label: "Ban only for minors; adults can consent to random mechanics", framework: "Age-gating — protect children, respect adult autonomy" }
            ],
            _answer: 2,
            explanation: "Most regulatory bodies are converging on disclosure + limits: Japan's kompu gacha ban, China's probability disclosure requirement, and proposed EU regulation. Full bans are too restrictive; no regulation enables exploitation.",
            articleSlug: "game-development-monetization", tags: ["loot boxes", "ethics", "gambling"]
        },
        {
            id: "gd-q013", part: 13, difficulty: "advanced", type: "diagnosis",
            question: "Players report your game 'feels sluggish' despite 60fps. Controller input to character movement feels delayed. Diagnose:",
            presentation: {
                context: "3D action game running at solid 60fps (16.6ms frame time). Players consistently report 'input lag'. Measured end-to-end latency: 133ms.",
                findings: [
                    "Input polling: once per frame (16.6ms avg delay)",
                    "Triple buffering enabled: 3 frames of render latency (49.8ms)",
                    "Display: 60Hz with ~8ms pixel response time",
                    "Game logic processes input on frame N, visible on frame N+3",
                    "Total: 16.6ms (poll) + 49.8ms (triple buffer) + 16.6ms (display scan) + 8ms (pixel) = ~91ms minimum"
                ]
            },
            options: [
                "Triple buffering adds 2 extra frames of latency — switch to double buffering",
                "Input polling once per frame adds a half-frame average delay — poll at higher rate",
                "Triple buffering is the primary culprit at 3× frame time of added latency",
                "All contribute but triple buffering (3 frames) is the largest single factor"
            ],
            _answer: 3,
            explanation: "Triple buffering adds ~50ms (3 frames at 60fps). This is the largest contributor. Fix: switch to double buffering (1 frame) or use low-latency modes (NVIDIA Reflex). Also: poll input at higher rate, use input prediction, and minimize processing pipeline depth.",
            articleSlug: "game-development-input-latency", tags: ["input lag", "latency", "buffering"]
        }
    ]
});

// ═══════════════════════════════════════════════════════════════════════════════
// NLP (Natural Language Processing)
// ═══════════════════════════════════════════════════════════════════════════════
const nlp = buildQuiz({
    series: "nlp",
    title: "Natural Language Processing",
    salt: "nlp-text-2026",
    totalParts: 16,
    questions: [
        {
            id: "nlp-q001", part: 1, difficulty: "beginner", type: "mcq",
            question: "What is tokenization in NLP?",
            options: ["Encrypting text for security", "Breaking text into smaller units (words, subwords, or characters)", "Converting text to numerical vectors", "Removing stop words from a document"],
            _answer: 1,
            explanation: "Tokenization is the first step in NLP: splitting raw text into tokens. Word-level: 'I love NLP' → ['I', 'love', 'NLP']. Subword (BPE): handles unknown words. Character-level: finest granularity.",
            articleSlug: "nlp-fundamentals", tags: ["tokenization", "preprocessing"]
        },
        {
            id: "nlp-q002", part: 2, difficulty: "intermediate", type: "true-false",
            question: "Word2Vec embeddings can capture semantic relationships like 'king - man + woman ≈ queen'.",
            _answer: true,
            explanation: "Word2Vec (Mikolov, 2013) learns vector representations where arithmetic on vectors encodes semantic relationships. The famous analogy: vec(king) - vec(man) + vec(woman) ≈ vec(queen). This works because the embedding space captures gender as a consistent direction.",
            articleSlug: "nlp-word-embeddings", tags: ["Word2Vec", "embeddings", "analogies"]
        },
        {
            id: "nlp-q003", part: 3, difficulty: "intermediate", type: "fill-blank",
            question: "The Transformer architecture's key innovation is the ___ mechanism, which allows each token to attend to all other tokens.",
            _answer: "self-attention",
            acceptAlso: ["attention", "self attention", "multi-head attention", "scaled dot-product attention"],
            explanation: "Self-attention computes relevance scores between all token pairs in parallel. Unlike RNNs (sequential), Transformers process entire sequences at once, enabling massive parallelization and better long-range dependency modeling.",
            articleSlug: "nlp-transformers", tags: ["Transformer", "attention"]
        },
        {
            id: "nlp-q004", part: 4, difficulty: "advanced", type: "code-output",
            question: "What is the cosine similarity between these two vectors?",
            code: "import numpy as np\n\na = np.array([1, 0, 1])  # 'cat' embedding\nb = np.array([1, 1, 0])  # 'dog' embedding\n\ncosine_sim = np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))\nprint(f'{cosine_sim:.2f}')",
            _answer: "0.50",
            acceptAlso: ["0.5", "1/2"],
            explanation: "dot(a,b) = 1×1 + 0×1 + 1×0 = 1. |a| = √(1+0+1) = √2. |b| = √(1+1+0) = √2. Cosine sim = 1/(√2 × √2) = 1/2 = 0.50. Values range from -1 (opposite) to 1 (identical).",
            articleSlug: "nlp-similarity", tags: ["cosine similarity", "vectors"]
        },
        {
            id: "nlp-q005", part: 5, difficulty: "advanced", type: "scenario",
            question: "Your sentiment analysis model achieves 92% accuracy on movie reviews but fails badly on product reviews. What's the primary issue?",
            scenario: {
                context: "BERT-based sentiment classifier trained on 50K IMDB movie reviews. Deployed for Amazon product review analysis.",
                metrics: { "Training accuracy": "92%", "Product review accuracy": "61%", "Domain": "Movie → Products", "Vocabulary overlap": "65%" }
            },
            options: [
                "Domain shift — sentiment expressions differ between movies ('masterpiece', 'boring') and products ('defective', 'great value')",
                "Model is too small — needs more parameters",
                "Product reviews are shorter — model can't handle variable lengths",
                "Labeling inconsistency in the training data"
            ],
            _answer: 0,
            explanation: "Domain shift is the #1 cause of NLP model degradation in production. 'This product is a bomb' (positive in movies, negative for products). Fix: fine-tune on target domain data, use domain adaptation, or few-shot prompting with domain examples.",
            articleSlug: "nlp-sentiment-analysis", tags: ["domain shift", "transfer learning"]
        },
        {
            id: "nlp-q006", part: 6, difficulty: "intermediate", type: "matching",
            question: "Match each NLP task to its description:",
            pairs: {
                left: ["NER (Named Entity Recognition)", "POS Tagging", "Dependency Parsing", "Coreference Resolution"],
                right: ["Identifying people, places, organizations in text", "Labeling words as noun, verb, adjective, etc.", "Determining grammatical relationships between words", "Determining which pronouns refer to which entities"]
            },
            _answer: [0, 1, 2, 3],
            explanation: "NER extracts entities (Apple → ORG). POS tags grammar (ran → VERB). Dependency parsing builds tree structure (subject→verb→object). Coreference links 'she' back to 'Dr. Smith' mentioned earlier.",
            articleSlug: "nlp-tasks", tags: ["NER", "POS", "parsing"]
        },
        {
            id: "nlp-q007", part: 7, difficulty: "advanced", type: "ordering",
            question: "Arrange the evolution of language models chronologically:",
            items: ["GPT-3/ChatGPT (few-shot, RLHF)", "Word2Vec (static word embeddings)", "BERT (bidirectional pre-training)", "RNN/LSTM (sequential models)", "Attention mechanism (Bahdanau, 2014)"],
            _answer: ["Word2Vec (static word embeddings)", "RNN/LSTM (sequential models)", "Attention mechanism (Bahdanau, 2014)", "BERT (bidirectional pre-training)", "GPT-3/ChatGPT (few-shot, RLHF)"],
            explanation: "Timeline: Word2Vec (2013) → LSTM era (2014-2017) → Attention (2014, popularized 2017 with Transformer) → BERT (2018) → GPT-3 (2020) → ChatGPT (2022). Each built on insights from the previous generation.",
            articleSlug: "nlp-history", tags: ["history", "language models"]
        },
        {
            id: "nlp-q008", part: 8, difficulty: "advanced", type: "debug",
            question: "A chatbot gives confident but factually wrong answers. The model is GPT-based with RAG (Retrieval Augmented Generation). Find the failure mode:",
            code: "Pipeline:\n1. User asks: 'What's the latest version of Python?'\n2. Retriever searches knowledge base → returns document from 2021\n3. Document says: 'Python 3.9 is the latest stable release'\n4. Generator produces: 'Python 3.9 is the latest version'\n5. Confidence score: 0.94",
            options: [
                "Stale knowledge base — retrieved document is outdated (2021) but model trusts it completely",
                "Embedding model can't distinguish recency — 'latest version' doesn't bias toward newer documents",
                "No hallucination guardrail — model doesn't indicate uncertainty about temporal claims",
                "All contribute — stale data + no recency bias + no uncertainty expression"
            ],
            _answer: 3,
            explanation: "Triple failure in RAG: (1) Knowledge base not updated (stale), (2) Retriever treats all documents equally regardless of date, (3) Generator doesn't hedge temporal claims. Fix: timestamp-aware retrieval, freshness scoring, and uncertainty expressions ('as of [date]').",
            articleSlug: "nlp-rag", tags: ["RAG", "hallucination", "debugging"]
        },
        {
            id: "nlp-q009", part: 9, difficulty: "advanced", type: "calculation",
            question: "A Transformer model has 12 layers, 768 hidden dimensions, and 12 attention heads. What's the dimension per attention head?",
            formula: "d_head = d_model / n_heads",
            _answer: 64,
            unit: "dimensions",
            tolerance: 0,
            explanation: "d_head = 768 / 12 = 64. Each attention head operates on a 64-dimensional subspace. Multi-head attention lets the model attend to different relationship types simultaneously (syntactic, semantic, positional).",
            articleSlug: "nlp-transformer-architecture", tags: ["Transformer", "attention heads"]
        },
        {
            id: "nlp-q010", part: 10, difficulty: "intermediate", type: "mcq",
            question: "What does BLEU score measure in machine translation?",
            options: ["Fluency of the translation", "N-gram overlap between generated and reference translations", "Semantic similarity between source and target", "Reading level of the output"],
            _answer: 1,
            explanation: "BLEU (Bilingual Evaluation Understudy) measures precision of n-gram overlaps between machine output and human references. BLEU-4 uses 1-4 grams. It correlates with human judgment but doesn't capture meaning — just surface overlap.",
            articleSlug: "nlp-evaluation", tags: ["BLEU", "evaluation", "metrics"]
        },
        {
            id: "nlp-q011", part: 11, difficulty: "advanced", type: "architecture",
            question: "You're building a customer support chatbot that needs to handle 50 languages. Which architecture?",
            scenario: "Global SaaS company. Support tickets in 50 languages. Need: intent classification, entity extraction, and response generation. Training data: 100K English examples, <1K for other languages.",
            options: [
                { label: "Train separate models for each language", tradeoffs: ["Best per-language performance", "50× training/maintenance cost", "Can't leverage cross-lingual knowledge"] },
                { label: "Multilingual model (mBERT/XLM-R) with zero-shot transfer from English", tradeoffs: ["Single model for all languages", "Good cross-lingual transfer", "Lower per-language accuracy"] },
                { label: "English-only model + machine translate all inputs to English", tradeoffs: ["Simple pipeline", "Translation errors propagate", "Loses cultural nuance"] },
                { label: "Multilingual base + few-shot fine-tuning for top 10 languages", tradeoffs: ["Balanced quality/cost", "Best for high-resource languages", "Acceptable for low-resource via transfer"] }
            ],
            _answer: 3,
            explanation: "Practical approach: use XLM-R or mT5 as multilingual base (handles all 50 via zero-shot), then fine-tune on available data for your top 10 languages. This gives high quality where data exists and acceptable fallback elsewhere.",
            articleSlug: "nlp-multilingual", tags: ["multilingual", "XLM-R", "cross-lingual"]
        },
        {
            id: "nlp-q012", part: 12, difficulty: "advanced", type: "ethical",
            question: "Should LLMs be allowed to generate text that's indistinguishable from human writing without disclosure?",
            scenario: "GPT-4 and Claude can write essays, articles, emails, and social media posts indistinguishable from human writing. This enables: mass disinformation, academic fraud, fake reviews, and impersonation. But also: accessibility, creative assistance, and productivity.",
            options: [
                { label: "Mandatory watermarking — all AI text must contain detectable signals", framework: "Transparency — recipients have right to know origin" },
                { label: "No restrictions — free expression applies to tool-assisted writing", framework: "Free speech — tools don't change rights" },
                { label: "Context-dependent: disclosure required for public/official content, not personal", framework: "Proportional — regulate where stakes are high" },
                { label: "Focus on detecting misuse rather than restricting generation", framework: "Enforcement — punish harm, not capability" }
            ],
            _answer: 2,
            explanation: "Most emerging regulation (EU AI Act, proposed US legislation) takes a context-dependent approach: AI disclosure required for political ads, academic submissions, and impersonation — but not for personal emails, brainstorming, or creative writing assistance.",
            articleSlug: "nlp-ethics", tags: ["AI ethics", "disclosure", "watermarking"]
        }
    ]
});

// ═══════════════════════════════════════════════════════════════════════════════
// WRITE ALL QUIZZES
// ═══════════════════════════════════════════════════════════════════════════════
const allQuizzes = [kernelDev, embeddedSystems, computerArch, marketingStrategy, behavioralPsych, gameDevelopment, nlp];

let success = 0;
allQuizzes.forEach(function(quiz) {
    if (writeQuiz(quiz)) {
        const types = [...new Set(quiz.questions.map(q => q.type))];
        console.log(`✓ ${quiz.series} — ${quiz.questions.length} questions (${types.length} types)`);
        success++;
    }
});

console.log(`\n═══ Generated ${success}/${allQuizzes.length} quizzes (Batch 2) ═══`);
