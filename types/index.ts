// ─────────────────────────────────────────
// ALBUM & DISCOGRAPHY
// ─────────────────────────────────────────

export interface StreamingLinks {
  spotify: string | null
  youtubeMusic: string | null
  appleMusic: string | null
}

export interface Song {
  title: string
  duration: string | null   // e.g. "5:12"
  trackNumber: number
  streaming: StreamingLinks
}

export interface AlbumRelease {
  language: string
  year: number
  label: string | null
}

export interface Album {
  id: string                // MusicBrainz release-group MBID
  title: string
  year: number
  language: string
  label: string | null
  coverArt: string | null   // URL
  role: AlbumRole           // Rahman's role
  songs: Song[]
  otherReleases: AlbumRelease[]  // Same album in other languages/years
  mbid: string
}

export type AlbumRole = 'Composer' | 'Singer' | 'Composer & Singer' | 'Collaborator' | 'Producer'

export type AlbumLanguage = 'Tamil' | 'Hindi' | 'Telugu' | 'Malayalam' | 'Kannada' | 'International' | 'Other' | 'Multilanguage'

// ─────────────────────────────────────────
// PERFORMANCES
// ─────────────────────────────────────────

export interface Performance {
  _id: string
  title: string
  date: string              // ISO date string
  venue: string
  city: string
  country: string
  type: PerformanceType
  youtubeUrl: string | null
  description: string | null
  setlist: string[] | null
}

export type PerformanceType = 'Concert' | 'Award Show' | 'TV Performance' | 'Film Event' | 'Festival' | 'Special'

// ─────────────────────────────────────────
// NEWS
// ─────────────────────────────────────────

export interface NewsArticle {
  title: string
  description: string | null
  content: string | null
  url: string
  source: { name: string; url: string }
  publishedAt: string       // ISO date string
  image: string | null
}

// ─────────────────────────────────────────
// SANITY CMS CONTENT
// ─────────────────────────────────────────

export interface HomePageContent {
  _id: string
  welcomeHeading: string
  welcomeSubheading: string
  welcomeBody: string
}

export interface AboutContent {
  _id: string
  bio: string               // Portable Text / plain string
  shortBio: string
  profileImage: SanityImage | null
  awards: Award[]
  tags: string[]
  socialLinks: SocialLink[]
}

export interface Award {
  title: string
  year: number
  category: string
}

export interface SocialLink {
  platform: string
  url: string
}

export interface SanityImage {
  asset: { _ref: string; _type: 'reference' }
  alt?: string
}

// ─────────────────────────────────────────
// API RESPONSES
// ─────────────────────────────────────────

export interface MusicBrainzReleaseGroup {
  id: string
  title: string
  'primary-type': string
  'first-release-date': string,
  'text-representation': { language: string }
  releases: MusicBrainzRelease[]
}

export interface MusicBrainzRelease {
  id: string
  title: string
  date: string
  country: string | null
  'label-info': { label: { name: string } }[]
  media: MusicBrainzMedium[]
  'text-representation': { language: string }
}

export interface MusicBrainzMedium {
  tracks: MusicBrainzTrack[]
}

export interface MusicBrainzTrack {
  number: string
  title: string
  length: number | null   // milliseconds
}

export interface SpotifyAlbum {
  id: string
  name: string
  images: { url: string; width: number; height: number }[]
  external_urls: { spotify: string }
  tracks: {
    items: SpotifyTrack[]
  }
}

export interface SpotifyTrack {
  id: string
  name: string
  external_urls: { spotify: string }
  duration_ms: number
}

export interface GNewsResponse {
  totalArticles: number
  articles: GNewsArticle[]
}

export interface GNewsArticle {
  title: string
  description: string
  content: string
  url: string
  image: string | null
  publishedAt: string
  source: { name: string; url: string }
}

export interface WikipediaSummary {
  title: string
  description: string | null
  extract: string | null
  thumbnail: string | null
  articleUrl: string | null
}
