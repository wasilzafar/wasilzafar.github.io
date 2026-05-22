// ============================================================
// Claude Certified Architect – Foundations (CCA-F) Syllabus
// Version: 2026.1 | Updated: 2026-05-22
// Source: Anthropic Exam Guide + Skilljar page
// ============================================================

window.ExamSyllabus = window.ExamSyllabus || {};
window.ExamSyllabus['claude-architect'] = {
    examName: 'Claude Certified Architect – Foundations',
    version: '2026',
    sections: [
        {
            id: 'cca-agentic',
            name: 'Agentic Architecture & Orchestration (27%)',
            type: 'compulsory',
            topics: [
                { id: 'ag-agentic-loops', title: 'Agentic Loop Design (stop_reason, tool_use lifecycle, termination)', difficulty: 3, estimatedHours: 8, weight: 1.3, tags: ['agent-sdk', 'loops'] },
                { id: 'ag-multi-agent', title: 'Multi-Agent Orchestration (coordinator-subagent, hub-spoke)', difficulty: 4, estimatedHours: 10, weight: 1.3, tags: ['agent-sdk', 'orchestration'] },
                { id: 'ag-subagent-config', title: 'Subagent Invocation & Context Passing (Task tool, allowedTools)', difficulty: 3, estimatedHours: 8, weight: 1.2, tags: ['agent-sdk', 'context'] },
                { id: 'ag-workflows', title: 'Multi-Step Workflows & Handoff Patterns (enforcement, escalation)', difficulty: 3, estimatedHours: 8, weight: 1.2, tags: ['agent-sdk', 'workflows'] },
                { id: 'ag-hooks', title: 'Agent SDK Hooks (PostToolUse, interception, normalization)', difficulty: 3, estimatedHours: 6, tags: ['agent-sdk', 'hooks'] },
                { id: 'ag-decomposition', title: 'Task Decomposition Strategies (prompt chaining, adaptive)', difficulty: 3, estimatedHours: 6, tags: ['architecture', 'decomposition'] },
                { id: 'ag-sessions', title: 'Session Management (--resume, fork_session, state persistence)', difficulty: 2, estimatedHours: 4, tags: ['claude-code', 'sessions'] }
            ]
        },
        {
            id: 'cca-tools',
            name: 'Tool Design & MCP Integration (18%)',
            type: 'compulsory',
            topics: [
                { id: 'td-tool-interfaces', title: 'Tool Interface Design (descriptions, boundaries, disambiguation)', difficulty: 3, estimatedHours: 6, weight: 1.2, tags: ['mcp', 'tools'] },
                { id: 'td-error-responses', title: 'Structured Error Responses (isError, errorCategory, retryable)', difficulty: 3, estimatedHours: 5, tags: ['mcp', 'errors'] },
                { id: 'td-tool-distribution', title: 'Tool Distribution Across Agents (scoped access, tool_choice)', difficulty: 3, estimatedHours: 6, weight: 1.2, tags: ['mcp', 'architecture'] },
                { id: 'td-mcp-servers', title: 'MCP Server Integration (.mcp.json, env vars, resources)', difficulty: 2, estimatedHours: 5, tags: ['mcp', 'config'] },
                { id: 'td-builtin-tools', title: 'Built-in Tools (Read, Write, Edit, Bash, Grep, Glob)', difficulty: 2, estimatedHours: 4, tags: ['claude-code', 'tools'] }
            ]
        },
        {
            id: 'cca-claude-code',
            name: 'Claude Code Configuration & Workflows (20%)',
            type: 'compulsory',
            topics: [
                { id: 'cc-claude-md', title: 'CLAUDE.md Configuration Hierarchy (user/project/directory, @import)', difficulty: 2, estimatedHours: 5, weight: 1.2, tags: ['claude-code', 'config'] },
                { id: 'cc-commands-skills', title: 'Custom Slash Commands & Skills (context: fork, allowed-tools)', difficulty: 3, estimatedHours: 6, weight: 1.2, tags: ['claude-code', 'skills'] },
                { id: 'cc-path-rules', title: 'Path-Specific Rules (.claude/rules/, YAML frontmatter, globs)', difficulty: 2, estimatedHours: 4, tags: ['claude-code', 'rules'] },
                { id: 'cc-plan-mode', title: 'Plan Mode vs Direct Execution (complexity assessment)', difficulty: 2, estimatedHours: 4, tags: ['claude-code', 'workflow'] },
                { id: 'cc-iterative', title: 'Iterative Refinement (few-shot examples, test-driven, interview)', difficulty: 3, estimatedHours: 6, tags: ['prompting', 'iteration'] },
                { id: 'cc-cicd', title: 'CI/CD Integration (-p flag, --output-format json, --json-schema)', difficulty: 3, estimatedHours: 6, weight: 1.2, tags: ['claude-code', 'ci-cd'] }
            ]
        },
        {
            id: 'cca-prompting',
            name: 'Prompt Engineering & Structured Output (20%)',
            type: 'compulsory',
            topics: [
                { id: 'pe-explicit-criteria', title: 'Explicit Criteria & Precision (reducing false positives)', difficulty: 3, estimatedHours: 5, tags: ['prompting', 'precision'] },
                { id: 'pe-few-shot', title: 'Few-Shot Prompting (ambiguous scenarios, format consistency)', difficulty: 3, estimatedHours: 6, weight: 1.2, tags: ['prompting', 'few-shot'] },
                { id: 'pe-structured-output', title: 'Structured Output via tool_use (JSON schemas, tool_choice)', difficulty: 3, estimatedHours: 7, weight: 1.3, tags: ['api', 'schemas'] },
                { id: 'pe-validation-retry', title: 'Validation & Retry Loops (error feedback, self-correction)', difficulty: 3, estimatedHours: 5, tags: ['reliability', 'validation'] },
                { id: 'pe-batch', title: 'Batch Processing (Message Batches API, custom_id, SLA)', difficulty: 2, estimatedHours: 4, tags: ['api', 'batch'] },
                { id: 'pe-multi-pass', title: 'Multi-Instance & Multi-Pass Review (self-review limits)', difficulty: 3, estimatedHours: 5, tags: ['architecture', 'review'] }
            ]
        },
        {
            id: 'cca-context',
            name: 'Context Management & Reliability (15%)',
            type: 'compulsory',
            topics: [
                { id: 'cm-context-preservation', title: 'Context Preservation (case facts, trimming, lost-in-middle)', difficulty: 3, estimatedHours: 6, weight: 1.2, tags: ['context', 'reliability'] },
                { id: 'cm-escalation', title: 'Escalation & Ambiguity Resolution (triggers, customer preference)', difficulty: 3, estimatedHours: 5, tags: ['reliability', 'escalation'] },
                { id: 'cm-error-propagation', title: 'Error Propagation in Multi-Agent Systems (structured context)', difficulty: 3, estimatedHours: 5, tags: ['reliability', 'errors'] },
                { id: 'cm-large-codebase', title: 'Large Codebase Exploration (scratchpad, /compact, subagents)', difficulty: 3, estimatedHours: 5, tags: ['context', 'claude-code'] },
                { id: 'cm-human-review', title: 'Human Review & Confidence Calibration (stratified sampling)', difficulty: 2, estimatedHours: 4, tags: ['reliability', 'review'] },
                { id: 'cm-provenance', title: 'Information Provenance & Uncertainty (claim-source mappings)', difficulty: 3, estimatedHours: 4, tags: ['reliability', 'synthesis'] }
            ]
        }
    ]
};
