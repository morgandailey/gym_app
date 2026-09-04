# Gym App

一個以手機使用為主的健身訓練記錄工具。現況是單檔 HTML（`workout_logger.html`），已在自己 Android 手機上日常使用。

方向：逐步演進成架構乾淨、對標成熟健身 App（Hevy / Strong）、能像一般 App 使用的 **PWA**，所有資料留在 App 內。

## 文件

- **[REBUILD_DESIGN.md](./REBUILD_DESIGN.md)** — 重構方案的**單一真相來源**：技術架構、資料模型、舊資料遷移、功能範圍、分階段路線。要討論方向或開始實作，看這份。
- `workout_logger.html` — 現有主程式（HTML + CSS + JS 全部在一個檔案）。重構期間留作行為規格參考，不再維護。
- `docs/archive/` — 先前的 9 份 planning docs。規劃角色已被 `REBUILD_DESIGN.md` 取代；現況盤點（`CURRENT_STATE.md`）與問題盤點（`KNOWN_ISSUES.md`）在 debug 時仍可參考。對照表見 `REBUILD_DESIGN.md` 附錄 B。

## 目前共識（摘要，詳見 REBUILD_DESIGN.md）

- 技術棧：Svelte + Vite + TypeScript + IndexedDB，產出 hosted PWA（GitHub Pages）
- 資料層先做：單一 canonical 模型，`logMd` 降為匯出格式
- 動作庫 + 穩定 ID，砍掉「容器 / 變體」概念
- 課表 = 可編輯範本；session 自我完整
- 功能對標成熟 App，schema 一次到位、UI 分階段
- 砍掉全部客製分析，改標準分析（volume / PR / 每週肌群組數）
- 砍掉全部體態 / 外觀追蹤方向
- 備份：每次結束訓練把 `data.json` push 到 GitHub
