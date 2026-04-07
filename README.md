# A.R. Rahman Fan Archive

A production-grade Next.js fan site for A.R. Rahman — featuring a complete discography pulled live from MusicBrainz, streaming links via Spotify, a manually curated concert/performance listing via Sanity CMS, and live news via GNews.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS v3 |
| CMS | Sanity.io v3 |
| Discography | MusicBrainz API (free, no key) |
| Streaming links | Spotify Web API |
| News | GNews API |
| Deployment | Vercel (recommended) |

---

## Project Structure

```
ar-rahman-fansite/
├── app/
│   ├── layout.tsx                 # Root layout (fonts, Navbar, Footer)
│   ├── globals.css                # Design tokens + global styles
│   ├── page.tsx                   # Home (Hero + About + Discography)
│   ├── not-found.tsx
│   ├── albums/
│   │   └── [slug]/page.tsx        # Album detail + full track listing
│   ├── performances/
│   │   └── page.tsx               # Concerts & live events (from Sanity)
│   └── news/
│       └── page.tsx               # Live news (GNews, 15min ISR)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── ui/
│   │   ├── Badge.tsx
│   │   └── Skeleton.tsx
│   ├── albums/
│   │   ├── AlbumCard.tsx
│   │   ├── AlbumGrid.tsx          # Client component with language filter
│   │   └── SongList.tsx           # Hover-to-reveal streaming links
│   ├── performances/
│   │   └── PerformanceCard.tsx
│   └── news/
│       └── NewsCard.tsx
├── lib/
│   ├── sanity.ts                  # Sanity client + GROQ queries
│   ├── musicbrainz.ts             # MusicBrainz API client
│   ├── spotify.ts                 # Spotify enrichment (cover art + links)
│   ├── news.ts                    # GNews API client
│   └── utils.ts                   # cn(), formatDate(), constants
├── sanity/
│   ├── schemas/
│   │   ├── homePage.ts            # Singleton: welcome message
│   │   ├── about.ts               # Singleton: bio, tags, awards
│   │   └── performance.ts         # Collection: concerts & live events
│   └── schemas/index.ts
├── sanity.config.ts               # Sanity Studio config
├── types/index.ts                 # All TypeScript types
├── next.config.ts
├── tailwind.config.ts
└── .env.local.example
```

---

## Setup

### 1. Clone & install

```bash
git clone <your-repo>
cd ar-rahman-fansite
npm install
```

### 2. Environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in:

#### Sanity
1. Go to [sanity.io](https://sanity.io) → Create a new project
2. Copy the **Project ID** and set `NEXT_PUBLIC_SANITY_PROJECT_ID`
3. Create a read token in **API → Tokens** → set `SANITY_API_TOKEN`

#### Spotify
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create an app → copy **Client ID** and **Client Secret**

#### GNews
1. Sign up at [gnews.io](https://gnews.io) — free tier: 100 requests/day
2. Copy your API key

#### MusicBrainz
No key required — just set your app name and contact email in `.env.local` for the User-Agent header (required by MusicBrainz policy).

### 3. Run the Sanity Studio

```bash
npx sanity dev
```

Open `http://localhost:3333` and populate:
- **Home Page** — welcome heading, subheading, body text
- **About A.R. Rahman** — short bio, tags, profile image, awards
- **Performances & Concerts** — add concerts manually with YouTube URLs

### 4. Run the Next.js app

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## Data Flow

```
Home page (ISR: 1hr)
  ├── Sanity → welcomeHeading, about bio, tags
  ├── MusicBrainz API → release groups (albums)
  └── Spotify API → cover art + streaming URLs per album

Album detail page (ISR: 24hr)
  ├── MusicBrainz → full track listing
  └── Spotify → per-track streaming URLs

Performances page (ISR: 1hr)
  └── Sanity → performance documents (manually curated)

News page (ISR: 15min)
  └── GNews API → "AR Rahman" search results
```

---

## Deployment to Vercel

```bash
npm install -g vercel
vercel
```

Add all environment variables in the Vercel dashboard under **Settings → Environment Variables**.

### Recommended ISR cache times (already set in code)
| Page | `revalidate` | Reason |
|------|-------------|--------|
| Home | `3600` (1hr) | Albums + CMS content |
| Album detail | `86400` (24hr) | Track lists rarely change |
| Performances | `3600` (1hr) | Sanity webhook can force revalidate |
| News | `900` (15min) | Fresh news matters |

### On-demand revalidation (optional)
Add a Sanity webhook to trigger `POST /api/revalidate?secret=xxx&tag=performances` when a performance document is published. See [Next.js on-demand revalidation docs](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration#on-demand-revalidation-with-revalidatetag).

---

## Extending the Site

### Adding a new page (e.g. Awards)
1. Create `app/awards/page.tsx`
2. Add a Sanity schema at `sanity/schemas/award.ts` if needed
3. Add the nav link to `components/layout/Navbar.tsx`

### Adding more languages to the album filter
Edit `ALBUM_LANGUAGES` in `lib/utils.ts`.

### Customising the design tokens
All colour/spacing tokens are in `app/globals.css` (CSS variables) and `tailwind.config.ts`.

### Todo
1. Load all the data into sanity from here that is pertaining to ARR 
  https://data.metabrainz.org/pub/musicbrainz/data/fullexport/20260401-002235/
  https://data.metabrainz.org/pub/musicbrainz/data/json-dumps/20260401-001001/

---

## License
Fan site — not affiliated with A.R. Rahman or his management. Music data © MusicBrainz contributors (CC0). News © respective publishers.
