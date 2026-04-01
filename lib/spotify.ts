import type { Album, SpotifyAlbum, SpotifyTrack } from '@/types'

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'

/** Fetch a short-lived client credentials token */
async function getSpotifyToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64')

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    next: { revalidate: 3500 }, // Token is valid 1hr — revalidate just before
  })

  if (!res.ok) throw new Error(`Spotify token error: ${res.status}`)
  const data = await res.json()
  return data.access_token as string
}

/** Search for an album on Spotify by title + artist */
export async function searchSpotifyAlbum(
  title: string,
  token: string
): Promise<SpotifyAlbum | null> {
  const q = encodeURIComponent(`album:"${title}" artist:"AR Rahman"`)
  const url = `${SPOTIFY_API_BASE}/search?q=${q}&type=album&limit=1&market=IN`

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 86400 },
  })

  if (!res.ok) return null
  const data = await res.json()

  const albumResult = data.albums?.items?.[0]
  if (!albumResult) return null

  // Fetch full album with tracks
  const fullRes = await fetch(
    `${SPOTIFY_API_BASE}/albums/${albumResult.id}?market=IN`,
    {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 86400 },
    }
  )

  if (!fullRes.ok) return null
  return fullRes.json()
}

/**
 * Enrich an array of albums with Spotify data:
 * - Cover art (high-quality)
 * - Spotify track URLs matched by title similarity
 */
export async function enrichAlbumsWithSpotify(
  albums: Album[]
): Promise<Album[]> {
  let token: string
  try {
    token = await getSpotifyToken()
  } catch {
    console.warn('Spotify token fetch failed — skipping enrichment')
    return albums
  }

  return Promise.all(
    albums.map(async (album) => {
      const spotifyAlbum = await searchSpotifyAlbum(album.title, token)
      if (!spotifyAlbum) return album

      // Use Spotify cover if MusicBrainz didn't have one
      const coverArt =
        album.coverArt ?? spotifyAlbum.images[0]?.url ?? null

      // Match tracks by normalized title
      const spotifyTracks: SpotifyTrack[] = spotifyAlbum.tracks.items

      const enrichedSongs = album.songs.map((song) => {
        const match = spotifyTracks.find(
          (st) =>
            normalize(st.name) === normalize(song.title) ||
            normalize(st.name).includes(normalize(song.title)) ||
            normalize(song.title).includes(normalize(st.name))
        )

        return {
          ...song,
          streaming: {
            ...song.streaming,
            spotify: match?.external_urls.spotify ?? buildSpotifySearchUrl(song.title),
          },
        }
      })

      return { ...album, coverArt, songs: enrichedSongs }
    })
  )
}

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function buildSpotifySearchUrl(track: string) {
  const q = encodeURIComponent(`${track} AR Rahman`)
  return `https://open.spotify.com/search/${q}`
}
