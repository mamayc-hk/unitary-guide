#!/bin/bash
# =====================================================
# Unitary 開枱指南 — Deploy Script
# =====================================================
# 兩種 deploy 選項:
#   A) GitHub Pages (HTTPS + osxkeychain, 跟 UNITARY 雙 branch pattern)
#   B) Netlify drop (1 click, 唔使 git)
# =====================================================

set -e

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
SITE_NAME="unitary-guide"
GH_USER="mamayc-hk"
REPO_URL="https://github.com/${GH_USER}/${SITE_NAME}.git"

echo "🚀 Unitary 開枱指南 deploy script"
echo "===================================="
echo "Source: $REPO_DIR"
echo "Target: GitHub Pages (${GH_USER}/${SITE_NAME})"
echo ""

# Step 1: Init git (if not yet)
if [ ! -d "$REPO_DIR/.git" ]; then
    echo "📦 Initialising git repo..."
    cd "$REPO_DIR"
    git init -b main
    git add -A
    git -c user.email=Mavis@unitary.hk -c user.name=Mavis commit -m "Initial commit: Unitary 開枱指南 blog scaffold"
fi

# Step 2: 設定 credential helper (跟 UNITARY 模式, 用 osxkeychain 拎 token)
cd "$REPO_DIR"
git config credential.helper osxkeychain

# Step 3: Add HTTPS remote (if not yet)
if ! git remote get-url origin >/dev/null 2>&1; then
    echo "🔗 Adding remote origin..."
    git remote add origin "$REPO_URL"
fi

# Step 4: 確認 remote URL
REMOTE=$(git remote get-url origin)
echo "🔗 Remote: $REMOTE"
echo ""

# Step 5: Push 到 main + gh-pages (對返 UNITARY 雙 branch pattern)
echo "⬆️  Pushing to main..."
git push -u origin main

echo ""
echo "⬆️  Pushing to gh-pages (GitHub Pages source)..."
git push -u origin main:gh-pages

echo ""
echo "✅ Deploy 完成!"
echo ""
echo "📋 部署 check list:"
echo "   1. GitHub repo: https://github.com/${GH_USER}/${SITE_NAME}"
echo "   2. GitHub Pages source branch: 設定為 'gh-pages' (已自動)"
echo "   3. Custom domain: 設定為 'unitary-guide.com' (如已買 domain, 加 CNAME file)"
echo "   4. Live URL: https://${GH_USER}.github.io/${SITE_NAME}/ (initial)"
echo "             或 https://unitary-guide.com/ (custom domain)"
echo ""
echo "📝 之後改 content 之後 deploy:"
echo "   cd $REPO_DIR"
echo "   git add -A"
echo "   git commit -m '新 entry: <game name>'"
echo "   git push origin main"
echo "   git push origin main:gh-pages"
echo ""
echo "💡 替代 deploy 方案 (Netlify drop, 唔使 git):"
echo "   1. 去 https://app.netlify.com/drop"
echo "   2. Drag-drop 個 '$REPO_DIR' folder 落去"
echo "   3. 拎到 URL 即 deploy (e.g. https://unitary-guide.netlify.app)"
echo "   4. 之後改 content 重新 drag-drop"
