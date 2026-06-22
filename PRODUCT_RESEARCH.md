# Product Research

## 這份文件的目的

這份文件用來整理和目前專案方向相近的產品、系統設計思路與研究資料。

它要回答的問題是：

> 市面上或研究上，跟我們想做的功能相近的東西有哪些？它們做對了什麼？哪些做法值得我們學？

## 這份文件適合什麼時候看

當你要做下面這些事情時，應該先看這份：

- 決定第一輪功能取捨
- 設計長期產品方向
- 判斷某個功能是不是已經被市場驗證
- 想找可參考的開發與資料流程

## 這份文件和其他文件的關係

- 上層入口： [README.md](./README.md)
- 現況總覽： [CURRENT_STATE.md](./CURRENT_STATE.md)
- 使用流程： [USER_FLOW.md](./USER_FLOW.md)
- 產品範圍： [PRODUCT_SCOPE.md](./PRODUCT_SCOPE.md)
- 資料模型： [DATA_MODEL.md](./DATA_MODEL.md)
- App 化方向： [APP_TRANSITION_PLAN.md](./APP_TRANSITION_PLAN.md)
- 這份文件角色：負責「外部參考研究」

---

## 一句話總結

從目前找到的產品與研究來看，有三個結論很清楚：

1. 成熟的健身 App 幾乎都把重點放在 `快速記錄 + 歷史可視化 + 長期一致性`
2. 進階個人化功能建立在 `穩定的結構化歷史資料` 上，不是建立在每次手動匯入檔案上
3. 體態 / 外觀 / 穿搭這條線可以做，但比較像第二或第三階段，不適合和第一輪訓練主流程混在一起

---

## 研究範圍

這份文件把參考來源分成三類：

### 1. 健身訓練記錄產品

目標：

- 看成熟產品把哪些功能放在核心
- 看它們怎麼處理記錄、進度、跨裝置與一致性

### 2. 體態 / 外觀追蹤方向

目標：

- 看未來若要擴充到體態與穿搭，應該往什麼資料結構思考

### 3. 研究 / 論文

目標：

- 看哪些能力有研究支持
- 看哪些方向還屬於早期或高風險探索

---

## 一、健身訓練產品參考

### A. Hevy

參考來源：

- 官方網站：<https://www.hevyapp.com/>

官方頁面明確強調的重點包括：

- 直覺化 workout logging
- routine planner
- warmup / drop / failure sets
- automatic rest timers
- exercise notes
- exercise charts
- personal records
- 1RM 計算
- custom exercises
- complete exercise history
- wearable / web 延伸

### 我們可以學什麼

Hevy 的產品訊號很清楚：

- 記錄流程是核心，不是附屬功能
- 歷史進度可視化是核心，不是裝飾
- rest timer、custom exercise、PR 都是建立在穩定紀錄流程上

對我們的啟發：

- 第一輪應該先把 `log workout` 做穩
- `history` 應該被提升為主產品能力
- 分析功能要建立在可回溯的結構化資料上

---

### B. Strong

參考來源：

- 官方網站：<https://www.strong.app/>

Strong 官方主軸非常直接：

- `Think less. Lift more.`
- 簡單、直覺的 workout tracking
- 計畫訓練並追蹤進度
- best sets
- max 1RM
- body fat percentage
- cloud / 多裝置同步
- 可匯出資料

### 我們可以學什麼

Strong 的核心不是花俏，而是：

- 降低記錄時的腦力負擔
- 讓進度資訊可以被回看
- 讓資料可攜與可匯出

對我們的啟發：

- 產品語氣應該偏「少想、快記、可信」
- `匯出` 很值得保留
- 但 `匯入` 不應該成為日常主流程

---

### C. Fitbod

參考來源：

- 官方網站：<https://fitbod.me/>
- 2026-06-20 TechRadar 訪談：<https://www.techradar.com/health-fitness/fitness-apps/its-no-longer-enough-for-an-app-to-tell-you-what-to-do-people-want-to-know-why-fitness-app-fitbods-founder-on-the-reason-behind-the-ai-fitness-boom>

Fitbod 官方重點包括：

- personalized workout plan
- 根據 body / recovery / progress 更新
- 根據 equipment、schedule、preferences 調整
- monitored recovery
- progressive overload

從近期訪談可以看出另一個方向：

- 用戶不只要 recommendation
- 也想知道 `為什麼是這個重量 / 這個動作 / 這個安排`

### 我們可以學什麼

Fitbod 給我們兩個重要訊號：

#### 1. 個人化是第二層能力

它不是先有 AI，再有產品；而是先有穩定記錄資料，再做個人化推薦。

#### 2. 解釋能力很重要

未來如果我們要做更進階的分析，不只要顯示結果，也要能解釋：

- 為什麼今天練這個
- 為什麼重量這樣建議
- 為什麼某肌群被判斷偏弱

對我們的啟發：

- 第一輪不該急著做複雜 AI
- 先建立乾淨的歷史資料與規則層
- 之後才有條件做可解釋的建議系統

---

## 二、體態 / 外觀方向參考

### A. AppearanceLab

參考來源：

- 本機專案：[/home/baozilla/workspace/AppearanceLab/README.md](/home/baozilla/workspace/AppearanceLab/README.md)
- 規劃文件：[/home/baozilla/workspace/AppearanceLab/docs/project_plan.md](/home/baozilla/workspace/AppearanceLab/docs/project_plan.md)

這個專案本身已經提供很清楚的方向：

- 本機優先
- 標準化拍照 SOP
- 身體指標 CSV
- 自動月報
- 不評分，只追蹤變化
- 將外觀拆成多個資料域
  - face
  - body
  - outfit
  - hair
  - glasses

### 我們可以學什麼

這個方向非常適合當 Gym App 的中長期延伸層，但不適合直接塞進第一輪主流程。

最值得學的是三件事：

#### 1. 資料分域

訓練、體態、穿搭不要混成一團。

#### 2. 標準化流程

體態照片與外觀比較的價值，建立在拍攝條件固定，而不是單次漂亮照片。

#### 3. 本機資料可審核

CSV / Markdown / 固定資料夾結構，讓資料透明、可搬移、可人工檢查。

對我們的啟發：

- Gym App 長期可以成為更大的個人外觀管理系統
- 但應該用 `模組化資料層` 接進來，不是把它硬塞進 workout logger 同一頁

---

### B. 穿搭 / 衣櫥管理方向

可參考信號：

- Stylebook 被廣泛提及的核心價值是：
  - catalog 衣物
  - 記錄 outfit
  - 統計 cost-per-wear
  - 找出低使用率單品

參考文章：

- Glamour 對 Stylebook 的介紹：<https://www.glamour.com/story/what-stylebook-closet-organization-app-taught-me-about-money-style>

### 我們可以學什麼

即使這不是官方產品頁，它還是給出一個值得記錄的產品訊號：

- 穿搭系統的核心不是「AI 評分」
- 而是 `紀錄你擁有什麼`、`你實際穿了什麼`、`哪些值得保留`

對我們的啟發：

- 如果未來做穿搭功能，應偏向：
  - wardrobe inventory
  - outfit history
  - repeatability / reuse
  - subjective notes

而不是一開始就做抽象的時尚推薦引擎

---

## 三、研究與論文參考

### A. 行為改變 / 自我追蹤

參考：

- 《Digital Weight Management Interventions: A review of commercial solutions and survey analysis of user needs》  
  <https://arxiv.org/abs/2604.06181>

這篇 2026 的研究重點很值得記：

- 商業數位減重產品普遍整合了
  - self-monitoring
  - goal setting
  - behavior change strategies
- 但在
  - social support
  - adaptive personalization
  - 某些更深入互動設計上仍有缺口

### 對我們的啟發

第一輪最有價值的不是加更多炫功能，而是把 `self-monitoring` 做好。

對你現在的產品來說，這幾個能力比什麼都重要：

- 穩定輸入
- 清楚歷史
- 可回看進步
- 可持續使用

---

### B. 手機照片推估身體組成

參考：

- 《Beyond BMI: Smartphone Body Composition Phenotyping for Cardiometabolic Risk Assessment》  
  <https://arxiv.org/abs/2603.27017>

這篇 2026 預印本的價值在於：

- 它證明用手機影像估計 body composition 是有研究熱度的
- 而且可能比單純 BMI 有更高資訊量

但要注意：

- 這是研究方向，不等於你現在就適合做成第一版功能
- 它依賴資料量、模型訓練與驗證
- 對單人自用產品來說，導入成本很高

### 對我們的啟發

未來做體態分析時，先用低風險方案：

- 固定照片
- 體重 / 體脂 / 腰圍
- 月度對比

比起一開始就做 ML 身體估計，更務實。

---

### C. App 品質評估方法

參考：

- 《Quality of Mobile Apps for Psychological Skills Training in Sport: a MARS-based Study》  
  <https://arxiv.org/abs/2409.12970>

雖然這篇研究的主題不是健身記錄本身，但它用了 MARS 這種評估框架去看 app 品質。

它的訊號是：

- 很多運動類 app 功能不一定少
- 但在 engagement、functionality、usability 上常常不夠好

### 對我們的啟發

如果你之後要自己評估版本品質，可以不用只看功能有沒有做出來，也可以看：

- Engagement：會不會想繼續用
- Functionality：操作是否穩、快、少錯
- Aesthetics：資訊是否清楚，不是只看好不好看
- Information quality：分析和建議是否可信

---

## 四、對我們最有價值的產品結論

### 第一個結論：主流程必須更短

成熟產品沒有把「每次先匯入歷史檔」當成日常流程。

所以你剛定下來的方向是正確的：

- 匯入降級
- 本機歷史升級
- 匯出保留

---

### 第二個結論：結構化歷史資料比分析更重要

Hevy、Strong、Fitbod 雖然定位不同，但共同點都不是「先做分析」，而是：

- 先讓紀錄穩定
- 先讓歷史可信
- 再做 PR、圖表、推薦

這對我們目前的重構順序影響很大：

- 先修資料
- 再修流程
- 再修分析

---

### 第三個結論：外觀系統應該是第二產品層

從 `AppearanceLab` 和穿搭追蹤的方向來看，外觀管理是很合理的延伸，但不應該破壞健身核心。

比較好的產品層次是：

```text
Layer 1
  健身訓練記錄

Layer 2
  體重 / 體脂 / 腰圍 / 體態照片

Layer 3
  穿搭 / 髮型 / 眼鏡 / 外觀月報
```

---

## 五、對開發流程的啟發

從這些產品與研究綜合起來，最值得借鏡的開發流程不是「一次做大」，而是：

### Phase 1：先把記錄主流程做穩

- 打開即用
- 記錄夠快
- 結束訓練可靠
- 本機歷史可延續

### Phase 2：再做結構化歷史與基本視覺化

- session history
- PR / progress
- 基本 body metrics

### Phase 3：再接上體態與外觀模組

- monthly photos
- body measurements
- outfit / style experiments

### Phase 4：最後才做更進階推薦或分析

- explainable recommendations
- auto-insights
- computer vision body analysis

---

## 六、目前最值得借用的功能清單

如果只挑第一輪最值得參考的功能，我會選這些：

### 直接值得借用

- 快速記錄單組資料
- 自動 rest timer
- custom exercises
- complete history
- PR / basic progress charts
- 可匯出資料

### 第二輪再考慮

- monitored recovery
- adaptive workout suggestions
- body metrics timeline
- monthly progress photos

### 第三輪之後再考慮

- body composition estimation from photos
- outfit intelligence
- style recommendation system

---

## 七、目前建議

基於這份研究，對你現在最實際的建議是：

1. 先把這個產品定義成 `本機優先的訓練記錄 App`
2. 先把 `匯入` 從主流程移除
3. 先建立可信的本機歷史資料
4. 分析先保留基本版，不急著再擴
5. 體態 / 穿搭 / 外觀先放進長期藍圖，不進第一輪主流程

---

## 來源

- Hevy 官方網站：<https://www.hevyapp.com/>
- Strong 官方網站：<https://www.strong.app/>
- Fitbod 官方網站：<https://fitbod.me/>
- TechRadar 對 Fitbod 訪談（2026-06-20）：<https://www.techradar.com/health-fitness/fitness-apps/its-no-longer-enough-for-an-app-to-tell-you-what-to-do-people-want-to-know-why-fitness-app-fitbods-founder-on-the-reason-behind-the-ai-fitness-boom>
- AppearanceLab README：[/home/baozilla/workspace/AppearanceLab/README.md](/home/baozilla/workspace/AppearanceLab/README.md)
- AppearanceLab project plan：[/home/baozilla/workspace/AppearanceLab/docs/project_plan.md](/home/baozilla/workspace/AppearanceLab/docs/project_plan.md)
- Glamour 對 Stylebook 的介紹：<https://www.glamour.com/story/what-stylebook-closet-organization-app-taught-me-about-money-style>
- Digital Weight Management Interventions（2026）：<https://arxiv.org/abs/2604.06181>
- Beyond BMI: Smartphone Body Composition Phenotyping（2026）：<https://arxiv.org/abs/2603.27017>
- Quality of Mobile Apps for Psychological Skills Training in Sport（2024）：<https://arxiv.org/abs/2409.12970>
