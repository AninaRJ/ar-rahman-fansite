import { NextResponse } from 'next/server'
import { fetchARRahmanWikipediaSummary } from '@/lib/wikipedia'

export async function GET() {
  const summary = await fetchARRahmanWikipediaSummary()

  if (!summary) {
    return NextResponse.json({ error: 'Wikipedia fetch failed' }, { status: 502 })
  }

  return NextResponse.json(summary)
}
