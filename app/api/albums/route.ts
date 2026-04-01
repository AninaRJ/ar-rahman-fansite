import { NextResponse } from 'next/server'
import { fetchARRahmanReleaseGroups } from '@/lib/musicbrainz'

export async function GET() {
  try {
    const groups = await fetchARRahmanReleaseGroups(50, 0)

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
