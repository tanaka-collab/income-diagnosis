# AI Handoff 自動連携の設定と運用

## 導入状況
- GitHubの4つの共有ファイル（AGENTS.md / HANDOFF_TASK.md / CODEX_LATEST.md / PROJECT_STATUS.md）を正式導入。
- GitHub Actionsの自動起動ワークフローを追加。HANDOFF_TASK.md が `READY` となって main に更新された場合だけ実行候補になる。
- **現段階ではAPIキー設定・実課金実行の確認はできていない。** `IDLE` ではCodexは起動しない。
- Codexの変更は新しいDraft PRとして提出する。マージ、本番反映、外部送信は自動化しない。

## 初回起動前に必要な設定
1. OpenAI APIの利用と別途請求に同意できる場合だけ、OpenAI PlatformでAPIキーを発行する（ChatGPTの月額契約とは別課金）。
2. GitHubのこのリポジトリの Settings → Secrets and variables → Actions → New repository secret で名前 `OPENAI_API_KEY` を作成する。秘密情報をチャットやコミットに貼らない。
3. GitHubの Settings → Actions → General → Workflow permissions で、このリポジトリのGitHub ActionsによるPull Request作成が許可されているか確認する。組織のポリシーで禁止されている場合は管理者の承認が必要。
4. 最初は軽い検証用タスクを `HANDOFF_TASK.md` に作り、ChatGPTから `main` の指示ファイルのみを `READY` に更新する。変更でワークフローが起動する。
5. Actionsで実行結果を確認し、Draft PR・`CODEX_LATEST.md` の内容をレビューする。失敗した場合は原因を記録し、無制限に再実行しない。
6. 次のタスクまで `HANDOFF_TASK.md` を `IDLE` に戻す。

## ChatGPT側の自動通知
- GitHubへの作業報告とChatGPTの自動起動は別物。
- ChatGPT Workで、当リポジトリに新しいDraft PRが作成された場合のGitHubイベントトリガーを設定し、PRの差分・`CODEX_LATEST.md` を読み、社長へ安全なレビューと次の判断材料を届けるよう指示できる（利用環境によって設定画面が異なる）。
- **この通常チャットからはWorkのGitHub Webhookイベント設定を直接作成できないため、設定完了とはみなさない。**

## 安全設計
- `main` から `HANDOFF_TASK.md` の更新でのみ自動起動。PRや外部ユーザーのコメントでは起動しない。
- `IDLE` の場合は処理しない。APIキーがなければ実行前に停止する。
- Codexは読み取りトークンで動作し、後続の別ジョブのみPR作成権限を持つ。
- ワークフロー、`AGENTS.md`、秘密鍵などの変更を含むパッチは拒否する。
- すべての変更はDraft PR。自動マージ・本番反映・再帰的な自動実行はしない。
- 公開リポジトリなので、開発指示・報告へ個人情報、求職者情報、機密情報を書かない。

## 運用
- 通常の依頼: 社長 → ChatGPT → `HANDOFF_TASK.md`（承認された内容のみ READY）
- 自動起動: GitHub Actions → Codex GitHub Action → Draft PR + `CODEX_LATEST.md`
- 自動レビュー通知: Workの対応するGitHubイベントトリガーを有効化した場合のみ実行
- コストはAPIのモデル・利用量とGitHub Actionsの利用条件により変化する。予算や上限の設定を行う。
