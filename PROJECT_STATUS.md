# 年収診断プロジェクト 進捗メモ

更新日: 2026-11-18 (JST)

## リポジトリ
- GitHub: https://github.com/tanaka-collab/income-diagnosis
- 既定ブランチ: `main`
- リポジトリ公開範囲: public

## GitHub上で確認できたこと
- PR #1「Fix income diagnosis lint errors」は `main` 向けの未マージDraft PR
- PR: https://github.com/tanaka-collab/income-diagnosis/pull/1
- PR #1 の説明欄には Lint / TypeScript / build のチェック成功と記録されている（今回、新たに検証はしていない）

## 次に確認すべきこと
- PR #1 のレビュー・マージ判断（自動マージしない）
- 実行環境の設定と本番動作確認（現状をここでは断定しない）
- `HANDOFF_TASK.md` を使った実タスク受け渡しテスト（まだ `IDLE` のため未実施）
- 完全自動化を行う場合、Codexの起動とChatGPTへのイベント通知・レビュー実行の連携方式を検討

## 受け渡しの状態
- 段階: 共有ファイルの正式導入済み。条件付きGitHub Actions自動連携を準備中（2026-11-18 JST）
- Codexが対象ブランチの指示・状態ファイルを確認したことを作業報告に記録
- Codexが `CODEX_LATEST.md` を更新・コミットし、ChatGPTがGitHubから最新版を読み取れた
- 検証範囲: 情報共有の往復（プログラムの実装やテストは未実施）
- Codex自動起動: 条件付きワークフロー準備済み。APIキー未設定・実稼働未検証
- ChatGPT自動監視: WorkのGitHub PRイベントトリガー未設定
- 本番コード変更: なし
