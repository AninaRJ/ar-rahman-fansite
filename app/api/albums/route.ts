import { NextResponse } from 'next/server'
import {
  fetchARRahmanReleaseGroups,
  buildAlbumFromReleaseGroup,
} from '@/lib/musicbrainz'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const includeTracks = url.searchParams.get('includeTracks') === 'true'
    const limit = Number(url.searchParams.get('limit') ?? '20')
    const offset = Number(url.searchParams.get('offset') ?? '0')

    const groups = await fetchARRahmanReleaseGroups(limit, offset)

    if (includeTracks) {
      const detailedAlbums = await Promise.all(
        groups.map(async (g) => {
          const album = await buildAlbumFromReleaseGroup(g)
          if (!album) {
            return {
              id: g.id,
              mbid: g.id,
              title: g.title,
              year: Number(g['first-release-date']?.slice(0, 4) ?? 0),
              primaryType: g['primary-type'],
              releaseCount: g.releases?.length ?? 0,
              songs: [],
            }
          }

          return {
            id: album.id,
            mbid: album.mbid,
            title: album.title,
            year: album.year,
            primaryType: g['primary-type'],
            releaseCount: album.otherReleases.length + 1,
            songs: album.songs,
          }
        })
      )

      return NextResponse.json(detailedAlbums)
    }

    const simplified = groups.map((g) => ({
      id: g.id,
      title: g.title,
      year: Number(g['first-release-date']?.slice(0, 4) ?? 0),
      primaryType: g['primary-type'],
      releaseCount: g.releases?.length ?? 0,
      mbid: g.id,
    }))

    return NextResponse.json(simplified)
  } catch (error) {
    console.error('[Albums API] fetch error', error)
    return NextResponse.json({ error: 'Could not load albums' }, { status: 500 })
  }
}
