# 年収診断プロジェクト 進捗メモ

更新日: 2026-11-18 (JST)

## リポジトリ
- GitHub: https://github.com/tanaka-collab/income-diagnosis
- 既定ブランチ: `main`
- main確認時のHEAD: `bdc3bcfced90bfaafc4b55a68fd2168b89fc3205`
- リポジトリ公開範囲: public

## GitHub上で確認した状態
- PR #1「Fix income diagnosis lint errors」はmain向けの未マージDraft PR。
- PR #1は `app/page.tsx` と `app/api/diagnose/route.ts` の型付け改善と未使用引数削除を含む。
- PR本文はlint、TypeScript、buildの成功を記録している。今回GitHub上で取得できたcommit statusはVercel成功1件で、PRレビュー投稿は見当たらなかった。
- PR取得時点のGitHub情報は `mergeable=true` / `mergeable_state=clean`。Draftのためレビューとマージ判断は未了。

## ソースから確認した構成
- Next.js 16 / React 19 / TypeScript / Supabase構成。
- 画面で年齢、現在年収、職種、業界、在籍年数を受け取り、`/api/diagnose` が診断レンジなどを計算し、Supabaseの `diagnoses` テーブルへ保存する。
- `package.json` のscriptsは `dev`、`build`、`start`、`lint`。確認したmainのファイル一覧ではテスト用ファイルは見つからなかった。
- 診断APIはSupabase URL、保存結果、保存エラー詳細をサーバーログへ出力する。ログの保存先やアクセス制御は確認していないため、本番利用前にログ内容・権限を確認する。

## 未確認・未解決
- Supabase環境変数の実値、DB接続、本番動作、サーバーログの保持・閲覧設定は未検証。
- PR #1記載のlint / TypeScript / buildは今回再実行していない。今回テスト・buildは未実施。
- PR #1のレビューとマージ判断は未了。

## 受け渡しの状態
- `HANDOFF-20261118-001` のレビュー・記録作業を `codex/handoff-20261118-001` で実施中。
- `CODEX_LATEST.md` に調査結果、確認範囲、未確認事項を記録。
- `HANDOFF_TASK.md` は指示に従い変更していない。
- アプリコード変更、mainへの変更・マージ、本番操作はなし。
- Draft PRは作業ブランチから作成予定。
