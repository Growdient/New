@AGENTS.md

# GROWDIENT v2 — Project Masterplan

## Рабочий процесс

- Dev: `http://localhost:3000/`
- Prod: `https://growdient.com` (деплой через Vercel)
- Все изменения — в файлах проекта (TSX + CSS Modules)

---

## Стек

| Слой | Решение |
|------|---------|
| Framework | Next.js 16.2.1, App Router, TypeScript |
| Деплой | Vercel → growdient.com |
| Стили | **CSS Modules** + `styles/tokens.css` (design tokens) |
| Анимации | GSAP 3.14.2 + ScrollTrigger + SplitText |
| Скролл | Lenis 1.x (подключён к GSAP ticker) |
| Данные | Sanity CMS (`lib/sanity/`) |
| Шрифты | Next.js local fonts (`lib/fonts.ts`) → CSS vars |

---

## CSS-архитектура

`globals.css` импортирует: `tokens.css` → `typography.css` → `grid.css` → `animations.css`.

**Правило:** каждый компонент получает свой `.module.css` файл.

### Ключевые CSS-переменные (`styles/tokens.css`)
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
--font-body          /* Inter — тело, навигация */
--font-mono          /* Geist Mono — UI-лейблы */
--font-wordmark      /* Raveo Display — логотип, footer */

/* Типографика */
--text-heading       /* clamp → 88px max — hero h1 */
--text-h1            /* clamp → 80px */
--text-body          /* 1rem = 16px */
--text-label         /* 0.625rem = 10px */
```

### Light theme (`[data-theme="light"]`)
```css
--color-text-100: rgba(12,12,12,1.0)   /* near-black */
--color-text-64:  rgba(12,12,12,0.64)  /* gray body text */
--color-text-48:  rgba(12,12,12,0.48)  /* мета */
```

---

## Шрифты (`/public/fonts/`)
- **Raveo Display** — логотип, footer wordmark "GROWDIENT"
- **Instrument Serif** — все крупные заголовки (`--font-display`)
- **Inter** — body text, навигация, описания (`--font-body`)
- **Geist Mono** — UI лейблы (`--font-mono`)

---

## Анимации — GSAP

### IX3 движок (`lib/animations/ix3.ts`)
Глобальный AnimationsProvider запускается один раз в `layout.tsx`.

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

### Паттерн word-mask entrance
```tsx
const words = TEXT.split(' ')
el.innerHTML = words.map(w =>
  `<span class="${s.wordWrap}"><span class="${s.word}">${w}</span></span>`
).join(' ')
gsap.set(el.querySelectorAll(`.${s.word}`), { y: '110%', opacity: 0 })
gsap.to(wordEls, { y: '0%', opacity: 1, stagger: 0.045, duration: 1.0, ease: 'expo.out', delay: 0.2 })

// CSS:
.wordWrap { display: inline-block; overflow: hidden; vertical-align: bottom; }
.word     { display: inline-block; }
```

---

## Структура файлов

```
growdient-v2/
├── app/
│   ├── layout.tsx              ← Root layout: Lenis, AnimationsProvider, Navbar, ConditionalFooter
│   ├── page.tsx                ← Homepage (/)
│   ├── projects/
│   │   ├── page.tsx            ← Work page (/projects) ✅
│   │   └── [slug]/page.tsx     ← Project detail ✅
│   ├── blog/
│   │   ├── page.tsx            ← Blog index ✅
│   │   └── [slug]/page.tsx     ← Blog article ✅
│   └── contact/page.tsx        ← Contact ✅
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ConditionalFooter.tsx
│   │   ├── LenisProvider.tsx
│   │   ├── AnimationsProvider.tsx
│   │   └── PageTransition/
│   ├── sections/
│   │   ├── Hero/               ← Homepage hero: video + GSAP word animation
│   │   ├── StudioIntro/
│   │   ├── ProjectsReel/       ← Infinite horizontal photo strip
│   │   ├── Marquee/
│   │   ├── ProjectGrid/        ← Homepage: 2-col alternating grid (dark bg)
│   │   ├── ServicesSection/    ← Accordion list (cream bg)
│   │   ├── StatsSection/       ← Animated counters (dark bg)
│   │   ├── ContactCTA/         ← "Get on the train" full-bleed video footer
│   │   ├── WorkHero/           ← /projects sticky centered h1
│   │   ├── WorkProjectList/    ← /projects alternating card grid
│   │   ├── BlogArticleHero/
│   │   ├── BlogArticleBody/    ← Prose + sticky ToC sidebar
│   │   └── ContactHero/
│   ├── ui/
│   │   ├── Button.tsx
│   │   └── ProjectCard.tsx
│   └── effects/
│       ├── CustomCursor/
│       └── GrainOverlay/
├── lib/
│   ├── animations/ix3.ts       ← GSAP анимации
│   ├── sanity/
│   │   ├── client.ts
│   │   ├── queries.ts          ← sanityGetPost(), sanityGetPosts(), sanityGetProject()
│   │   └── ptToHtml.ts         ← Portable Text → HTML сериализатор
│   ├── data/
│   │   ├── projects.ts
│   │   ├── blog.ts
│   │   └── types.ts
│   └── fonts.ts                ← next/font local fonts → CSS vars
├── data/
│   ├── projects.json
│   └── blog.json               ← fallback (основные данные из Sanity)
└── styles/
    ├── globals.css
    ├── tokens.css
    ├── typography.css
    ├── grid.css
    └── animations.css
```

---

## Страницы — статус

| Страница | URL | Статус |
|---|---|---|
| Homepage | `/` | ✅ |
| Work | `/projects` | ✅ |
| Project detail | `/projects/[slug]` | ✅ |
| Blog index | `/blog` | ✅ |
| Blog article | `/blog/[slug]` | ✅ |
| Contact | `/contact` | ✅ |
| About | `/about` | ⬜ |

---

## Данные из Sanity

Все данные из Sanity CMS через `lib/sanity/queries.ts`.
Portable Text → HTML конвертируется в `lib/sanity/ptToHtml.ts`.

### BlogPost interface
```ts
interface BlogPost {
  id, title, slug, publishedAt
  excerpt?: string
  coverImage?: ImageAsset
  body: string          // HTML (сконвертированный из PT)
  category?: string
  metaTitle?: string
  metaDescription?: string
}
```

### Project interface
```ts
interface Project {
  id, name, slug, client, year
  services: string
  tags: string[]
  description: string
  thumbnail: ImageAsset
  images: ImageAsset[]
  texts: string[]
  quote: { text, author, role }
  liveWebsite?: string
  awards?: string
  order: number
  isDraft: boolean
}
```

---

## SEO-требования для блог-статей

- **Один H1 на страницу** — заголовок статьи (`post.title` → `BlogArticleHero`)
- **H2** — основные разделы, **H3** — подразделы внутри H2
- Нельзя пропускать уровни (H1 → H3, H2 → H4)
- Related posts карточки — `<p>`, не `<h3>`
- `extractHeadings()` в `lib/data/blog.ts` парсит только `h2` для ToC

### Проверка заголовков
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

---

## Принципы разработки

1. **CSS Modules всегда** — один `.module.css` на компонент
2. **CSS-переменные** — из `tokens.css`, не хардкодить цвета/шрифты
3. **GSAP в `useEffect`** — Client Components, с cleanup (`tl.kill()`, `ScrollTrigger.kill()`)
4. **Анимации через word-mask** для заголовков: `wordWrap` + `word` паттерн
5. **Sticky hero** — `position: sticky; top: 0; height: 100vh`
6. **Alternating grid** — `flex-direction: column`, `width: 50%`, `nth-child(even): margin-left: auto`
7. **Изображения** — `<Image fill sizes="...">` внутри `position: relative` контейнера с явной высотой

---

## Навигация (Navbar)
- Work → `/projects`
- About → `/about`
- Blog → `/blog`
- Contact → `/contact`
- CTA: "Let's work" → `/contact`
