# Systematic Debugging Protocol

## Troubleshooting Methodology
1. **Reproduce & Isolate**: Replicate the bug with minimal inputs. Identify whether the issue originates in the UI layer, network transport, or backend/data layer.
2. **Inspect the Boundary**: Check API responses, TypeScript error logs, hydration differences, or database constraints before modifying business logic.
3. **Surgical Corrections**: Never apply speculative or randomized code changes. Understand the exact mechanism causing the failure before modifying code.
4. **Zero Comment Deletions**: Never silently remove existing logic or error handlers to bypass a bug.
