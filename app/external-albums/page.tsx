import Link from 'next/link'

type AlbumTrack = {
  title: string
  duration: string | null
  trackNumber: number
}

type ExternalAlbum = {
  id: string
  title: string
  year: number
  primaryType?: string
  releaseCount: number
  mbid: string
  songs?: AlbumTrack[]
}

async function fetchAlbums(includeTracks = false) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://127.0.0.1:3000'
  const params = new URLSearchParams({
    includeTracks: includeTracks ? 'true' : 'false',
    limit: '24',
  })

  const res = await fetch(`${baseUrl}/api/albums?${params.toString()}`, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    throw new Error(`Albums API returned ${res.status}`)
  }

  const data = (await res.json()) as ExternalAlbum[]
  return data
}

export default async function ExternalAlbumsPage() {
  let albums: ExternalAlbum[] = []
  try {
    albums = await fetchAlbums(true)
  } catch (error) {
    console.error('[External Albums] fetch error', error)
  }

  return (
    <div className="px-8 md:px-16 py-12 text-text">
      <Link href="/" className="underline hover:text-accent-light">
        ← Back to home
      </Link>

      <h1 className="text-4xl font-bold mt-6 mb-4">External API: Album list</h1>

      {albums.length === 0 ? (
        <p className="text-muted">Could not load albums from external API at this time.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {albums.map((album) => (
            <article
              key={album.id}
              className="p-4 rounded-xl border border-neon-subtle bg-[rgba(10,20,45,0.75)]"
            >
              <h2 className="font-semibold text-lg">{album.title}</h2>
              <p className="text-sm text-muted">
                {album.year} · {album.primaryType ?? 'Album'} · {album.releaseCount} version(s)
              </p>
              <p className="text-xs text-muted mt-2">MBID: {album.mbid}</p>

              {album.songs && album.songs.length > 0 ? (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold mb-1">Tracks</h3>
                  <ol className="list-decimal list-inside text-xs text-muted space-y-1">
                    {album.songs.map((song) => (
                      <li key={`${album.id}-${song.trackNumber}`}>
                        {song.trackNumber}. {song.title}
                        {song.duration ? ` (${song.duration})` : ''}
                      </li>
                    ))}
                  </ol>
                </div>
              ) : (
                <p className="text-xs text-muted mt-3">Track details not available.</p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
