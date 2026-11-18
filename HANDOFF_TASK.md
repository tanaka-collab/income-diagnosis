# ChatGPT → Codex 指示書

- 状態: `IDLE`
- 更新日: 2026-11-18 (JST)
- 対象リポジトリ: `tanaka-collab/income-diagnosis`
- タスクID: `INCOME-AUTOPILOT-V31-20261118-01`
- 実行承認: 2026-11-18、責任者から依頼されたChappy × Codex Autopilotの完成検証の一環。SurfaceのローカルCodex CLIで実行し、Codex Cloudの手動起動は不要。
- 目的: `tanaka-collab/income-diagnosis` でGitHubの指示検知 → Codexによる実装 → 独立レビュー → Draft PR自動作成までを安全に検証する。
- 完了状況: 2026-11-18に無人実行・独立レビューPASS・Draft PR作成を検証済み（https://github.com/tanaka-collab/income-diagnosis/pull/8）。新しい明示指示まで再実行しない。
- 作業ブランチ: Windows Autopilotが作る `autopilot/task-*` のみ。指示の正本は `autopilot-control` ブランチのこのファイル。

## 完了記録（再実行禁止）

- 完了: `INCOME-AUTOPILOT-V31-20261118-01`
- 作業PR: https://github.com/tanaka-collab/income-diagnosis/pull/8
- Draft / Open / 未マージ、独立レビュー PASS。変更はテスト文書と `CODEX_LATEST.md` の2件のみ。

## 実装内容（完了済み、再実行禁止）

1. 次の **新規Markdownファイル1件のみ** 作成する。既存ファイルは変更しない。
   - ファイルパス: `docs/AUTOPILOT_INCOME_DIAGNOSIS_SMOKE.md`
2. このファイルにUTF-8で以下をすべて記載する。
   - 見出し: `# income-diagnosis Autopilot 動作確認`
   - タスクID: `INCOME-AUTOPILOT-V31-20261118-01`
   - 一文: `これはChatGPTからの指示をSurfaceのCodex CLIが自動処理することを検証するための無害な文書です。`
   - 一文: `アプリ本体、既存設定、依存ライブラリ、本番環境には変更を加えません。`
3. 文書を読み戻し、見出し、タスクID、指定の2文が含まれることを実際に検証する。
4. 実装担当Codexは変更ファイルがこの文書1件だけであることを確認し、行ったテストだけを報告する。

## 受け入れ条件と安全制約

- Codex CLIは文書を作成・検証するだけ。コミット、push、PR作成、デプロイ、外部メッセージ送信は禁止。
- Windows監視プログラムが独立の読み取り専用レビューで `VERDICT: PASS` を確認した後のみ、`CODEX_LATEST.md` を更新し、`main` 宛のDraft PRを作成する。アプリケーションのテストスイートはMarkdownだけの変更なら必須ではない。
- PRのファイル差分は新規文書とAutopilotが更新する `CODEX_LATEST.md` の計2件だけとする。
- `main` に直接コミットせず、PRマージや本番デプロイも行わない。新規API課金、認証情報や個人情報の取得・記録は行わない。
- リポジトリの `AGENTS.md` や既存の `HANDOFF_TASK.md` に「Codex Cloudの手動起動」と書かれている場合、その説明は旧ワークフローを指す。今回の明示承認済みローカルCLIテストには適用しない。それ以外の安全規則は守る。
- 安全に実行できない場合は、変更を破棄せず、監視プログラムに安全停止と障害記録を任せる。レビューを省略してPRを出さない。
