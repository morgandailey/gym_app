# Rebuild Design

## 這份文件的目的

這份文件是 gym_app 重構方案的**單一真相來源**。

它取代先前 9 份 planning docs 的規劃角色（那些文件已移到 `docs/archive/`，保留作為現況盤點與 bug 脈絡參考）。

它要回答的問題是：

> 這個 App 要從「單檔 HTML 個人工具」演進成「架構乾淨、功能不互相衝突、對標成熟健身 App 的正式 PWA」，具體要做成什麼樣？資料模型長怎樣？舊資料怎麼進來？分幾個階段？

實作是**另一輪**的事。這份文件只負責把方案定清楚。

---

## 1. 目標與非目標

### 目標

- 從現有 `workout_logger.html` **繼續演進**（不是另起爐灶），做成架構乾淨、加新功能不會打壞舊功能的程式
- 對標成熟熱門健身 App（Hevy / Strong）的功能集與互動慣例
- 做成能在 Android 手機上**像一般 App 使用**的 PWA：桌面圖示、獨立視窗、離線可用
- **所有資料留在 App 內**（本機持久化），匯入 / 匯出降級成備份與遷移工具
- 純個人自用

### 非目標

- 不做帳號系統
- 不做跨裝置雲端同步（單機為準）
- 不做社群 / 多角色 / 訂閱 / 上架
- 不做體態 / 體重 / 體脂 / 腰圍 / 體態照片 / 穿搭 / 髮型 / 眼鏡等外觀追蹤功能 —— **完全移除，不留 roadmap**
- 不保留現有的客製分析（拮抗肌群比例、單位異常偵測、肌群不平衡警告、交叉估算臥推 1RM）—— 全部砍掉，改做標準分析
- 這一輪不做 APK / TWA 原生包裝（等 PWA 撞到限制再說）

---

## 2. 技術架構

### 2.1 技術棧

| 項目 | 選擇 | 理由 |
|---|---|---|
| UI 框架 | **Svelte** | 語法最接近手寫 HTML/CSS/JS，新概念最少；編譯型，打包體積小 |
| 建置工具 | **Vite** | Svelte 官方推薦，dev server 即時更新，`vite build` 產出靜態檔 |
| 儲存 | **IndexedDB**（透過薄 wrapper，例如 `idb`） | 容量大、非同步、適合累積型歷史資料 |
| 偏好設定 | **localStorage** | 只放輕量偏好（單位、目前頁籤、rest timer 預設秒數） |
| 測試 | **Vitest**（單元 / 邏輯）＋ 視需要 Playwright（流程） | 資料層與分析邏輯必須有測試覆蓋 |
| PWA | `vite-plugin-pwa`（產生 manifest + service worker） | 標準做法 |
| 語言 | TypeScript | 資料模型欄位多，型別能擋掉一整類 bug |

### 2.2 Repo 結構與過渡策略

同一個 `gym_app` repo，不開新 repo、不開長期分支。

```
gym_app/
  src/                    ← 新程式碼
  docs/
    archive/              ← 舊的 9 份 planning docs
  dist/  或  docs-site/   ← build 產出（GitHub Pages 來源）
  workout_logger.html     ← 舊版，留著當規格參考，不再維護
  REBUILD_DESIGN.md        ← 本文件
  README.md
  package.json / vite.config.ts / ...
```

- 舊 `workout_logger.html` **不刪**，當作「行為規格」對照用
- GitHub Pages 從 build 產出目錄提供服務（`dist/` 或設定成 `docs/`，實作時決定；若用 `docs/`，archive 改放別處避免混淆）
- `main` 分支直接演進；不需要在 v2 能用前凍結 `main`（舊 HTML 檔本身就是「還能用的版本」）

### 2.3 交付形態：hosted PWA

- 部署到 **GitHub Pages**：`https://morgandailey.github.io/gym_app/`（免費、自動 HTTPS）
- `manifest.webmanifest`：App 名稱、圖示（多尺寸）、`display: standalone`、主題色
- service worker：預快取所有 app shell 資源，**cache-first**；有新版時提示重新載入
- Android Chrome 開網址 →「安裝應用程式」→ 桌面圖示 → 獨立視窗全螢幕、離線可用
- **不做** APK / TWA。等真的撞到 PWA 限制（例如背景通知、檔案系統整合）再評估

### 2.4 應用架構原則

現有程式「功能互相衝突」的兩個根源，這次要從架構層解掉：

**根源 A：狀態散在一堆全域變數，改一個要手動記得更新其他畫面。**
→ 用 Svelte store 當單一狀態層。畫面訂閱 store，state 一變畫面自動同步，不再有「漏呼叫某個 render 函式」。

**根源 B：每個 panel 都要知道其他 panel 的存在（手動 `display:none` + 改按鈕文字）。**
→ 用單一 `activeView` 狀態（`log` / `analysis` / `history` / `settings` / ...），畫面依它算出要顯示誰。新增 view 不用回去改舊 view。

分層（嚴格單向依賴，上層依賴下層，不反向）：

```
UI 元件 (Svelte components)
   ↓ 只讀 store、只呼叫 actions
狀態層 (stores + actions)
   ↓
領域邏輯 (純函式：1RM、volume、PR、週量、分析)   ← 100% 可單元測試，不碰 DOM / IndexedDB
   ↓
資料存取層 (repository：IndexedDB CRUD + schema migration)
   ↓
IndexedDB
```

- 領域邏輯全部是**純函式**：吃 canonical 資料、吐衍生結果，不讀全域、不碰儲存
- markdown 匯入 / 匯出各是一個獨立模組，只在邊界做字串 ↔ canonical 物件轉換

---

## 3. 資料模型

### 3.1 核心原則

- **單一 canonical 模型**：`Session` + `Exercise`（動作庫）+ `Routine`（範本）是原始資料。其餘全部即時衍生，不落地：
  - 「上次紀錄」、單一動作歷史、PR、月曆、週量、所有分析
- `logMd`（markdown 字串）**不再是資料**，只是匯出格式
- 重量一律以 **kg** 儲存（`number`），顯示時才換算 lb
- 每個 IndexedDB store 帶 `schemaVersion`；升級時跑 migration runner

### 3.2 Entities

#### Exercise（動作庫條目）

```ts
interface Exercise {
  id: string;              // 穩定 ID，例如 "barbell-bench-press"（slug）或 uuid
  name: string;            // 顯示名，維持「中文 (English)」慣例，例如 "槓鈴臥推 (Barbell Bench Press)"
  aliases: string[];       // 歷史 / 其他寫法，供匯入比對，例如 ["槓鈴臥推", "臥推"]
  equipment: Equipment;    // 見下
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  isBodyweight: boolean;   // 徒手動作：volume 不計重量，只計組數
  isCustom: boolean;       // 使用者自建 vs 內建種子
  archived: boolean;       // 軟刪除（保留歷史引用完整）
  notes?: string;          // 動作層級備註（器材設定、握距等）
  createdAt: number;
  updatedAt: number;
}

type Equipment = "槓鈴" | "啞鈴" | "機械" | "滑輪" | "徒手" | "彈力帶" | "其他";
```

- **砍掉「容器 / 變體」概念。** `槓鈴臥推` 和 `啞鈴臥推` 就是動作庫裡兩個獨立條目
- 自訂動作 = `isCustom: true` 的動作庫條目，形狀完全一樣 → 分析自動認得
- 「換動作」的 UX 由 `RoutineItem.alternativeExerciseIds` 提供（見 Routine），不靠特殊資料結構

#### MuscleGroup（肌群群組，14 個）

週量統計用的標準群組：

```
胸 / 闊背 / 上背 / 肩前 / 肩中 / 肩後 / 二頭 / 三頭 / 前臂 / 股四頭 / 腿後 / 臀 / 小腿 / 核心
```

- 「上背」涵蓋斜方肌 + 菱形肌 + 後鏈上段
- 每動作標主要肌群 + 次要肌群
- 週量計算：**主要肌群每組算 1，次要肌群每組算 0.5**（成熟 App 標準做法）

#### Routine / RoutineItem（可編輯課表範本）

```ts
interface RoutineFolder {
  id: string;
  name: string;
  order: number;
}

interface Routine {
  id: string;
  folderId: string | null;
  name: string;              // 例如 "Day 1 Chest & Triceps"
  order: number;
  items: RoutineItem[];
  createdAt: number;
  updatedAt: number;
}

interface RoutineItem {
  exerciseId: string;
  alternativeExerciseIds: string[];  // 「今天可以改做這些」的快速切換清單
  targetSets: number | null;
  targetRepsLow: number | null;
  targetRepsHigh: number | null;
  supersetGroup: number | null;      // 同一數字 = 同一組 superset
  note?: string;
}
```

- 課表是**範本**。開新訓練時「套用範本」把 items 展開成一個 `Session` 的動作骨架，**套用後與範本脫鉤**（之後改範本不影響已開始的 session，改 session 不回寫範本）
- 現有寫死的 4 天 + 自由日 → 當作預設種子 Routine 匯入

#### Session / SessionExercise / SetEntry（一場訓練）

```ts
interface Session {
  id: string;
  startedAt: number;         // 時間戳 = session 身分。同一天多場靠這個分開
  endedAt: number | null;    // null = 進行中
  title: string;             // 自訂標題，套範本時預填範本名，可改
  fromRoutineId: string | null;  // 只記錄「從哪個範本套來的」，非外鍵約束
  exercises: SessionExercise[];
  notes?: string;
}

interface SessionExercise {
  exerciseId: string;
  order: number;
  supersetGroup: number | null;
  sets: SetEntry[];
  note?: string;
}

interface SetEntry {
  type: "warmup" | "normal" | "drop" | "failure";
  weightKg: number | null;   // null = 徒手 / 未填
  reps: number | null;
  rpe: number | null;        // 6–10，0.5 step，可空
  restSec: number | null;    // 該組**做完之後**的休息秒數
  note?: string;
  completedAt: number;       // 記錄當下時間戳
}
```

- **session 自我完整**：不綁 day 型別。你的歷史已證明「Day N」語意會漂移（`Day 1` 先後代表三種不同訓練；`Day 2` 和 `Day 5` 都叫 Back & Biceps）
- 「進行中的 session」就是 `endedAt === null` 的那一筆，直接存在 IndexedDB，重開 App 自動接續 → 解掉「沒持久化、每次要匯入」
- rest timer 寫回：計時狀態獨立，但**每一組的 `restSec` 一定在下列任一時機落地**：開始下一組、切到別的動作、手動停止、結束訓練、刪除該組。不再有「最後一組休息必定遺失」

#### Preferences（localStorage）

```ts
interface Preferences {
  unit: "kg" | "lb";                    // 全域預設顯示單位
  perExerciseUnit: Record<string, "kg" | "lb">;  // 單一動作覆寫（P2）
  defaultRestSec: number;
  restNotifications: boolean;
  lastActiveView: string;
  schemaVersion: number;
}
```

### 3.3 IndexedDB stores

| store | key | 內容 |
|---|---|---|
| `exercises` | `id` | 動作庫（種子 + 自訂） |
| `routines` | `id` | 課表範本 |
| `routineFolders` | `id` | 範本資料夾 |
| `sessions` | `id` | 所有訓練場次（含進行中） |
| `meta` | 固定 key | `schemaVersion`、上次備份 commit sha 等 |

衍生資料（PR、週量、月曆、單一動作歷史、分析）一律**查詢時即時計算**，不建 store。資料量級（單人、每年百來場）不需要預算快取；真的慢再加記憶體層 memo。

---

## 4. 遷移：`train_log.md` → IndexedDB

### 4.1 角色

- 寫一個**一次性匯入器**：吃舊的 `train_log.md`，產生 `sessions` + 補齊 `exercises`
- 匯入器獨立模組，有測試，吃現有那份 31 場的 log 當 fixture
- 匯入完成後，markdown 匯入只保留給「換手機 / 救資料」的低頻情境

### 4.2 解析規格（依現有 log 實況）

- session 標頭：`## YYYY/MM/DD <上午|下午|晚上>HH:MM ｜ <任意標題>`
  - 日期 + 時間 → `startedAt`；`｜` 之後整段 → `title`
  - 同一天多筆各自獨立（靠時間戳）
- 動作區塊：`### <動作名>`
- 組別表格：`| 組 | 重量 (kg) | 重量 (lb) | 次數 |` 或多一欄 `| 組後休息 |`
  - `— | —` = 徒手，`weightKg = null`
  - `X 下` → `reps`
  - `M:SS` → `restSec`
- 忽略：`> 最大重量`、`> 平均休息`、`> 體重動作`、`_（無紀錄）_`、多餘的 `---`
- `**肌群**：...` 行忽略（肌群改由動作庫決定）
- 容錯：解析不到的區塊記進 import log 給人看，不靜默丟

### 4.3 動作別名表（人工校對，已確認）

| 歷史名 | 併入動作庫條目 |
|---|---|
| `啞鈴臥推` | `啞鈴臥推 (Dumbbell Bench Press)` |
| `站姿槓鈴肩推 (Standing Barbell Press)` | `槓鈴肩推 (Overhead Press)` |
| `週替換深蹲 (六角槓/高槓)` | `高槓深蹲 (High Bar Squat)` |

- 其餘歷史動作名若已存在對應的種子條目 → 直接對上；對不到 → 自動建 `isCustom: true` 條目，肌群留空待補
- 完整歷史動作清單見附錄 A

### 4.4 歷史 rest 值處理

- **照原樣保留**（包含 `0:01`~`0:05` 的計時器 bug 值、`>10:00` 的忘了停）
- 分析與「平均休息」統計**預設不採計** rest（可在設定開啟）
- 不做自動清洗；要清由使用者事後手動編輯

---

## 5. 功能範圍與分期

原則：**schema 一次設計到位**（上面第 3 節的欄位全部就位），**UI 分階段做**。資料欄位事後補要遷移很痛，UI 事後補不痛。

### P0 — 主流程可用

- 動作庫：瀏覽 / 搜尋 / 篩選（器材、肌群）、新增 / 編輯 / 封存自訂動作
- 開始訓練：空白開始，或套用課表範本
- 記錄每組：weight、reps、set type（warmup / normal / drop / failure）、RPE、單組備註
- 每組自動休息計時：到時通知、可設預設秒數、可手動調整 / 停止
- 進行中 session 自動持久化，重開 App 接續
- 結束訓練：落地、回到摘要
- 歷史：session 列表、月曆視圖、單一動作歷史（歷次組數 / 重量 / 次數）
- 設定：全域單位、rest 預設、通知開關
- 手動匯出（JSON + markdown）

### P1 — 進度與課表

- 每動作進度圖表：估算 1RM（Epley）、單場總 volume、最大重量 隨時間
- PR 紀錄牆：每個動作追蹤四種
  - 最重單組
  - 最佳估算 1RM（Epley）
  - 最佳單組 volume（weight × reps）
  - 單場最高 volume
- 每週各肌群訓練組數（主要 1、次要 0.5）
- 訓練次數 / streak / 近 30 天
- 課表範本：多課表、資料夾、建立 / 編輯 / 排序、alternatives 清單
- 標準肌群 volume 分佈（取代舊的雷達圖 / 長條圖，資料源改成 canonical）
- GitHub 自動備份（見第 7 節）

### P2 — 進階便利

- Superset（記錄 + 課表）
- 槓片計算機
- 單一動作覆寫顯示單位
- markdown 匯入器 UI（救資料用）

### 明確不做

- 全部舊客製分析：拮抗肌群比例、`INTRA` 同群比例、單位異常偵測、肌群不平衡文字警告、交叉估算臥推 1RM
- 任何體態 / 外觀相關

---

## 6. 標準分析規格

取代 `renderAnalysis` / `renderAnalysisNew` / `analyzeMuscleSessions` 整套。全部吃 canonical `sessions`。

### 每週肌群組數

- 對每個 `SetEntry`（排除 warmup），該 `SessionExercise` 的動作查動作庫
- 主要肌群 +1、次要肌群 +0.5
- 依 ISO 週聚合，預設顯示近 8 週
- 徒手動作照常計組數

### 每動作進度

- **估算 1RM**：Epley `w × (1 + reps/30)`，`reps === 1` 時取 `w`；一場取該動作最佳一組
- **單場 volume**：Σ(weightKg × reps)，徒手動作以組數呈現另一條線
- **最大重量**：一場內最重的一組
- 三者各畫一條隨時間的線

### PR 紀錄牆

- 掃全部 session，對每動作維護四種最佳值 + 達成日期
- 新 session 落地時增量更新（也提供「重算全部」）

### 訓練頻率

- session 數 / 週、目前 streak、近 30 天訓練天數、月曆熱度

---

## 7. 備份與同步

### GitHub 自動備份（重用現有 GitHub Sync）

- 現有 GitHub 區塊是「同步 HTML 檔本身」→ 改成「同步資料」
- 每次**結束訓練**後：把序列化的 canonical store（`exercises` + `routines` + `routineFolders` + `sessions` + `meta`）寫成單一 `data.json`，透過 GitHub Contents API `PUT` 到 `morgandailey/gym_app`（路徑例如 `backup/data.json`）
- 每場訓練 = 一個 commit → 免費異地備份 + 完整版本史
- PAT / repo / branch / path 設定沿用現有 localStorage 機制
- 失敗只提示、不擋主流程（下次結束再補推）

### 手動匯出 / 匯入

- **匯出 JSON**：完整 canonical dump，換機 / 完整備份用
- **匯出 markdown**：人類可讀，維持現有格式慣例，備份 / 分享用
- **匯入 JSON**：整包還原（覆蓋前確認）
- **匯入 markdown**：走第 4 節的匯入器，合併進現有資料

### 一致性模型

- 單機為準，**last-write-wins**
- 不做衝突合併（沒有多裝置寫入場景）
- `data.json` 是備份產物，不是同步真相；還原是明確的使用者動作

---

## 8. 檔案 / 模組結構建議（實作時參考）

```
src/
  lib/
    db/
      schema.ts          # 型別 + schemaVersion
      migrations.ts       # migration runner
      repository.ts       # IndexedDB CRUD
    domain/
      oneRM.ts            # Epley 等純函式
      volume.ts           # 單場 / 週 volume
      pr.ts              # PR 計算
      weeklyMuscle.ts     # 週肌群組數
      analysis.ts         # 標準分析聚合
    seed/
      exercises.seed.ts   # 內建動作庫（附錄 A）
      routines.seed.ts    # 預設 4 天 + 自由日
      muscleGroups.ts     # 14 群定義
    io/
      importMarkdown.ts   # train_log.md → canonical（第 4 節）
      exportMarkdown.ts   # canonical → md
      exportJson.ts / importJson.ts
    sync/
      github.ts           # data.json push / pull
  stores/
    session.ts            # 進行中 session + actions
    restTimer.ts
    exercises.ts
    routines.ts
    preferences.ts
    view.ts               # activeView
  components/
    ...
  routes/ 或 views/
    Workout/               # 記錄主畫面
    History/
    ExerciseLibrary/
    Progress/
    Routines/
    Settings/
  service-worker 由 vite-plugin-pwa 產生
```

---

## 9. 分階段實作路線（供下一輪 grill / 規劃）

1. **Scaffold**：Vite + Svelte + TS + Vitest + vite-plugin-pwa；GitHub Pages 部署跑通（先放一個 hello world PWA，確認手機能安裝）
2. **資料層**：schema + repository + migration runner + 種子資料（動作庫、肌群、預設課表）+ 單元測試
3. **匯入器**：`train_log.md` → canonical，用現有 31 場 log 當測試 fixture，人工核對結果
4. **記錄主流程（P0）**：動作庫、開始訓練 / 套範本、記錄每組、休息計時、進行中持久化、結束訓練
5. **歷史（P0）**：session 列表、月曆、單一動作歷史
6. **匯出 + GitHub 備份**：JSON / markdown 匯出、結束訓練自動 push `data.json`
7. **進度與分析（P1）**：圖表、PR 牆、週肌群、頻率
8. **課表管理（P1）**：多範本、資料夾、alternatives
9. **P2**：superset、槓片計算機、per-exercise 單位、markdown 匯入 UI
10. 舊 `workout_logger.html` 功能對照檢查，確認沒有遺漏該保留的行為

每一步結束都要能部署、能在手機上用。

---

## 10. 未決 / 之後再定（不影響現在動工）

- 動作庫種子的完整清單與每條的肌群標註（附錄 A 是骨架，實作第 2 步時補完）
- App 圖示 / 名稱 / 主題色
- service worker 更新提示的具體 UX
- rest timer 通知在 PWA 背景時的可靠度（Android Chrome 實測後決定要不要 P2 補 APK）
- 是否要「訓練總時長」以外再記每組間隔的細節時間軸
- markdown 匯出格式要不要跟著 canonical 演進（新增 RPE / set type 欄位）

---

## 附錄 A：歷史動作清單（匯入器至少要涵蓋）

來自現有 `20260904_train_log.md` 的 31 個動作名：

```
Hanging Leg Raise
上斜啞鈴推舉
上斜槓鈴推舉 (Incline Barbell Press)
保加利亞分腿蹲 (Bulgarian Split Squat)
哈克蹲 (Hack Squat)
啞鈴二頭彎舉
啞鈴側平舉
啞鈴臥推                          → 併入 啞鈴臥推 (Dumbbell Bench Press)
啞鈴臥推 (Dumbbell Bench Press)
啞鈴飛鳥 (Dumbbell Fly)
單臂啞鈴划船
地雷管划船 (Landmine Row)
坐姿啞鈴二頭彎舉
坐姿啞鈴肩推
槓鈴羅馬尼亞硬舉 (Barbell RDL)
槓鈴肩推 (Overhead Press)
槓鈴臥推 (Barbell Bench Press)
滑輪三頭下壓 (繩索)
滑輪下拉 (寬手柄)
窄握滑輪下拉 (V柄)
窄握臥推 (Close Grip Bench Press)
站姿槓鈴肩推 (Standing Barbell Press)  → 併入 槓鈴肩推 (Overhead Press)
胸靠式器材划船
腿捲曲機 (Leg Curl)
蝴蝶機夾胸 (Pec Deck Fly)
週替換深蹲 (六角槓/高槓)              → 併入 高槓深蹲 (High Bar Squat)
錘式彎舉
雙槓支撐 (Dips)
離心引體向上 (Negative Pull-up)
面拉 (Face Pull)
高槓深蹲 (High Bar Squat)
鳥犬式
```

現有 `workout_logger.html` 的 `PLAN` 與 `MUSCLE_SCORES` 還有其他動作（滑輪側平舉、直臂下拉、Ab Wheel Rollout、集中彎舉、彈力帶輔助引體向上…），可一併納入種子庫。

## 附錄 B：舊文件對照

| 舊文件（`docs/archive/`） | 這份文件對應章節 / 處置 |
|---|---|
| `CURRENT_STATE.md` | 現況盤點，debug 時仍可參考；功能地圖已被第 5 節取代 |
| `KNOWN_ISSUES.md` | bug 脈絡仍有用；根因處理見第 2.4、3.2 節 |
| `DATA_MODEL.md` | 完全被第 3 節取代 |
| `USER_FLOW.md` | 理想流程被第 5 節 P0 取代 |
| `PRODUCT_SCOPE.md` | 被第 1、5 節取代；**中長期外觀層段落作廢** |
| `PRODUCT_RESEARCH.md` | Hevy / Strong 對標結論已吸收；**AppearanceLab / 穿搭段落作廢** |
| `APP_TRANSITION_PLAN.md` | 被第 2.3、2.4 節取代；**外觀層三階段作廢** |
| `FIRST_ITERATION_PLAN.md` | 被第 9 節取代（注意：舊的「先不加功能」原則已被使用者推翻，改為「schema 全上、UI 分批」） |
| `TEST_SCENARIOS.md` | 手測清單仍可用；新架構的測試改以 Vitest 為主 |
