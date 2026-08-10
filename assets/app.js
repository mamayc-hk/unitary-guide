// Unitary 開枱指南 — Fetch & Render Logic
// Vanilla JS, zero dependencies, 對應 unitary-guide site 結構

const SITE = {
    dataUrl: 'assets/games.json',
    fallbackIdParam: 'id',
    defaultGameImage: '🎲',
};

let SITE_DATA = null;

// === Load site data (inline 優先, fetch fallback) ===
function loadSiteData() {
    if (SITE_DATA) return Promise.resolve(SITE_DATA);
    // 1) Try inline <script id="site-data" type="application/json">
    const inline = document.getElementById('site-data');
    if (inline) {
        try {
            SITE_DATA = JSON.parse(inline.textContent);
            return Promise.resolve(SITE_DATA);
        } catch (e) {
            console.error('inline site data parse error:', e);
        }
    }
    // 2) Fallback: fetch (for local dev)
    return fetch(SITE.dataUrl)
        .then(r => r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status)))
        .then(data => { SITE_DATA = data; return data; })
        .catch(e => {
            console.error('loadSiteData fetch failed:', e);
            return null;
        });
}

// === Helpers ===
function el(tag, attrs = {}, children = []) {
    const e = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
        if (k === 'class') e.className = v;
        else if (k === 'html') e.innerHTML = v;
        else if (k === 'text') e.textContent = v;
        else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
        else e.setAttribute(k, v);
    });
    children.forEach(c => c && e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
    return e;
}

function gameUrl(id) { return `game.html?id=${encodeURIComponent(id)}`; }

function difficultyDots(level, max = 5) {
    const filled = Math.round(level);
    return '●'.repeat(filled) + '○'.repeat(max - filled);
}

function categoryTagClass(cat) {
    const map = {
        '策略': '', '家庭': 'family', '派對': 'party',
        '合作': 'coop', '卡牌': '', '談判': '',
        '經濟': '', '賭博': '', '解謎': 'coop',
        '拼圖': '', '太空': '', '中重歐': '',
    };
    return map[cat] || '';
}

// === Index page: render game list ===
async function renderIndex() {
    const data = await loadSiteData();
    if (!data) {
        document.getElementById('game-list').innerHTML = '<p style="color:var(--color-warn)">載入失敗, 請重新整理</p>';
        return;
    }

    // Site header
    document.title = `${data.site.name} — ${data.site.tagline}`;
    document.querySelector('.intro .tag-line').textContent = data.site.tagline;
    document.querySelector('.intro h1').textContent = data.site.name;
    document.querySelector('.intro p').textContent = data.site.description;

    // Sidebar about
    const about = document.querySelector('.about-text');
    if (about) {
        about.innerHTML = `
            <p><strong>${data.site.author}</strong></p>
            <p>${data.site.description}</p>
            <p>
                <a href="${data.site.contact.instagram}" target="_blank">Instagram →</a>
                &nbsp;·&nbsp;
                <a href="${data.site.contact.cults3d}" target="_blank">Cults3D →</a>
            </p>
        `;
    }

    // Render game cards
    const container = document.getElementById('game-list');
    container.innerHTML = '';

    // Kickoff game first, then is_complete, then incomplete
    const sorted = [...data.games].sort((a, b) => {
        if (a.is_kickoff && !b.is_kickoff) return -1;
        if (!a.is_kickoff && b.is_kickoff) return 1;
        const ai = a.is_complete ? 0 : 1;
        const bi = b.is_complete ? 0 : 1;
        if (ai !== bi) return ai - bi;
        return 0;
    });

    sorted.forEach(game => {
        const card = el('a', {
            class: 'game-card',
            href: gameUrl(game.id),
        }, [
            el('div', { class: 'game-card-box' }, [
                game.box_image
                    ? el('img', { src: game.box_image, alt: `${game.name} 盒面`, loading: 'lazy' })
                    : SITE.defaultGameImage
            ]),
            el('div', { class: 'game-card-body' }, [
                el('h3', {}, [game.name]),
                el('p', { class: 'game-card-tagline' }, [game.tagline || game.summary.slice(0, 50)]),
                el('div', { class: 'game-card-meta' }, [
                    el('span', {}, [`👥 ${game.min_players}-${game.max_players}人`]),
                    el('span', {}, [`⏱️ ${game.play_time}`]),
                    el('span', {}, [`📚 ${game.difficulty_label}`]),
                    ...(game.is_complete ? [] : [el('span', { style: 'color:var(--color-warn)' }, ['⚠️ 待補'])]),
                ]),
            ]),
        ]);
        container.appendChild(card);
    });
}

// === Game page: render single game ===
async function renderGame() {
    const data = await loadSiteData();
    if (!data) {
        document.getElementById('game-content').innerHTML = '<p style="color:var(--color-warn)">載入失敗</p>';
        return;
    }

    const id = new URLSearchParams(location.search).get(SITE.fallbackIdParam);
    const game = data.games.find(g => g.id === id);

    if (!game) {
        document.getElementById('game-content').innerHTML = `
            <h1>搵唔到呢個桌遊</h1>
            <p>ID: <code>${id || '(empty)'}</code></p>
            <p><a href="index.html" class="btn-cta">← 返回桌遊列表</a></p>
        `;
        return;
    }

    // Document meta
    document.title = `${game.name} (${game.name_en}) — ${data.site.name}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', game.summary);

    const content = document.getElementById('game-content');
    content.innerHTML = '';

    // Title block
    content.appendChild(el('div', { class: 'date' }, [data.site.established])); // TODO: actual date
    content.appendChild(el('h1', {}, [`${game.name} — ${game.tagline}`]));

    if (game.is_kickoff) {
        content.appendChild(el('div', { class: 'highlight-box' }, [
            el('p', {}, ['🌟 ', el('strong', {}, ['首篇 kick-off']), ' — 完整教學模板示範。'])
        ]));
    }

    // Box image
    if (game.box_image) {
        content.appendChild(el('div', { class: 'photo-grid' }, [
            el('figure', {}, [
                el('img', { src: game.box_image, alt: `${game.name} 盒面` }),
                el('figcaption', {}, [`${game.name} (${game.name_en}) — ${game.publisher}`])
            ])
        ]));
    }

    // Game meta grid
    const metaItems = [
        { label: '人數', value: `${game.min_players}-${game.max_players}` },
        { label: '教學時間', value: `${game.teach_time} min` },
        { label: '遊戲時間', value: game.play_time },
        { label: '難度', value: difficultyDots(game.difficulty) },
        { label: '語言', value: game.language_versions.join(' / ') },
        { label: '出版年', value: game.year },
    ];
    content.appendChild(el('div', { class: 'game-meta' },
        metaItems.map(m => el('div', { class: 'game-meta-item' }, [
            el('div', { class: 'label' }, [m.label]),
            el('div', { class: 'value' }, [m.value]),
        ]))
    ));

    // Tag list
    content.appendChild(el('div', { class: 'tag-list' },
        game.category.map(cat => el('span', { class: 'tag ' + categoryTagClass(cat) }, [cat]))
    ));

    // Summary
    content.appendChild(el('h2', {}, ['一句話總覽']));
    content.appendChild(el('p', {}, [game.summary]));

    // Completeness warning
    if (!game.is_complete) {
        content.appendChild(el('div', { class: 'step-box', style: 'border-left-color: var(--color-warn); background: var(--color-warn-soft)' }, [
            el('h4', { style: 'color: var(--color-warn); margin: 0 0 8px' }, ['⚠️ 內容待補']),
            el('p', {}, [game.completeness_gap || '教學內容仲未完整, 教客前請自行 review 規則書。']),
        ]));
    }

    // === 教學結構 (對應 take-time 缺失嘅 tiebreaker / 戰術 / 客戶推介) ===

    // Step flow
    if (game.step_images && game.step_images.length) {
        content.appendChild(el('h2', {}, ['完整流程 (Step by Step)']));
        const flowItems = game.step_images.map((img, i) =>
            el('li', {}, [
                el('strong', {}, [`Step ${i + 1}`]),
                el('span', {}, [` (圖: ${img.split('/').pop()})`]),
            ])
        );
        content.appendChild(el('div', { class: 'step-flow' }, [
            el('ol', {}, flowItems)
        ]));
        content.appendChild(el('p', { style: 'color: var(--color-text-soft); font-size: var(--fs-sm)' }, [
            '📷 完整 step 圖 (vector 風插圖) 由 paper-element-artisan agent 設計, ',
            el('em', {}, ['待生成']),
        ]));
    }

    // Tactical notes placeholder
    if (game.tactical_notes_count > 0) {
        content.appendChild(el('h2', {}, ['戰術提示']));
        content.appendChild(el('div', { class: 'tactic-box' }, [
            el('h4', {}, ['💡 ' + game.tactical_notes_count + ' 條戰術']),
            el('p', { style: 'color: var(--color-text-soft)' }, [
                '戰術詳細內容由 writer agent 撰寫, 對返 Notion 8/8 review 嘅 5 條戰術。',
                el('br'),
                el('em', {}, ['(待生成)']),
            ]),
        ]));
    } else if (game.tactical_notes_pending) {
        content.appendChild(el('h2', {}, ['戰術提示']));
        content.appendChild(el('div', { class: 'tactic-box', style: 'background: var(--color-warn-soft); border-left-color: var(--color-warn)' }, [
            el('h4', { style: 'color: var(--color-warn)' }, ['⚠️ 戰術待補']),
            el('p', { style: 'color: var(--color-text-soft)' }, [
                '進階客會問戰術, 教客前請自己睇官方規則書補充。',
            ]),
        ]));
    }

    // Tiebreaker
    content.appendChild(el('h2', {}, ['Tiebreaker (平手規則)']));
    if (game.has_tiebreaker) {
        content.appendChild(el('div', { class: 'info-box' }, [
            el('p', {}, [el('strong', {}, ['規則: ']), game.tiebreaker_note || '官方 tiebreaker 已記錄喺 Notion。']),
        ]));
    } else if (game.tiebreaker_pending) {
        content.appendChild(el('div', { class: 'info-box', style: 'border-left-color: var(--color-warn)' }, [
            el('p', { style: 'color: var(--color-warn)' }, [
                el('strong', {}, ['⚠️ 缺: ']),
                'tiebreaker 仲未寫, 教客前請查官方規則書補充。',
            ]),
        ]));
    }

    // Customer fit (對應「揾 game 比客」query 場景)
    if (game.has_customer_fit && game.customer_fit) {
        content.appendChild(el('h2', {}, ['客戶推介 (對應旺角 query)']));
        const fitItems = Object.entries(game.customer_fit).map(([k, v]) =>
            el('li', {}, [`${k}: ${v}`])
        );
        content.appendChild(el('ul', {}, fitItems));
    }

    // Query match (新功能: 對應客 query 場景)
    content.appendChild(el('h2', {}, ['客 query 對應']));
    content.appendChild(el('div', { class: 'query-match' }, [
        el('h4', {}, ['🗣️ 客會咁問...']));

    // Generate query matches based on game attributes
    const queries = generateQueryMatches(game);
    queries.forEach(q => {
        content.appendChild(el('div', { class: 'query-match' }, [
            el('h4', {}, [q.title]),
            el('blockquote', {}, [q.question]),
            el('p', {}, [q.answer]),
        ]));
    });

    // BGG link
    if (game.bgg_url) {
        content.appendChild(el('h2', {}, ['延伸閱讀']));
        content.appendChild(el('p', {}, [
            el('a', { href: game.bgg_url, target: '_blank', rel: 'noopener', class: 'btn-cta btn-secondary' }, [
                `📊 BoardGameGeek 詳細資料 →`
            ]),
        ]));
    }

    // Long-form markdown content (對返 content/<id>.md, writer agent 寫嘅 long-form)
    const longFormHtml = await renderLongForm(game.id);
    if (longFormHtml) {
        const longFormDiv = el('div', { class: 'long-form' });
        longFormDiv.innerHTML = longFormHtml;
        // Style: Markdown <h1> 隱藏 (因為 page 已經有 H1), 其他 heading 加 spacing
        longFormDiv.querySelectorAll('h1').forEach(h => h.style.display = 'none');
        longFormDiv.querySelectorAll('h2').forEach(h => h.classList.add('md-h2'));
        longFormDiv.querySelectorAll('h3').forEach(h => h.classList.add('md-h3'));
        longFormDiv.querySelectorAll('blockquote').forEach(b => b.classList.add('md-blockquote'));
        longFormDiv.querySelectorAll('ul, ol').forEach(l => l.classList.add('md-list'));
        // 將 long-form 插入喺 game-meta 之後, 結構性 block 之前
        const gameMetaEl = content.querySelector('.game-meta');
        if (gameMetaEl) {
            gameMetaEl.insertAdjacentElement('afterend', longFormDiv);
        } else {
            content.appendChild(longFormDiv);
        }
    }

    // Back link
    content.appendChild(el('p', { style: 'margin-top: 40px' }, [
        el('a', { href: 'index.html', class: 'back' }, ['← 返回桌遊列表']),
    ]));
}

// === Render long-form markdown content (從 content/<id>.md fetch) ===
async function renderLongForm(gameId) {
    try {
        const r = await fetch(`content/${gameId}.md`);
        if (!r.ok) {
            console.warn(`No long-form content for ${gameId} (HTTP ${r.status})`);
            return null;
        }
        const md = await r.text();
        if (typeof marked === 'undefined') {
            console.warn('marked.js 未載入, 返 raw markdown');
            return `<pre>${md.replace(/</g, '&lt;')}</pre>`;
        }
        return marked.parse(md);
    } catch (e) {
        console.error(`renderLongForm error for ${gameId}:`, e);
        return null;
    }
}

// === Generate query matches based on game attributes ===
function generateQueryMatches(game) {
    const queries = [];

    if (game.min_players === 1) {
        queries.push({
            title: '🧑 1 個人可以玩嗎?',
            question: '我自己一個想試下, 有咩 game 啱?',
            answer: `${game.name} 支援 1 人 (${game.min_players}-${game.max_players} 人), 單人都可以開。`,
        });
    }

    if (game.max_players >= 6) {
        queries.push({
            title: '👥 ' + game.max_players + ' 個人大群, 玩咩?',
            question: '我哋 ' + game.max_players + ' 個人, 有咩 game 可以一齊玩?',
            answer: `${game.name} 最多 ${game.max_players} 人, 派對向, 大群首選。`,
        });
    }

    if (game.teach_time <= 15) {
        queries.push({
            title: '⏱️ 30 min 內想完一局',
            question: '我哋得 30 分鐘, 有咩 game?',
            answer: `${game.name} 教 ${game.teach_time} min, 一局 ${game.play_time}, 啱 30 min 場景。`,
        });
    }

    if (game.difficulty <= 2.5) {
        queries.push({
            title: '🆕 新手第一次玩',
            question: '我哋全部第一次玩, 揀咩好?',
            answer: `${game.name} 規則簡單 (難度 ${game.difficulty_label}), 新手友善。`,
        });
    }

    if (game.category.includes('合作')) {
        queries.push({
            title: '🤝 唔想競爭, 玩合作',
            question: '我哋唔想互打, 有合作 game 嗎?',
            answer: `${game.name} 合作向, 全部人一齊贏或者一齊輸, 唔會有人被針對。`,
        });
    }

    if (game.language_versions.includes('繁中')) {
        queries.push({
            title: '🇭🇰 唔想睇英文規則',
            question: '有冇中文版?',
            answer: `${game.name} 有繁中版, 旺角多間店有售。`,
        });
    }

    if (queries.length === 0) {
        queries.push({
            title: '🗣️ 一般查詢',
            question: '呢個 game 點?',
            answer: game.summary,
        });
    }

    return queries;
}

// === Search (sidebar) ===
function setupSearch() {
    const input = document.getElementById('search-input');
    if (!input) return;
    input.addEventListener('keyup', e => {
        if (e.key === 'Enter') {
            const q = input.value.trim();
            if (q) {
                location.href = `index.html?q=${encodeURIComponent(q)}`;
            }
        }
    });
}

// === Router ===
document.addEventListener('DOMContentLoaded', () => {
    setupSearch();
    if (document.getElementById('game-list')) renderIndex();
    if (document.getElementById('game-content')) renderGame();
});
