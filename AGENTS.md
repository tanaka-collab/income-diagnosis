# AI開発の受け渡しルール（追加料金なし運用）

このリポジトリの開発用連絡帳はGitHubに一元化します。Codexの実行には **ChatGPT PlusでログインしたCodex Cloud** を使用します。OpenAI APIや課金付きGitHub ActionsによるCodex起動は使用しません。

## 役割
- 責任者: 目的・優先順位・重要な変更や本番反映の最終承認
- ChatGPT: 指示の整理、GitHub上のファイル更新、Codexの報告・PR確認
- Codex: 明示的に起動された作業の実装・テスト、GitHubへの作業報告

## 共通ファイル
- `HANDOFF_TASK.md`: 指示、作業範囲、受け入れ基準、タスク状態
- `CODEX_LATEST.md`: Codexが実際に行った作業・テストの結果
- `PROJECT_STATUS.md`: 全体の状況・未解決事項・関連PR

## 普段の使い方
1. 責任者はChatGPTに開発の目的を伝える。
2. ChatGPTは `HANDOFF_TASK.md` に指示を記録する（ユーザーの依頼に基づくこと）。
3. 責任者はCodex Cloudでこのリポジトリを選び、作業を起動する。必要に応じて「`AGENTS.md` と `HANDOFF_TASK.md` を読んで実行」と短く伝える。
4. Codexは作業ブランチ上で変更とローカル検証を行い、`CODEX_LATEST.md` に事実ベースの報告を記録し、GitHubにコミット・プッシュまたはDraft PRを作成する。
5. 責任者がChatGPTに進捗を尋ねたとき、ChatGPTはGitHub上の最新版とPRを読み、結果を確認する。

## 安全条件と限界
- 手動でCodex Cloudを起動する必要がある。GitHubのファイル更新だけではCodexは自動起動しない。
- Codexの完了がこのChatGPTチャットに自動で通知されるわけではない。
- `main` への直接変更、PRマージ、本番デプロイ、課金、外部送信は責任者の明示的承認なしに行わない。
- このリポジトリはpublic。APIキー、個人情報、求職者情報、機密ログをファイルやPRに残さない。
- コード変更は通常、別ブランチのDraft PRにまとめる。未実施のテストを成功と書かない。
- 履歴書き換え・既存作業の破棄、無制限の再試行をしない。
- APIキーはこの運用のためには作成・登録しない。

## Surface常駐ブリッジによる起動の例外（試験版）
- 本人が `UPSTREAM-Codex-Bridge` をSurfaceに導入し、タスクスケジューラで有効化した場合のみ、本人がそのプログラムに「READY指示を検知したらCodex CLIを起動する」権限を事前に与えたと扱える。
- その場合は上記の「Codex Cloudは手動起動」ルールを **Codex Cloudに限る制約** と解釈し、ローカルのCodex CLIは別方式の許可済み自動起動となる。
- 2026-11-18現在、ブリッジのSurface導入・本番通し試験・ChatGPT WorkのPR自動トリガーは未完了。設定前に「完全無人運用可能」と言わない。
- Codex CLIのレビューはChatGPT本体のレビューとは別。未承認のmainマージ、本番デプロイ、API課金、顧客連絡、機密情報の公開は禁止。
- 同じタスクIDの再実行は禁止。ChatGPTはDECISIONS.md・PROJECT_STATUS.md・未完了PRを毎回確認し、ユーザー依頼があるときだけREADYを発行する。
