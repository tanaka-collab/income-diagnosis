# ChatGPT → Codex 受け渡し指示

- 状態: `IDLE`
- 更新日: 2026-11-18 (JST)
- 対象リポジトリ: `tanaka-collab/income-diagnosis`
- 次のタスクID: 未採番
- 作業の目的: 未指定
- 具体的な実装依頼: なし
- 受け入れ基準: 未指定

## 前回タスクの結果
- 完了済み: `HANDOFF-20261118-001`
- Codex実施: リポジトリ・既存PR #1の状況レビュー、作業報告更新
- 確認済み: ChatGPTがGitHubから報告とPR差分を直接取得
- 報告PR: https://github.com/tanaka-collab/income-diagnosis/pull/6 （mainへマージ済み）
- アプリ本体の変更: なし
- 本番操作: なし

## 次回の使い方
1. ChatGPTがユーザーの新しい依頼に沿ってこのファイルを更新し、タスクID・目的・完了条件・制約を記載する。
2. Codex Cloudを利用枠内で手動起動し、`AGENTS.md` とこのファイルを読み取らせる。
3. Codexが作業ブランチに結果を保存し、GitHubでDraft PRを作成する。
4. ChatGPTがPRと `CODEX_LATEST.md` を確認して報告する。

## 運用の制限
- `IDLE` 中は作業依頼なし。Codexが独断で過去のタスクを再実行しない。
- GitHubを通じた引き継ぎは可能だが、Codexの起動とChatGPTへの再確認依頼は自動化されていない。
- OpenAI API経由の追加課金型自動実行、追加クレジットの購入は行わない。
- PRマージ・本番反映・外部送信・機密情報の公開は、責任者が許可するまで行わない。
