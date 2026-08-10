# Unitary 開枱指南

> 香港原創桌遊教學網誌 — 對應客 query 場景, 由新手到進階一站式教學。
> Brand sub-line of [UNITARY (3D 打印桌遊配件)](https://unitaryhk.com)

🌐 **Live URL**: (待部署) `https://unitary-guide.com/` 或 `mamayc-hk.github.io/unitary-guide/`

---

## 📁 檔案結構

```
unitary-guide/
├── index.html              # 首頁 (JS 讀 games.json 列表 + query 速查)
├── game.html               # 通用 game page (JS 讀 ?id=xxx 渲染)
├── assets/
│   ├── games.json          # ★ 全部 game data 集中管理 (加 game 改呢度)
│   ├── style.css           # Design system + 教學專用 .step-flow / .tactic-box / .query-match
│   ├── app.js              # Fetch + render logic (vanilla JS, 零依賴)
│   └── images/             # 全部 game 圖 (盒面 + step)
├── CNAME                   # 自訂域名 (待定)
├── robots.txt
├── sitemap.xml
└── README.md
```

---

## ➕ 加新 game (核心 workflow)

加一個新 game **只需要改一個 file**: `assets/games.json`。

### Step 1: 準備 data
對返 Notion `玩過嘅桌遊` database 嘅 entry, 準備以下 field:
- `id`: URL slug, 英文小寫 (例: `catan`, `bohnanza`)
- `name`: 中文名
- `name_en`: 英文名
- `publisher`, `year`: 出版資訊
- `category`: 分類 array
- `min_players`, `max_players`, `play_time`, `teach_time`: 規模
- `difficulty`: 1-5 數字
- `language_versions`: 語言 ver array
- `summary`: 一句話總覽
- `tagline`: 標語
- `customer_fit`: 客戶推介 object
- `box_image`, `step_images`: 圖片路徑
- `bgg_url`: BoardGameGeek 連結
- `is_complete`, `tactical_notes_count`, `has_tiebreaker`: 內容狀態

### Step 2: 改 games.json
喺 `games` array 加新 entry, 跟現有 entry 嘅 schema 對齊。

### Step 3: 整圖
- 盒面圖: 放 `assets/images/<id>-box.jpg`
- Step 圖: 放 `assets/images/<id>-step1.jpg`, `<id>-step2.jpg`, ...

### Step 4: Test
本地開 `index.html`, 確認:
- [ ] 新 entry 顯示喺 game list
- [ ] 點入去 game page 渲染正確
- [ ] 圖片 load 到
- [ ] 客 query 對應 box 顯示合適內容

### Step 5: Deploy
Push 到 main → 自動 GitHub Pages deploy (或者雙 branch push, 跟 UNITARY pattern)。

---

## 🎨 Design System

| Token | 用途 |
|-------|------|
| `--color-accent` (琥珀橙) | CTA / 重點 |
| `--color-tactic` (戰術綠) | 戰術提示框 |
| `--color-query` (客 query 紫) | 客 query 對應框 |
| `--color-coop` (合作青) | 合作向 game tag |
| `--color-warn` (警告紅) | 內容待補 / tiebreaker 缺 |

**教學專用 3 個新 class** (對應 take-time 缺失):
- `.step-flow` — 流程圖 (numbered boxes)
- `.tactic-box` — 戰術提示 (綠底)
- `.query-match` — 客 query 對應 (紫底)

---

## 🛠 維護 SOP

### 加 Notion 對應 entry
每次新 game 加咗, 同步去 Notion `玩過嘅桌遊` database 加 entry, 然後 cross-link:
- Notion: 詳細戰術 + 教學筆記 (用 Notion API 寫)
- Blog: 公開版本, 對應 query 場景

### 內容 review (每週)
對返 Notion 8/8 review check list:
- [ ] tiebreaker 齊 7 個 page
- [ ] 戰術提示 5 條以上 (進階 game 必備)
- [ ] 客戶推介段落有
- [ ] 客 query 對應 box 自動生成合適 query

### 圖片 SOP
- 盒面: 用官方 / BGG 圖 (CC licensed, attribution 留返喺 caption)
- Step 圖: paper-element-artisan agent 用 image_synthesize 生 vector 風插圖
- 風格: 一致 (橙 + 綠 + 紫配色, 線條為主, 文字輔助)

---

## 📊 對應 Notion 嘅關係

| Notion (private) | Blog (public) |
|------------------|---------------|
| 詳細戰術 + 教學筆記 | 公開化, 對應 query |
| BGG 連結 + 來源 | 公開連結 |
| 8/8 review audit | 內容狀態 (`is_complete`) |
| 客戶推介 object | 客戶推介段落 |

唔好將 Notion 內容 1:1 搬過嚟, 公開版本要 polished + 對應 query 場景。

---

## 📝 寫作指引 (對齊 UNITARY 風格但 sub-brand 重新定位)

- **語言**: 繁體中文, 香港用語 (UNITARY 一致)
- **Audience**: 桌遊新手 / 教客 / 揾 game 比客玩
- **每篇應有**: 玩法 + 戰術 + tiebreaker + 客戶推介 + 客 query 對應
- **語氣**: 真誠, 直接, 教新手朋友嘅口吻 (唔似 UNITARY maker industrial)
- **長度**: 1500-2500 字
- **SEO**: 每篇 1 個 main keyword (例: 「SETI 教學」)

---

## 🚀 部署

Push 到 `main` → GitHub Pages 自動 deploy (待 setup)。

或者跟 UNITARY pattern 雙 branch push:
```bash
git add -A
git commit -m "新 entry: <game name>"
git push origin main
git push origin main:gh-pages
```

---

## 🧪 本地 test

```bash
# 直接用瀏覽器開 index.html (要本地 server 因為 fetch 唔可以 file://)
cd unitary-guide
python3 -m http.server 8000
# 開 http://localhost:8000
```

---

## 🔗 相關

- **UNITARY (parent brand)**: https://unitaryhk.com — 3D 打印桌遊配件 STL 開放
- **Notion (private DB)**: 玩過嘅桌遊 database
- **Dosha 木盒**: cross-sell 載體 (將來加)
- **旺角新手桌遊 (兼職)**: 教客場景 source

---

## 📅 Roadmap

### Phase 1 (Week 1-2, kickoff 階段)
- [x] Repo base + design system + 7 game 嘅 skeleton (Notion 7 entry)
- [ ] paper-element-artisan 生眾豆得金 8 張 step vector 插圖
- [ ] writer agent 寫 7 個 game long-form content
- [ ] SETI page 補落 Notion + 對應 blog entry
- [ ] Deploy 到 GitHub Pages

### Phase 2 (Week 3-4, 完整化)
- [ ] 補 Project L / DNUP / 馬尼拉 詳細玩法
- [ ] 7 個 page 齊 tiebreaker + 戰術 + 客戶推介
- [ ] 加 Dosha 木盒 cross-sell
- [ ] 加 BGG 深 link + 戰術影片 embed

### Phase 3 (Month 2+, 規模化)
- [ ] 開放投稿 (用戶投稿 review)
- [ ] 戰術影片 series (YouTube embed)
- [ ] 客 query log (記低真實教客場景, 用嚟豐富 query-match box)
- [ ] 搜尋功能 (fuzzy search 全部 game)

---

© 2026 Unitary 開枱指南 · CC BY-NC-SA 4.0
