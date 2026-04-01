import Link from 'next/link'
import { fetchARRahmanReleaseGroups } from '@/lib/musicbrainz'

type ExternalAlbum = {
  id: string
  title: string
  year: number
  primaryType?: string
  releaseCount: number
  mbid: string
}

async function fetchAlbums() {
  const groups = await fetchARRahmanReleaseGroups(50, 0)
  return groups.map((group) => ({
    id: group.id,
    title: group.title,
    year: Number(group['first-release-date']?.slice(0, 4) ?? 0),
    primaryType: group['primary-type'],
    releaseCount: group.releases?.length ?? 0,
    mbid: group.id,
  }))
}

export default async function ExternalAlbumsPage() {
  let albums: ExternalAlbum[] = []
  try {
    albums = await fetchAlbums()
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
          {albums.slice(0, 24).map((album) => (
            <article
              key={album.id}
              className="p-4 rounded-xl border border-neon-subtle bg-[rgba(10,20,45,0.75)]"
            >
              <h2 className="font-semibold text-lg">{album.title}</h2>
              <p className="text-sm text-muted">
                {album.year} · {album.primaryType ?? 'Album'} · {album.releaseCount} version(s)
              </p>
              <p className="text-xs text-muted mt-2">MBID: {album.mbid}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
