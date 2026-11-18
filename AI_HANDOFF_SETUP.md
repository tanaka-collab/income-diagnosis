# AI Handoff｜追加料金なしの運用手順

## 方針
- 今のChatGPT Plus契約に含まれる利用枠で、ChatGPTとCodex Cloudを使う。
- GitHub（Free）を共通の連絡帳とソースコード保管場所にする。
- OpenAI APIキーは使用せず、課金型Codex GitHub Actionsワークフローも撤去済み。
- 「完全自動起動」ではないが、長文コピペの代わりにGitHub上の固定ファイルを使う。

## 普段の流れ
1. ChatGPTに作業依頼を伝える。ChatGPTは `HANDOFF_TASK.md` を指示内容で更新する。
2. Codex CloudのこのGitHubリポジトリで、新しい作業を開始する（ChatGPT Plusでログインしたアカウント）。必要なら短く「AGENTS.mdとHANDOFF_TASK.mdを読んで、指示を実行して」と入力する。
3. Codexが別ブランチで実装・テストし、`CODEX_LATEST.md` の報告とDraft PRをGitHubに保存する。
4. ChatGPTに「Codexの結果を確認して」と伝える。ChatGPTがGitHubから読み取り、結果・次の課題を整理する。
5. `main`へのマージや本番反映は必ず人間が承認する。

## 追加費用と制約
- この方式のための **新規API契約・APIキー作成・GitHub有料アップグレードは不要**。
- CodexはChatGPT Plusの適用される利用枠を消費する。利用上限を超えた追加クレジットなどは購入しない。
- GitHubの無料機能の範囲で使う。Publicリポジトリの通常の標準Runnerは無料だが、この運用ではAI実行用のGitHub Actions自体を使わない。
- GitHubのファイル更新だけでCodexは自動起動しない。Codexの作業完了もこのチャットに自動通知されない。
- 業務・顧客・求職者の機密情報やAPIキーをPublicリポジトリに保存しない。
