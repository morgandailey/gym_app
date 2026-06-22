# Gym App Docs

這個 `README.md` 是這個專案的文件大綱，不負責展開所有細節。

它的用途只有三個：

- 說明這個專案現在是什麼
- 告訴你每份文件各自負責什麼
- 提供清楚的閱讀入口與連結

## 專案一句話

這個專案目前是一個以手機使用為主的健身訓練記錄工具，現況是單檔 HTML，目標是逐步演進成在自己 Android 手機上能像 App 一樣使用的健身 App。

## 文件地圖

### 1. 專案定位

- [README.md](./README.md)
  - 用途：整體文件入口與大綱
  - 何時看：第一次進專案時先看這份
  - 你會知道：專案現況、文件分工、閱讀順序

### 2. App 化方向

- [APP_TRANSITION_PLAN.md](./APP_TRANSITION_PLAN.md)
  - 用途：說明這個專案怎麼從目前的 Web 工具，走到「在自己 Android 手機上像 App 一樣使用」
  - 何時看：要討論方向、技術路線、階段規劃時
  - 你會知道：路線圖、決策樹、分階段任務、PWA 與 Android 包裝的差異

### 3. 現況解碼

- [CURRENT_STATE.md](./CURRENT_STATE.md)
  - 用途：盤點目前 `workout_logger.html` 已經有的功能、設計結構與高風險區域
  - 何時看：要開始修 bug、改功能、重構前
  - 你會知道：目前功能地圖、資料流、結構特徵、最容易藏 bug 的地方

### 4. 問題盤點

- [KNOWN_ISSUES.md](./KNOWN_ISSUES.md)
  - 用途：整理目前已知問題、高風險可疑區、產品層問題與建議驗證順序
  - 何時看：要排修 bug、定測試順序、決定修整優先級時
  - 你會知道：哪些地方最容易壞、哪些地方最值得先驗證

### 5. 使用流程

- [USER_FLOW.md](./USER_FLOW.md)
  - 用途：記錄目前實際使用方式，以及之後要優化的理想流程
  - 何時看：要討論主流程、首頁、訓練流程與 App 互動設計時
  - 你會知道：你現在怎麼用、未來應該把哪條流程優先做好

### 6. 產品範圍

- [PRODUCT_SCOPE.md](./PRODUCT_SCOPE.md)
  - 用途：定義第一版真正重要的功能、次要功能與目前先不做的事情
  - 何時看：要決定下一步做什麼、不要做什麼時
  - 你會知道：哪些是核心、哪些該延後、哪些不該讓主流程失焦

### 7. 資料模型

- [DATA_MODEL.md](./DATA_MODEL.md)
  - 用途：整理目前系統有哪些資料、哪些是核心資料、資料彼此怎麼流動
  - 何時看：要修資料 bug、改儲存方式、重構狀態管理時
  - 你會知道：目前的資料層長什麼樣、哪些是原始資料、哪些只是衍生資料

### 8. 測試場景

- [TEST_SCENARIOS.md](./TEST_SCENARIOS.md)
  - 用途：把主流程與高風險區轉成可執行的驗證清單
  - 何時看：要手測、修 bug 後回歸驗證、重構前後比對時
  - 你會知道：先測什麼、怎麼測、什麼算通過

### 9. 外部研究

- [PRODUCT_RESEARCH.md](./PRODUCT_RESEARCH.md)
  - 用途：整理相似產品、相關研究與可借鏡的產品 / 開發做法
  - 何時看：要做功能取捨、定長期方向、找外部參考時
  - 你會知道：市場上成熟產品重視什麼、哪些研究方向值得學、哪些方向太早做

## 建議閱讀順序

1. 先看 [README.md](./README.md)
2. 再看 [CURRENT_STATE.md](./CURRENT_STATE.md)
3. 再看 [KNOWN_ISSUES.md](./KNOWN_ISSUES.md)
4. 再看 [USER_FLOW.md](./USER_FLOW.md)
5. 再看 [PRODUCT_SCOPE.md](./PRODUCT_SCOPE.md)
6. 再看 [DATA_MODEL.md](./DATA_MODEL.md)
7. 再看 [TEST_SCENARIOS.md](./TEST_SCENARIOS.md)
8. 再看 [PRODUCT_RESEARCH.md](./PRODUCT_RESEARCH.md)
9. 最後看 [APP_TRANSITION_PLAN.md](./APP_TRANSITION_PLAN.md)

## 目前專案檔案

- `workout_logger.html`
  - 現有主程式
  - 目前包含 HTML、CSS、JavaScript 全部邏輯

## 目前共識

- 這個專案現在還不是正式 Android App
- 目前也不以上架為目標
- 現階段優先事項不是立刻重寫
- 先把使用流程、文件結構、演進方向釐清

## 文件撰寫原則

之後新增文件時，應遵守這幾點：

- 每份文件開頭都要先寫清楚「這份文件的目的」
- 每份文件都應該能從這份 `README.md` 找到
- 每份文件都應避免和其他文件大量重複
- 如果文件屬於某個主題，應在 `README.md` 底下有對應分類

## 下一步適合補的文件

如果之後繼續整理文件，建議優先補這幾種：

- `USER_FLOW.md`
  - 定義從打開 App 到結束訓練的完整流程
- `DATA_MODEL.md`
  - 定義訓練資料、歷史紀錄、匯入匯出格式

這些文件如果要新增，也都應該回來掛在這份 `README.md` 底下。
