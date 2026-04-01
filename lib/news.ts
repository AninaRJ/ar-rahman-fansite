import type { NewsArticle, GNewsResponse } from '@/types'

const GNEWS_BASE = 'https://gnews.io/api/v4'

export async function fetchARRahmanNews(
  max = 10
): Promise<NewsArticle[]> {
  const apiKey = process.env.GNEWS_API_KEY
  if (!apiKey) {
    console.warn('GNEWS_API_KEY not set — returning empty news')
    return []
  }

  const url = new URL(`${GNEWS_BASE}/search`)
  url.searchParams.set('q', '"AR Rahman" OR "A.R. Rahman" OR "A R Rahman"')
  url.searchParams.set('lang', 'en')
  url.searchParams.set('max', String(max))
  url.searchParams.set('sortby', 'publishedAt')
  url.searchParams.set('apikey', apiKey)

  const res = await fetch(url.toString(), {
    next: { revalidate: 900 }, // 15 minutes
  })

  if (!res.ok) {
    console.error(`GNews error: ${res.status}`)
    return []
  }

  const data: GNewsResponse = await res.json()

  return data.articles.map((a) => ({
    title: a.title,
    description: a.description,
    content: a.content,
    url: a.url,
    source: a.source,
    publishedAt: a.publishedAt,
    image: a.image,
  }))
}

/** Format a publishedAt ISO string → "Mar 28, 2026" */
export function formatNewsDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Determine a tag category from article content */
export function categoriseArticle(article: NewsArticle): string {
  const text = `${article.title} ${article.description ?? ''}`.toLowerCase()
  if (text.includes('award') || text.includes('oscar') || text.includes('grammy')) return 'award'
  if (text.includes('concert') || text.includes('tour') || text.includes('performance') || text.includes('live')) return 'live'
  if (text.includes('film') || text.includes('movie') || text.includes('score') || text.includes('soundtrack')) return 'film'
  return 'music'
}
