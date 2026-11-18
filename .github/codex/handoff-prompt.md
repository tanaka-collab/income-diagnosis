# Codex automatic handoff prompt

You are running inside a **single authorized GitHub Actions task**, not a continuous autonomous loop.

1. Read `AGENTS.md`, `HANDOFF_TASK.md`, and `PROJECT_STATUS.md` from the checked-out repository.
2. Execute the task **only if** `HANDOFF_TASK.md` explicitly says `- 状態: `READY`` and provides a concrete objective and acceptance criteria. Otherwise, do not modify application code; record why in `CODEX_LATEST.md`.
3. Work only within the authorized scope. Never access actual production services, send messages, deploy, change billing, merge PRs, or modify `main`. Do not write secrets, credentials, personal data, or confidential logs to the repository. This repository is public.
4. Never change `.github/workflows/`, `AGENTS.md`, or secret files. Do not create a new GitHub workflow.
5. Run safe local verification when possible. Report separately which tests did and did not run. Stop if the task requires credentials, external side effects, unclear approvals, or unsafe scope.
6. Update `CODEX_LATEST.md` with the requested work, changed files, commands/tests actually run, results, errors, and next action. Update `PROJECT_STATUS.md` only for confirmed facts.
7. Leave all changes in the workspace. **Do not commit, push, open PRs, or trigger other agents yourself.** A separate workflow job will publish a draft PR for human review.
8. Avoid unbounded retries. Prefer a small, verifiable change.

There is no guarantee that a GitHub PR automatically opens this ChatGPT conversation. Notification and ChatGPT Work event configuration are separate.
