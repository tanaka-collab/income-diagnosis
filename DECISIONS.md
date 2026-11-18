# AI開発・過去の決定事項（人間が承認した方針のみ記録）

更新: 2026-11-18 JST

## 共通の決定
- 目的: 社長はChatGPTに開発目標を話すだけ。指示転記・Codexの手動起動・結果のコピーを極力なくす。
- コード、PR、実装履歴はGitHubで管理。ChatGPT・CodexのタスクはAGENTS.md、HANDOFF_TASK.md、CODEX_LATEST.md、PROJECT_STATUS.mdも参照する。
- 追加料金なし（既存ChatGPT Plusの利用枠・GitHub Free内）。OPENAI_API_KEYによる課金型実行、Codex追加クレジットの自動購入は禁止。
- Codex Cloud手動起動からGitHub PR報告への往復はincome-diagnosisで実証済み。これを無人実行と呼ばない。
- Surface Laptop 13は蓋を閉じてもスリープしない設定で標準運用。PCの電源・通信・Windowsログイン・利用枠は引き続き前提。
- プログラム自動化候補: Surface上でChatGPT PlusでサインインしたCodex CLIを呼ぶローカル常駐ブリッジ。GitHubのREADY指示を受け、隔離実行、複数回レビュー、Draft PRを作る。
- ChatGPT本体による自動レビューは別のChatGPT WorkのGitHub PRトリガー設定が必要。Work側の設定・無人連続ループは検証できるまで未完成扱い。
- 本番デプロイ、PRマージ、外部送信、課金、秘匿情報公開は自動実行しない。重大判断は本人の承認が必要。
- 他システム（送客ナビ等）を用途不明のリポジトリへ推測で移さない。

## 変更管理ルール
- 新しい開発指示を書く前に本ファイル、PROJECT_STATUS.md、HANDOFF_TASK.md、既存のDraft PRとCODEX_LATEST.mdを必ず確認する。
- 採用/却下した方針は理由と日付をここに追記する。過去決定を無断で覆さない。
- 実際に未導入の機能を「導入済み」と表現しない。
- 年収診断アプリ: Supabase認証・DB接続・本番機能は未検証、lint修正PR #1はDraftのまま。既存プロジェクトに関係ない自動化コードを入れない。
