@AGENTS.md

# GROWDIENT v2 — Project Masterplan

## ВАЖНО: Рабочий процесс

**Мы работаем только в `/growdient-v2` — проект на localhost, НЕ в Webflow.**
- Dev-сервер всегда на `http://localhost:3000/`
- **НИКОГДА не упоминать Webflow Designer и не предлагать открыть его.**
- Никогда не использовать Webflow MCP Designer (`mcp__9ec1db7c...de_page_tool`, `element_tool`, `style_tool` и т.д.)
- Все изменения — в файлах проекта (TSX + CSS Modules)
- Webflow MCP использовать ТОЛЬКО для чтения данных (`data_sites_tool`, `data_cms_tool`) если нужны контентные данные

---

## Цель
Перенос сайта **growdient.com** (Webflow) → **Next.js 16** (App Router).
Дизайн и анимации — **1:1** с оригиналом. Данные из **Sanity CMS** (в будущем).
URL prod: `https://growdient.com`

---

## Стек

| Слой | Решение |
|------|---------|
| Framework | Next.js 16.2.1, App Router, TypeScript |
| Стили | **CSS Modules** + `styles/tokens.css` (design tokens) |
| Анимации | GSAP 3.14.2 + ScrollTrigger + SplitText |
| Скролл | Lenis 1.x (подключён к GSAP ticker) |
| Данные | JSON-файлы в `/data/` (будущее — Sanity CMS) |
| Шрифты | Next.js local fonts (`lib/fonts.ts`) → CSS vars |

---

## КРИТИЧНО: CSS-архитектура

### Используем CSS Modules — НЕ Webflow классы
Файл `styles/webflow.css` (154KB оригинал) **НЕ импортируется** в проект.
`globals.css` импортирует: `tokens.css` → `typography.css` → `grid.css` → `animations.css`.

**Правило:** каждый компонент получает свой `.module.css` файл.
Не используй raw Webflow классы в JSX — они не стилизованы.

### Ключевые CSS-переменные (из `styles/tokens.css`)
```css
/* Цвета */
--color-bg           /* #101012 — тёмный фон */
--color-cream        /* #edebe7 — светлый hero */
--color-text-100     /* rgba(248,247,243,1) — основной текст */
--color-text-64      /* 64% opacity — вторичный текст/теги */
--color-text-48      /* 48% — метаданные */
--color-surface      /* #1a1a1c */

/* Шрифты (определены в globals.css) */
--font-display       /* Instrument Serif — крупные заголовки */
--font-body          /* 42 Dotsans — тело, навигация */
--font-mono          /* Geist Mono — UI-лейблы */

/* Типографика */
--text-heading       /* clamp → 88px max — hero h1 */
--text-h1            /* clamp → 80px */
--text-body          /* 1rem = 16px */
--text-label         /* 0.625rem = 10px */
```

### Типографика h1 (из `styles/typography.css` + `styles/tokens.css`)
```css
/* Hero headline — Instrument Serif 88px */
font-family: var(--font-display);
font-size: 88px;
line-height: 76px;
font-weight: 400;
letter-spacing: -2px;

/* Project title (text-h6 equivalent) — Instrument Serif 40px */
font-family: var(--font-display);
font-size: 40px;

/* Service tag (label-small) — 42 Dotsans 10px ALL CAPS */
font-family: var(--font-body);
font-size: 10px;
letter-spacing: 1px;
text-transform: uppercase;
```

---

## Анимации — GSAP

### IX3 движок (`lib/animations/ix3.ts`)
Глобальный AnimationsProvider запускается один раз в `layout.tsx`.
Ищет элементы по CSS-классам и HTML-атрибутам:

| Атрибут / класс | Эффект |
|---|---|
| `[text="reveal"]` | char-by-char reveal при скролле |
| `[animate="opacity"]` | opacity chars reveal (внутри `.wrap-home-about`) |
| `[animate="link"]` | hover: chars shift up |
| `[button]` + `[button-text]` + `[button-bg]` | hover split-text button |
| `.card-project` + `[cms-overlay]` + `[cms-image]` | hover overlay + scale |
| `.nav-link` | hover: siblings dim to 32% |
| `.footer-middle-link` + `.overlay-hover-footer` | footer link hover |
| `.marquee-text.right/left` + `.marquee-images` | бесконечный marquee loop |

### Паттерн анимации в компонентах
```tsx
// Word-mask entrance (useEffect в Client Component)
const words = TEXT.split(' ')
el.innerHTML = words.map(w =>
  `<span class="${s.wordWrap}"><span class="${s.word}">${w}</span></span>`
).join(' ')
gsap.set(el.querySelectorAll(`.${s.word}`), { y: '110%', opacity: 0 })
gsap.to(wordEls, { y: '0%', opacity: 1, stagger: 0.045, duration: 1.0, ease: 'expo.out', delay: 0.2 })

// CSS для word-mask:
.wordWrap { display: inline-block; overflow: hidden; vertical-align: bottom; }
.word     { display: inline-block; }
```

### Lenis + GSAP ticker (`components/layout/LenisProvider.tsx`)
Lenis smooth scroll синхронизирован с GSAP ticker — `ScrollTrigger` работает корректно.

---

## Структура файлов

```
growdient-v2/
├── app/
│   ├── layout.tsx              ← Root layout: Lenis, AnimationsProvider, Navbar, ConditionalFooter
│   ├── page.tsx                ← Homepage (/)
│   └── projects/
│       ├── page.tsx            ← Work page (/projects) ✅
│       └── page.module.css
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          ← Pill nav: hamburger + logo + CTA
│   │   ├── Footer.tsx          ← Info footer (не CTA-footer)
│   │   ├── ConditionalFooter.tsx ← Footer только не на homepage
│   │   ├── LenisProvider.tsx
│   │   ├── AnimationsProvider.tsx
│   │   └── PageTransition/
│   ├── sections/
│   │   ├── Hero/               ← Homepage hero: video + GSAP word animation
│   │   ├── StudioIntro/        ← About overlap section
│   │   ├── ProjectsReel/       ← Infinite horizontal photo strip
│   │   ├── Marquee/            ← Gradient transition + бегущая строка услуг
│   │   ├── ProjectGrid/        ← Homepage: 2-col alternating grid (dark bg)
│   │   ├── ServicesSection/    ← Accordion list (cream bg)
│   │   ├── StatsSection/       ← Animated counters (dark bg)
│   │   ├── ContactCTA/         ← "Get on the train" full-bleed video footer
│   │   ├── WorkHero/           ← /projects sticky centered h1 ✅
│   │   └── WorkProjectList/    ← /projects alternating card grid ✅
│   ├── ui/
│   │   ├── Button.tsx
│   │   └── ProjectCard.tsx     ← Used on Homepage grid
│   └── effects/
│       ├── CustomCursor/
│       └── GrainOverlay/
├── lib/
│   ├── animations/ix3.ts       ← Весь IX3 GSAP движок
│   ├── data/
│   │   ├── projects.ts         ← getPublishedProjects(), getProject(slug)
│   │   ├── blog.ts
│   │   └── types.ts            ← Project, BlogPost interfaces
│   ├── fonts.ts                ← next/font local fonts → CSS vars
│   └── hooks/useIX3.ts
├── data/
│   ├── projects.json           ← 5 проектов с изображениями (CDN URLs)
│   └── blog.json
└── styles/
    ├── globals.css             ← Импортирует tokens+typography+grid+animations
    ├── tokens.css              ← Design tokens: цвета, шрифты, отступы
    ├── typography.css          ← Типографические классы (.heading, .label-small и др.)
    ├── grid.css
    ├── animations.css
    └── webflow.css             ← НЕ подключён (справочник оригинальных стилей)
```

---

## Данные (Project interface)
```ts
interface Project {
  id, name, slug, client, year
  services: string          // основной сервис (отображается под фото)
  tags: string[]            // дополнительные теги
  description: string
  thumbnail: { url, alt }   // CDN URL (Webflow CDN)
  images: ImageAsset[]
  texts: string[]           // 3 параграфа описания
  quote: { text, author, role }
  liveWebsite?: string
  awards?: string
  order: number
  isDraft: boolean
}
```

### Хелперы данных
```ts
getPublishedProjects()     // все не-draft, сортировка по order
getProject(slug)           // один проект по slug
getAdjacentProjects(slug)  // prev/next для навигации
```

---

## Страницы — статус

| Страница | URL | Статус |
|---|---|---|
| Homepage | `/` | ✅ Готово |
| Work | `/projects` | ✅ Готово |
| About | `/about` | ⬜ Нужно сделать |
| Blog | `/blog` | ⬜ Нужно сделать |
| Contact | `/contact` | ⬜ Нужно сделать |
| Project detail | `/projects/[slug]` | ⬜ Нужно сделать |

---

## SEO-требования для блог-статей

При добавлении или редактировании статьи в `data/blog.json` **обязательно проверить**:

### Разметка заголовков (H1–H4)
- **Один H1 на страницу** — заголовок статьи, задаётся в `post.title` (рендерится в `BlogArticleHero`)
- `<h1>` должен содержать текст напрямую в теге, не только в `aria-label`
- **H2** — основные разделы статьи
- **H3** — подразделы внутри H2 (никогда не ставить H3 без родительского H2)
- **H4** — опционально, подуровень H3
- Запрещено пропускать уровни: H1 → H3 (минуя H2), H2 → H4 (минуя H3)
- Карточки (related posts, превью) — **не использовать `<h3>`**, использовать `<p>` или `<span>`

### Проверка перед публикацией
Запустить после добавления статьи:
```bash
curl -s "http://localhost:3000/blog/[slug]" | python3 -c "
import sys, re
html = sys.stdin.read()
headings = re.findall(r'<(h[1-6])[^>]*>(.*?)</\1>', html, re.DOTALL)
for tag, content in headings:
    text = re.sub(r'<[^>]+>', '', content).strip()[:100]
    print(f'{tag}: {text}')
"
```
Ожидаемый результат: один h1, затем h2/h3 без пропусков уровней.

### Мета-поля в blog.json (обязательные)
```json
{
  "metaTitle": "...",         // до 60 символов, включает ключевое слово
  "metaDescription": "...",   // 120–160 символов
  "slug": "...",              // kebab-case, ключевое слово в начале
  "excerpt": "...",           // краткое описание для превью
  "publishedAt": "YYYY-MM-DD"
}
```

### Известные особенности рендеринга
- `BlogArticleHero`: `<h1>` использует GSAP word-mask анимацию — текст должен быть в теге как initial content, GSAP перезаписывает innerHTML на клиенте, но SSR/краулеры видят исходный текст
- `BlogArticleBody`: related posts используют `<p>`, не `<h3>` (зафиксировано)
- `extractHeadings()` в `lib/data/blog.ts` парсит только `h2` для ToC — убедиться что основные разделы именно H2

---

## Принципы разработки

1. **CSS Modules всегда** — один `.module.css` на компонент
2. **CSS-переменные** — из `tokens.css`, не хардкодить цвета/шрифты
3. **GSAP в `useEffect`** — Client Components, с cleanup (`tl.kill()`, `ScrollTrigger.kill()`)
4. **Анимации через word-mask** для заголовков: `wordWrap` + `word` паттерн
5. **Sticky hero** — `position: sticky; top: 0; height: 100vh` + project list ниже в том же контейнере
6. **Alternating grid** — `flex-direction: column`, `width: 50%`, `nth-child(even): margin-left: auto`
7. **Изображения** — `<Image fill sizes="...">` внутри `position: relative` контейнера с явной высотой
8. **Не дублировать** — ProjectGrid на homepage и WorkProjectList на /projects разные компоненты с разными контекстами

---

## Навигация (Navbar)
Меню в бургере:
- Work → `/projects`
- About → `/about`
- Blog → `/blog`
- Contact → `/contact`

CTA кнопка: "Let's work" → `/contact`

---

## Шрифты (local, из `/public/fonts/`)
- **Raveo Display** — логотип, footer wordmark "GROWDIENT"
- **Instrument Serif** — все крупные заголовки
- **42 Dotsans** — body text, навигация, описания
- **Geist Mono** — UI лейблы
- **Inter** — fallback
