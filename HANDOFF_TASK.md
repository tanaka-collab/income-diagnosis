# ChatGPT → Surface Codex: Chappy Autopilot 2.0 本番受付スモークテスト

status: READY
- 状態: `READY`
- Updated: 2026-11-20 (JST)
- Task ID: `AUTOPILOT-V2-INCOME-E2E-20261120-01`
- Repository: `tanaka-collab/income-diagnosis`
- Source: User's ongoing explicit request to complete Chappy Autopilot, dispatched by ChatGPT GitHub connector.
- Priority: Safe, minimal LIVE READY reception test; this is NOT simulated intake and NOT a production app change.
- Preserve existing selected Codex model, version, reasoning effort, and quota policy. No overrides.

## Desired result and acceptance

1. The running Surface Windows Autopilot detects this exact NEW READY task from `autopilot-control/HANDOFF_TASK.md`, compares its content hash to prior tasks, and creates at most ONE task-specific isolated branch/worktree. Verify and log actual GitHub intake; simulated-only result is NOT PASS.
2. The implementation Codex creates exactly ONE new UTF-8 Markdown document: `docs/AUTOPILOT_V2_INCOME_GITHUB_E2E_20261120.md`. It must include all of:
   - Heading `# Chappy Autopilot 2.0 live GitHub intake smoke test`
   - Task ID `AUTOPILOT-V2-INCOME-E2E-20261120-01`
   - Exact sentence `This is a harmless documentation-only test initiated from ChatGPT and delivered through the GitHub control branch to the local Windows Autopilot.`
   - Exact sentence `No application logic, production settings, credentials, deployment, merge, or other jobs are changed.`
   - State whether this was ACTUAL Windows GitHub intake, with actual evidence; never infer execution from file existence alone.
3. Reopen and check the actual file and changed-file list. Implementation agent does not itself commit/push/create a PR; the designated Windows runner owns that workflow.
4. Perform the existing dedicated independent read-only Codex review on actual evidence. If the reviewer cannot launch/read a local canary or original file, mark `BLOCKED`, keep the safety gate, do not bypass sandbox or pretend `PASS`. If review `PASS`, runner may update its normal `CODEX_LATEST.md` and create exactly ONE new Draft PR targeting `main`; report PR number and exact HEAD SHA. No merge, approval, or deployment.
5. A separate ChatGPT GitHub review should inspect the new Draft PR only on a new SHA, avoiding duplicate review. Record actual PASS / BLOCKED / PENDING separately for intake, implementation, independent review, Draft PR creation and latest report; never report unverified steps as completed.
6. Ensure the prior completed task ID is not rerun. Do not touch any current `autopilot-control` handoff in another repository.

## Strict safety constraints

- Allowed change on this PR: only `docs/AUTOPILOT_V2_INCOME_GITHUB_E2E_20261120.md` and runner-generated `CODEX_LATEST.md`. Do not alter any application code, dependencies, CI, settings, production data, GitHub control branch from the implementation agent, existing PRs, or previous smoke-test file.
- In particular protect `tanaka-collab/nextjs-boilerplate` READY task `AUTOPILOT-WINDOWS-RESILIENCE-20261119-01` and its Draft PR #11, plus current income-diagnosis Draft PR #8.
- Preserve running Windows PID 11072 and its 24-hour monitoring, dedicated Task Scheduler configurations, all other Codex sessions, and the production Sendnav directory. Do not restart/log off Windows, stop any existing process, alter ACL/registry/sandbox security, use elevation, force-push, merge, deploy, send external communications, create paid resources, or expose secrets.
- Preserve user-selected Codex model / version / reasoning effort and existing local runner configuration. If unable to comply, safely stop with a BLOCKED report instead of changing models or using unauthorised paid APIs.
- Real Windows connectivity and original logs are required for claims about live intake. Isolated fixture only is explicitly NOT sufficient.

## Completed historical task retained (do not re-execute)

- Prior ID: `INCOME-AUTOPILOT-V31-20261118-01`
- Prior completed Draft PR: https://github.com/tanaka-collab/income-diagnosis/pull/8
- Historical completed task was documentation-only and must not be repeated, amended or merged as part of this test.
