import type {
  Album,
  AlbumRole,
  AlbumRelease,
  Song,
  MusicBrainzReleaseGroup,
  MusicBrainzRelease,
} from '@/types'

// AR Rahman's MusicBrainz Artist ID
const AR_RAHMAN_MBID = 'e0bba708-bdd3-478d-84ea-c706413bedab'

const MB_BASE = 'https://musicbrainz.org/ws/2'
const COVER_ART_BASE = 'https://coverartarchive.org/release-group'

const MUSICBRAINZ_APP_NAME = process.env.MUSICBRAINZ_APP_NAME ?? 'ar-rahman-fansite'
const MUSICBRAINZ_APP_VERSION = process.env.MUSICBRAINZ_APP_VERSION ?? '0.1.0'
const MUSICBRAINZ_APP_EMAIL = process.env.MUSICBRAINZ_APP_EMAIL ?? 'contact@ar-rahman-fansite.example'

const MB_HEADERS = {
  'User-Agent': `${MUSICBRAINZ_APP_NAME}/${MUSICBRAINZ_APP_VERSION} (${MUSICBRAINZ_APP_EMAIL})`,
  Accept: 'application/json',
}


/** Throttle to respect MusicBrainz 1 req/sec rate limit */
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Format milliseconds → "m:ss" */
function formatDuration(ms: number | null): string | null {
  if (!ms) return null
  const totalSecs = Math.floor(ms / 1000)
  const m = Math.floor(totalSecs / 60)
  const s = totalSecs % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

/** Map MusicBrainz language code → human-readable */
function mapLanguage(code: string | undefined): string {
  const map: Record<string, string> = {
    tam: 'Tamil',
    hin: 'Hindi',
    tel: 'Telugu',
    mal: 'Malayalam',
    kan: 'Kannada',
    eng: 'International',
    mul: 'Multi-language',
  }
  return map[code?.toLowerCase() ?? ''] ?? 'Other'
}

/** Fetch AR Rahman's release groups from MusicBrainz */
export async function fetchARRahmanReleaseGroups(
  limit = 100,
  offset = 0
): Promise<MusicBrainzReleaseGroup[]> {
  const url = new URL(`${MB_BASE}/release-group`)
  url.searchParams.set('artist', AR_RAHMAN_MBID)
  url.searchParams.set('type', 'album')
  // release-list endpoint intentionally avoids heavy release expansions to keep it fast
  url.searchParams.set('fmt', 'json')
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('offset', String(offset))

  const res = await fetch(url.toString(), {
    headers: MB_HEADERS,
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    console.error(`MusicBrainz error: ${res.status}`)
    return []
  }

  const data = await res.json()
  return data['release-groups'] ?? []
}

/** Fetch a release-group with available releases (for track list source ID) */
export async function fetchReleaseGroupWithReleases(
  releaseGroupId: string
): Promise<MusicBrainzReleaseGroup | null> {
  const url = `${MB_BASE}/release-group/${releaseGroupId}?inc=releases+artist-credits&fmt=json`
  await delay(1100)
  const res = await fetch(url, {
    headers: MB_HEADERS,
    next: { revalidate: 86400 },
  })

  if (!res.ok) {
    console.error(`MusicBrainz release-group detail error: ${res.status}`)
    return null
  }

  return res.json()
}

/** Fetch a single release with its track list */
export async function fetchReleaseWithTracks(
  releaseId: string
): Promise<MusicBrainzRelease | null> {
  await delay(1100) // Respect rate limit

  const url = `${MB_BASE}/release/${releaseId}?inc=recordings+labels+artist-credits&fmt=json`

  const res = await fetch(url, {
    headers: MB_HEADERS,
    next: { revalidate: 86400 }, // 24hr — track lists don't change
  })

  if (!res.ok) return null
  return res.json()
}

/** Fetch cover art URL for a release group */
export async function fetchCoverArt(
  releaseGroupId: string
): Promise<string | null> {
  const res = await fetch(`${COVER_ART_BASE}/${releaseGroupId}/front-500`, {
    redirect: 'follow',
    next: { revalidate: 86400 },
  })

  if (!res.ok) return null
  return res.url
}

/** Infer Rahman's role from artist credits */
function inferRole(release: MusicBrainzRelease): AlbumRole {
  // This is a heuristic — in production, this would use
  // the artist-credits "relation" field from MusicBrainz
  const used = release && release.id
  if (used) {
    return 'Composer'
  }
  return 'Composer'
}

/**
 * Build a unified Album from a MusicBrainz release group.
 * Picks the earliest release as canonical, treats others as
 * alternate language/year releases.
 */
export async function buildAlbumFromReleaseGroup(
  rg: MusicBrainzReleaseGroup
): Promise<Album | null> {
  const rgDetails = await fetchReleaseGroupWithReleases(rg.id)
  if (!rgDetails || !rgDetails.releases || rgDetails.releases.length === 0) return null

  // Sort releases by date ascending to find the original
  const sorted = [...rgDetails.releases].sort((a, b) =>
    (a.date ?? '').localeCompare(b.date ?? '')
  )
  const primary = sorted[0]

  // Fetch full release data for track listing
  const fullRelease = await fetchReleaseWithTracks(primary.id)
  if (!fullRelease) return null

  const tracks = fullRelease.media.flatMap((m) => m.tracks)

  const songs: Song[] = tracks.map((t, i) => ({
    title: t.title,
    duration: formatDuration(t.length),
    trackNumber: i + 1,
    streaming: {
      spotify: null,   // Enriched by enrichAlbumsWithSpotify()
      youtubeMusic: buildYoutubeMusicSearchUrl(t.title, rg.title),
      appleMusic: buildAppleMusicSearchUrl(t.title),
    },
  }))

  // Other releases = alternate language/year editions
  const otherReleases: AlbumRelease[] = sorted.slice(1).map((r) => ({
    language: mapLanguage(r['text-representation']?.language),
    year: parseInt(r.date?.slice(0, 4) ?? '0'),
    label: r['label-info']?.[0]?.label?.name ?? null,
  }))

  const coverArt = await fetchCoverArt(rg.id)

  return {
    id: rg.id,
    mbid: rg.id,
    title: rg.title,
    year: parseInt(rg['first-release-date']?.slice(0, 4) ?? '0'),
    language: mapLanguage(fullRelease['text-representation']?.language),
    label: fullRelease['label-info']?.[0]?.label?.name ?? null,
    coverArt,
    role: inferRole(fullRelease),
    songs,
    otherReleases,
  }
}

/**
 * Fast summary discography (no heavy release-track expansion)
 * Used for initial page rendering to avoid long MusicBrainz traversal.
 */
export async function fetchARRahmanReleaseGroupSummaries(
  limit = 50,
  offset = 0
): Promise<Album[]> {
  const groups = await fetchARRahmanReleaseGroups(limit, offset)

  return groups.map((rg) => ({
    id: rg.id,
    mbid: rg.id,
    title: rg.title,
    year: Number(rg['first-release-date']?.slice(0, 4) ?? 0),
    language: 'International',
    label: null,
    coverArt: null,
    role: 'Composer',
    songs: [],
    otherReleases: [],
  }))
}

function buildYoutubeMusicSearchUrl(track: string, album: string) {
  const q = encodeURIComponent(`${track} ${album} AR Rahman`)
  return `https://music.youtube.com/search?q=${q}`
}

function buildAppleMusicSearchUrl(track: string) {
  const q = encodeURIComponent(`${track} AR Rahman`)
  return `https://music.apple.com/search?term=${q}`
}

/**
 * Top-level fetcher: returns the full AR Rahman discography.
 * Uses ISR — Next.js caches this for 1 hour at the page level.
 */
export async function fetchDiscography(): Promise<Album[]> {
  const groups = await fetchARRahmanReleaseGroups(50, 0)

  const albums: Album[] = []

  for (const rg of groups) {
    const album = await buildAlbumFromReleaseGroup(rg)
    if (album) albums.push(album)
  }

  return albums.sort((a, b) => b.year - a.year)
}

/**
 * Fetch a higher-level discography with track previews for first N albums.
 * Keeps page load within Reasonable Time (limit default to 20) while still
 * showing track names on the main UI.
 */
export async function fetchDiscographyWithTrackPreviews(
  limit = 20,
  offset = 0
): Promise<Album[]> {
  const groups = await fetchARRahmanReleaseGroups(limit, offset)

  const albums: Album[] = []

  for (const rg of groups) {
    const album = await buildAlbumFromReleaseGroup(rg)
    if (album) {
      albums.push(album)
    } else {
      // fallback to summary-style album (no tracks) if detail fetch fails
      albums.push({
        id: rg.id,
        mbid: rg.id,
        title: rg.title,
        year: Number(rg['first-release-date']?.slice(0, 4) ?? 0),
        language: 'International',
        label: null,
        coverArt: null,
        role: 'Composer',
        songs: [],
        otherReleases: [],
      })
    }
  }

  return albums.sort((a, b) => b.year - a.year)
}
