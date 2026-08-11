# Unitary 開枱指南 — 已搬遷 ⚠️

> **2026-08-11 整合公告**: 本 repo 嘅內容已搬遷到 UNITARY 主站 sub-section。
> **新 URL**: https://unitaryhk.com/board-game/
> 本 repo 保留做 archive, 唔再更新。請去新位置睇最新內容。

---

## 整合原因

- 統一 brand: 對應返 user 嘅 mental model (unitary.hk 已經係 known brand)
- 單一 source of truth: SEO 共享 + 維護 single repo
- Cross-sell 強: Dosha 木盒 + UNITARY STL 喺同一個 site, 教學 page 可以 inline cross-link
- 教客 review 體驗改善: long-form content 100% server-rendered, 零 JS 依賴

## 新位置

- 🌐 **桌遊教學首頁**: https://unitaryhk.com/board-game/
- 📋 **個別 game page** (例 bohnanza): https://unitaryhk.com/board-game/bohnanza.html
- 8 個 game 全部 server-rendered HTML, 包含完整玩法 + 戰術 + tiebreaker + 客戶推介 + 客 query 對應

## Archive (本 repo)

- 27 張 vector 風 image
- 8 個 markdown content (`content/`)
- `games.json` (single source of truth)
- `build_pages.py` (build script)

## 對應 Notion

- 桌遊父 page: `2097b25a-9694-80c7-b5ec-ca4ee7fd6da2`
- SETI page: `3b87b25a-9694-81f8-829e-fd643f3657ab`
- Database 8 個 entry (Notion 7 個 + SETI 補)

---

© 2026 UNITARY · CC BY-NC-SA 4.0
