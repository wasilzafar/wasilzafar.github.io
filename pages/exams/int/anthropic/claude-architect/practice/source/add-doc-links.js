#!/usr/bin/env node
/**
 * add-doc-links.js
 *
 * Reads set-a.questions.json and set-b.questions.json,
 * appends a \n[Docs]: line to each question's explanation
 * with relevant Anthropic / Claude Code documentation links.
 *
 * Usage: node add-doc-links.js
 */
const fs = require('fs');
const path = require('path');

// ─── Documentation Link Registry ─────────────────────────────────────────────
// Each key is a tag (or tag prefix) found in question.tags.
// Values are arrays of { url, label } objects.

const DOCS = {
  // ── Agentic Architecture ──────────────────────────────────────────────────
  'agentic-loop': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Agentic Systems' },
    { url: 'https://code.claude.com/docs/en/agent-sdk/agent-loop', label: 'Agent Loop (SDK)' }
  ],
  'stop_reason': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Agentic Systems – Loop Control' },
    { url: 'https://code.claude.com/docs/en/agent-sdk/agent-loop', label: 'Agent Loop Lifecycle' }
  ],
  'hooks': [
    { url: 'https://code.claude.com/docs/en/hooks', label: 'Hooks Reference' },
    { url: 'https://code.claude.com/docs/en/agent-sdk/hooks', label: 'SDK Hooks' }
  ],
  'interception': [
    { url: 'https://code.claude.com/docs/en/hooks-guide', label: 'Hooks Guide – Interception' },
    { url: 'https://code.claude.com/docs/en/hooks#pretooluse-2', label: 'PreToolUse Hook' }
  ],
  'PostToolUse': [
    { url: 'https://code.claude.com/docs/en/hooks#posttooluse', label: 'PostToolUse Hook' },
    { url: 'https://code.claude.com/docs/en/agent-sdk/hooks', label: 'SDK Hooks Reference' }
  ],
  'enforcement': [
    { url: 'https://code.claude.com/docs/en/hooks-guide', label: 'Hooks Guide – Enforcement' },
    { url: 'https://code.claude.com/docs/en/hooks#pretooluse-2', label: 'PreToolUse Decision Control' }
  ],
  'policy-enforcement': [
    { url: 'https://code.claude.com/docs/en/hooks-guide', label: 'Hooks Guide – Policy Enforcement' },
    { url: 'https://code.claude.com/docs/en/hooks#pretooluse-2', label: 'PreToolUse Decision Control' }
  ],
  'normalization': [
    { url: 'https://code.claude.com/docs/en/hooks#posttooluse', label: 'PostToolUse – Data Normalization' },
    { url: 'https://code.claude.com/docs/en/agent-sdk/hooks', label: 'SDK Hooks' }
  ],

  // ── Multi-Agent / Subagents ───────────────────────────────────────────────
  'coordinator': [
    { url: 'https://code.claude.com/docs/en/agents', label: 'Agents Overview' },
    { url: 'https://code.claude.com/docs/en/agent-sdk/subagents', label: 'Subagents (SDK)' }
  ],
  'task-decomposition': [
    { url: 'https://code.claude.com/docs/en/agent-sdk/subagents', label: 'Subagent Task Delegation' },
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Agentic Systems – Orchestration' }
  ],
  'Task-tool': [
    { url: 'https://code.claude.com/docs/en/tools-reference#agent-tool-behavior', label: 'Agent Tool Behavior' },
    { url: 'https://code.claude.com/docs/en/sub-agents', label: 'Subagents Reference' }
  ],
  'allowedTools': [
    { url: 'https://code.claude.com/docs/en/agent-sdk/subagents#agentdefinition-configuration', label: 'AgentDefinition Config' },
    { url: 'https://code.claude.com/docs/en/tools-reference#configure-tools-with-permission-rules-and-hooks', label: 'Tool Permissions' }
  ],
  'configuration': [
    { url: 'https://code.claude.com/docs/en/agent-sdk/subagents#agentdefinition-configuration', label: 'AgentDefinition Config' }
  ],
  'subagent-isolation': [
    { url: 'https://code.claude.com/docs/en/agent-sdk/subagents#what-subagents-inherit', label: 'Subagent Context Isolation' },
    { url: 'https://code.claude.com/docs/en/sub-agents', label: 'Subagents Reference' }
  ],
  'context-passing': [
    { url: 'https://code.claude.com/docs/en/agent-sdk/subagents#what-subagents-inherit', label: 'Context Passing to Subagents' },
    { url: 'https://code.claude.com/docs/en/agent-sdk/agent-loop#keep-context-efficient', label: 'Efficient Context' }
  ],
  'parallel-execution': [
    { url: 'https://code.claude.com/docs/en/agents#run-agents-in-parallel', label: 'Parallel Agent Execution' },
    { url: 'https://code.claude.com/docs/en/agent-sdk/agent-loop#parallel-tool-execution', label: 'Parallel Tool Execution' }
  ],
  'iterative-refinement': [
    { url: 'https://code.claude.com/docs/en/agent-sdk/subagents', label: 'Subagent Delegation & Iteration' },
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Agentic Systems – Orchestration Loops' }
  ],
  'dynamic-routing': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Agentic Systems – Routing' },
    { url: 'https://code.claude.com/docs/en/agents', label: 'Agent Approaches' }
  ],

  // ── Tool Design ───────────────────────────────────────────────────────────
  'tool-descriptions': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use#best-practices-for-tool-definitions', label: 'Tool Definitions Best Practices' },
    { url: 'https://code.claude.com/docs/en/agent-sdk/custom-tools', label: 'Custom Tools (SDK)' }
  ],
  'disambiguation': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use#best-practices-for-tool-definitions', label: 'Tool Definitions – Disambiguation' }
  ],
  'tool-distribution': [
    { url: 'https://code.claude.com/docs/en/agent-sdk/subagents#agentdefinition-configuration', label: 'Agent Tools Configuration' },
    { url: 'https://code.claude.com/docs/en/tools-reference', label: 'Tools Reference' }
  ],
  'least-privilege': [
    { url: 'https://code.claude.com/docs/en/agent-sdk/permissions', label: 'Permissions (SDK)' },
    { url: 'https://code.claude.com/docs/en/sub-agents#control-subagent-capabilities', label: 'Subagent Least Privilege' }
  ],
  'scoped-access': [
    { url: 'https://code.claude.com/docs/en/agent-sdk/permissions', label: 'Permissions & Scoped Access' },
    { url: 'https://code.claude.com/docs/en/sub-agents#control-subagent-capabilities', label: 'Controlling Subagent Capabilities' }
  ],
  'error-responses': [
    { url: 'https://code.claude.com/docs/en/agent-sdk/custom-tools#handle-errors', label: 'Custom Tool Error Handling' },
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use#handling-tool-use-errors', label: 'Tool Use Error Handling' }
  ],
  'structured-errors': [
    { url: 'https://code.claude.com/docs/en/agent-sdk/custom-tools#handle-errors', label: 'Structured Error Returns' },
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use#handling-tool-use-errors', label: 'Tool Error Patterns' }
  ],
  'tool-design': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use#best-practices-for-tool-definitions', label: 'Tool Design Best Practices' },
    { url: 'https://code.claude.com/docs/en/agent-sdk/custom-tools', label: 'Custom Tools (SDK)' }
  ],
  'focused-tools': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use#best-practices-for-tool-definitions', label: 'Focused Tool Design' }
  ],
  'caching': [
    { url: 'https://code.claude.com/docs/en/prompt-caching', label: 'Prompt Caching' }
  ],
  'tool-integration': [
    { url: 'https://code.claude.com/docs/en/agent-sdk/mcp', label: 'MCP Integration (SDK)' },
    { url: 'https://code.claude.com/docs/en/mcp', label: 'MCP Reference' }
  ],

  // ── Prompt Engineering & Structured Output ────────────────────────────────
  'tool_use': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use', label: 'Tool Use (API)' }
  ],
  'structured-output': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use#forcing-tool-use', label: 'Forcing Tool Use for Structured Output' },
    { url: 'https://code.claude.com/docs/en/agent-sdk/structured-outputs', label: 'Structured Outputs (SDK)' }
  ],
  'JSON-schema': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use', label: 'Tool Use – JSON Schema' },
    { url: 'https://code.claude.com/docs/en/headless#get-structured-output', label: 'CLI Structured Output' }
  ],
  'json-schema': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use', label: 'Tool Use – JSON Schema' },
    { url: 'https://code.claude.com/docs/en/headless#get-structured-output', label: 'CLI Structured Output' }
  ],
  'tool_choice': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use#forcing-tool-use', label: 'tool_choice – Forcing Tool Use' }
  ],
  'forced-selection': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use#forcing-tool-use', label: 'tool_choice: Forced Selection' }
  ],
  'schema-design': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use#best-practices-for-tool-definitions', label: 'Schema Design Practices' }
  ],
  'temperature': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-temperature-effectively', label: 'Temperature Settings' }
  ],
  'determinism': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-temperature-effectively', label: 'Temperature for Determinism' }
  ],
  'classification': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-temperature-effectively', label: 'Temperature for Classification' }
  ],
  'few-shot': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering', label: 'Prompt Engineering' }
  ],
  'explicit-criteria': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering', label: 'Prompt Engineering – Explicit Criteria' }
  ],
  'format-consistency': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering', label: 'Prompt Engineering – Formatting' }
  ],
  'precision': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering', label: 'Prompt Engineering – Precision' }
  ],
  'multi-pass': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Multi-Pass Architecture' }
  ],
  'attention-dilution': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering', label: 'Prompt Engineering – Focus' }
  ],
  'validation-retry': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use#handling-tool-use-errors', label: 'Validation & Retry' }
  ],
  'self-correction': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use#handling-tool-use-errors', label: 'Self-Correction via Tool Errors' }
  ],

  // ── Batch API ─────────────────────────────────────────────────────────────
  'batch-API': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/batch-processing', label: 'Message Batches (API)' }
  ],

  // ── Context Management ────────────────────────────────────────────────────
  'context-preservation': [
    { url: 'https://code.claude.com/docs/en/context-window', label: 'Context Window Management' },
    { url: 'https://code.claude.com/docs/en/agent-sdk/agent-loop#the-context-window', label: 'Context Window (SDK)' }
  ],
  'case-facts': [
    { url: 'https://code.claude.com/docs/en/agent-sdk/agent-loop#automatic-compaction', label: 'Compaction & Fact Preservation' },
    { url: 'https://code.claude.com/docs/en/memory', label: 'Memory & CLAUDE.md' }
  ],
  'persistent-context': [
    { url: 'https://code.claude.com/docs/en/memory', label: 'Persistent Memory' },
    { url: 'https://code.claude.com/docs/en/context-window', label: 'Context Window' }
  ],
  'RAG': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/retrieval-augmented-generation', label: 'RAG (API)' }
  ],
  'chunking': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/retrieval-augmented-generation', label: 'RAG – Chunking Strategy' }
  ],
  'metadata-filtering': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/retrieval-augmented-generation', label: 'RAG – Metadata Filtering' }
  ],
  'index-maintenance': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/retrieval-augmented-generation', label: 'RAG – Index Maintenance' }
  ],
  'incremental-indexing': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/retrieval-augmented-generation', label: 'RAG – Incremental Indexing' }
  ],
  'multi-hop': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/retrieval-augmented-generation', label: 'RAG – Multi-Hop Retrieval' }
  ],
  'hybrid-retrieval': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/retrieval-augmented-generation', label: 'RAG – Hybrid Retrieval' }
  ],
  'context-selection': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/retrieval-augmented-generation', label: 'RAG – Context Selection' }
  ],

  // ── Reliability & Human-in-the-Loop ───────────────────────────────────────
  'escalation': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Agentic Systems – Escalation' }
  ],
  'error-propagation': [
    { url: 'https://code.claude.com/docs/en/agent-sdk/custom-tools#handle-errors', label: 'Error Propagation & Handling' },
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Agentic Systems – Error Recovery' }
  ],
  'error-handling': [
    { url: 'https://code.claude.com/docs/en/agent-sdk/custom-tools#handle-errors', label: 'Error Handling (SDK)' },
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use#handling-tool-use-errors', label: 'Tool Error Handling (API)' }
  ],
  'human-review': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Human-in-the-Loop Patterns' }
  ],
  'confidence-calibration': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Confidence & Routing' }
  ],
  'HITL': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Human-in-the-Loop Design' }
  ],
  'ambiguity-resolution': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Ambiguity Resolution Patterns' }
  ],
  'provenance': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/retrieval-augmented-generation', label: 'Source Attribution & Provenance' }
  ],
  'claim-source-mappings': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/retrieval-augmented-generation', label: 'Citation & Source Mapping' }
  ],
  'citations': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/citations', label: 'Citations (API)' }
  ],
  'traceability': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/citations', label: 'Citation Traceability' }
  ],
  'knowledge-gaps': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/retrieval-augmented-generation', label: 'RAG – Knowledge Gap Handling' }
  ],
  'transparency': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Transparency & Uncertainty' }
  ],
  'safe-fallback': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Safe Fallback Patterns' }
  ],

  // ── Evaluation & Testing ──────────────────────────────────────────────────
  'evaluation': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/develop-tests', label: 'Developing Evaluations' }
  ],
  'regression-testing': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/develop-tests', label: 'Regression Testing & Evals' }
  ],
  'continuous-monitoring': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/develop-tests', label: 'Continuous Monitoring' }
  ],
  'mutation-testing': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/develop-tests', label: 'Test Quality & Mutation Testing' }
  ],
  'stratified': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/develop-tests', label: 'Stratified Evaluation' }
  ],

  // ── Claude Code / CI/CD ───────────────────────────────────────────────────
  'CI-CD': [
    { url: 'https://code.claude.com/docs/en/headless', label: 'Non-Interactive / Headless Mode' },
    { url: 'https://code.claude.com/docs/en/github-actions', label: 'GitHub Actions Integration' }
  ],
  'CI-context': [
    { url: 'https://code.claude.com/docs/en/headless', label: 'CI Context – Headless Mode' },
    { url: 'https://code.claude.com/docs/en/memory', label: 'CLAUDE.md for CI Context' }
  ],
  'p-flag': [
    { url: 'https://code.claude.com/docs/en/headless', label: 'Non-Interactive Mode (-p flag)' },
    { url: 'https://code.claude.com/docs/en/cli-reference', label: 'CLI Reference' }
  ],
  'non-interactive': [
    { url: 'https://code.claude.com/docs/en/headless', label: 'Headless / Non-Interactive Mode' }
  ],
  'CLAUDE-md': [
    { url: 'https://code.claude.com/docs/en/memory', label: 'CLAUDE.md & Memory' },
    { url: 'https://code.claude.com/docs/en/agent-sdk/claude-code-features', label: 'CLAUDE.md in SDK' }
  ],
  'CLAUDE.md': [
    { url: 'https://code.claude.com/docs/en/memory', label: 'CLAUDE.md & Memory' }
  ],
  'conventions': [
    { url: 'https://code.claude.com/docs/en/memory#write-effective-instructions', label: 'Effective CLAUDE.md Instructions' }
  ],
  'session-isolation': [
    { url: 'https://code.claude.com/docs/en/agent-sdk/sessions', label: 'Session Isolation (SDK)' }
  ],
  'incremental-review': [
    { url: 'https://code.claude.com/docs/en/headless', label: 'Incremental Review in CI' }
  ],
  'duplicate-avoidance': [
    { url: 'https://code.claude.com/docs/en/headless', label: 'Headless Mode Patterns' }
  ],
  'code-generation': [
    { url: 'https://code.claude.com/docs/en/best-practices', label: 'Code Generation Best Practices' }
  ],
  'phased-generation': [
    { url: 'https://code.claude.com/docs/en/best-practices', label: 'Phased Task Decomposition' }
  ],
  'test-generation': [
    { url: 'https://code.claude.com/docs/en/best-practices', label: 'Test Generation Patterns' }
  ],
  'property-based-tests': [
    { url: 'https://code.claude.com/docs/en/best-practices', label: 'Testing Best Practices' }
  ],

  // ── Security & Compliance ─────────────────────────────────────────────────
  'prompt-injection': [
    { url: 'https://code.claude.com/docs/en/agent-sdk/secure-deployment', label: 'Secure Deployment – Prompt Injection' },
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering', label: 'Input Handling & Safety' }
  ],
  'security': [
    { url: 'https://code.claude.com/docs/en/agent-sdk/secure-deployment', label: 'Secure Deployment Guide' },
    { url: 'https://code.claude.com/docs/en/security', label: 'Security Overview' }
  ],
  'CI-security': [
    { url: 'https://code.claude.com/docs/en/agent-sdk/secure-deployment', label: 'Secure CI Deployment' },
    { url: 'https://code.claude.com/docs/en/agent-sdk/permissions', label: 'Permissions (SDK)' }
  ],
  'access-control': [
    { url: 'https://code.claude.com/docs/en/agent-sdk/permissions', label: 'Access Control & Permissions' },
    { url: 'https://code.claude.com/docs/en/agent-sdk/secure-deployment', label: 'Secure Deployment' }
  ],
  'authentication': [
    { url: 'https://code.claude.com/docs/en/authentication', label: 'Authentication' }
  ],
  'permissions': [
    { url: 'https://code.claude.com/docs/en/agent-sdk/permissions', label: 'Permissions (SDK)' },
    { url: 'https://code.claude.com/docs/en/permissions', label: 'Permissions Reference' }
  ],
  'audit-logging': [
    { url: 'https://code.claude.com/docs/en/monitoring-usage', label: 'Monitoring & Audit Logging' }
  ],
  'compliance': [
    { url: 'https://code.claude.com/docs/en/monitoring-usage', label: 'Compliance & Monitoring' }
  ],
  'HIPAA': [
    { url: 'https://code.claude.com/docs/en/monitoring-usage', label: 'Compliance Monitoring' }
  ],

  // ── System Prompt Design ──────────────────────────────────────────────────
  'system-prompt': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/system-prompts', label: 'System Prompt Design' },
    { url: 'https://code.claude.com/docs/en/agent-sdk/modifying-system-prompts', label: 'Modifying System Prompts (SDK)' }
  ],
  'scope-limits': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/system-prompts', label: 'System Prompt – Scope Limits' }
  ],
  'deployment-context': [
    { url: 'https://code.claude.com/docs/en/agent-sdk/modifying-system-prompts', label: 'Deployment Context in System Prompt' }
  ],
  'scope-specification': [
    { url: 'https://code.claude.com/docs/en/memory', label: 'Scope Specification via CLAUDE.md' }
  ],
  'safety-behaviors': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Safety Behaviors & Escalation' }
  ],
  'crisis-escalation': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Crisis Escalation Design' }
  ],
  'override': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Override & Safety Patterns' }
  ],

  // ── Misc ──────────────────────────────────────────────────────────────────
  'error-communication': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use#handling-tool-use-errors', label: 'Error Communication to Users' }
  ],
  'handoff': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Agent Handoff Patterns' }
  ],
  'escalation-context': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Escalation Context Design' }
  ],
  'customer-preference': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Customer-Preference Escalation' }
  ],
  'policy-gap': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Policy Gap Handling' }
  ],
  'moderation': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering', label: 'Content Moderation Patterns' }
  ],
  'risk-stratification': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Risk Stratification' }
  ],
  'queue-design': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Queue Design Patterns' }
  ],
  'threshold': [
    { url: 'https://code.claude.com/docs/en/hooks-guide', label: 'Threshold Enforcement via Hooks' }
  ],
  'multi-turn': [
    { url: 'https://code.claude.com/docs/en/agent-sdk/agent-loop', label: 'Multi-Turn Conversations' }
  ],
  'healthcare': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Domain-Specific Agent Design' }
  ],
  'SQL-injection': [
    { url: 'https://code.claude.com/docs/en/agent-sdk/secure-deployment', label: 'Security – Code Generation Safety' }
  ],
  'input-handling': [
    { url: 'https://code.claude.com/docs/en/agent-sdk/secure-deployment', label: 'Secure Input Handling' }
  ],
  'hallucination-prevention': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering', label: 'Reducing Hallucination' }
  ],
  'absent-information': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering', label: 'Handling Absent Information' }
  ],
  'format-normalization': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use', label: 'Format Normalization in Tool Use' }
  ],
  'document-classification': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use#forcing-tool-use', label: 'Classification via tool_choice' }
  ],
  'pipeline': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use', label: 'Pipeline Structured Output' }
  ],
  'cost-optimization': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/batch-processing', label: 'Batch API – Cost Optimization' }
  ],
  'throughput': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/batch-processing', label: 'Batch API – Throughput' }
  ],
  'systematic-improvement': [
    { url: 'https://code.claude.com/docs/en/memory#write-effective-instructions', label: 'Systematic Improvement via CLAUDE.md' }
  ],
  'testing': [
    { url: 'https://code.claude.com/docs/en/best-practices', label: 'Testing Best Practices' }
  ],
  'review-design': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering', label: 'Review Criteria Design' }
  ],
  'self-review': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Self-Review Architecture' }
  ],
  'independent-instance': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Independent Review Instances' }
  ],
  'developer-trust': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering', label: 'Developer Trust & Precision' }
  ],
  'CI-output': [
    { url: 'https://code.claude.com/docs/en/headless#get-structured-output', label: 'CI Structured Output' }
  ],
  'SLA': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/batch-processing', label: 'Batch API – SLA Considerations' }
  ],
  'failure-handling': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/batch-processing', label: 'Batch API – Failure Handling' }
  ],
  'latency-tolerance': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/batch-processing', label: 'Batch API – Latency Tradeoffs' }
  ],
  'classification-architecture': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Classification Architecture' }
  ],
  'population-segments': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/develop-tests', label: 'Segment-Specific Evaluation' }
  ],
  'accuracy-segmentation': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/develop-tests', label: 'Accuracy Segmentation' }
  ],
  'user-experience': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering', label: 'User Experience Design' }
  ],
  'pre-retrieval-filtering': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/retrieval-augmented-generation', label: 'Pre-Retrieval Filtering' }
  ],
  'structured-retrieval': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/retrieval-augmented-generation', label: 'Structured Retrieval' }
  ],
  'RAG-quality': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/develop-tests', label: 'RAG Quality Evaluation' }
  ],
  'policy-design': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering', label: 'Policy Design in Prompts' }
  ],
  'gap-analysis': [
    { url: 'https://code.claude.com/docs/en/agent-sdk/subagents', label: 'Gap Analysis & Iteration' }
  ],
  'annotations': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Annotation Patterns' }
  ],
  'coverage-gaps': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems', label: 'Coverage Gap Handling' }
  ],
  'conflicting-sources': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/retrieval-augmented-generation', label: 'Conflicting Source Resolution' }
  ],
  'retry-limits': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use#handling-tool-use-errors', label: 'Retry Limits' }
  ],
  'extensibility': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use#best-practices-for-tool-definitions', label: 'Schema Extensibility' }
  ],
  'version-management': [
    { url: 'https://docs.anthropic.com/en/docs/build-with-claude/retrieval-augmented-generation', label: 'RAG – Version Management' }
  ]
};

// ─── Processing ──────────────────────────────────────────────────────────────

function getDocLinks(tags) {
  const seen = new Set();
  const links = [];

  for (const tag of tags) {
    const entries = DOCS[tag];
    if (!entries) continue;
    for (const entry of entries) {
      if (!seen.has(entry.url)) {
        seen.add(entry.url);
        links.push(entry);
      }
    }
  }
  return links;
}

function processFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);
  let updated = 0;
  let alreadyHasLinks = 0;

  for (const q of data.questions) {
    // Skip if already has doc links
    if (q.explanation && q.explanation.includes('[Docs]:')) {
      alreadyHasLinks++;
      continue;
    }

    const links = getDocLinks(q.tags || []);
    if (links.length === 0) continue;

    const docLine = '\n[Docs]: ' + links.map(l => l.label + ' → ' + l.url).join(' | ');
    q.explanation = (q.explanation || '') + docLine;
    updated++;
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`${path.basename(filePath)}: ${updated} updated, ${alreadyHasLinks} already had links, ${data.questions.length} total`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

const dir = __dirname;
processFile(path.join(dir, 'set-a.questions.json'));
processFile(path.join(dir, 'set-b.questions.json'));
console.log('Done.');
