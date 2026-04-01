import type { WikipediaSummary } from '@/types'

const WIKI_SUMMARY_URL = 'https://en.wikipedia.org/api/rest_v1/page/summary/A._R._Rahman'

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  attempts = 3,
  delayMs = 700
): Promise<Response> {
  let lastError: unknown

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const res = await fetch(url, options)
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      return res
    } catch (error) {
      lastError = error
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, delayMs))
      }
    }
  }

  throw lastError
}

export async function fetchARRahmanWikipediaSummary(): Promise<WikipediaSummary | null> {
  try {
    const res = await fetchWithRetry(WIKI_SUMMARY_URL, { next: { revalidate: 3600 }, headers: { 'User-Agent': 'ar-rahman-fansite/1.0' } })
    const data = await res.json()

    return {
      title: data.title || 'A.R. Rahman',
      description: data.description ?? 'A.R. Rahman is a legendary Indian composer.',
      extract: data.extract ?? 'Summary currently unavailable, please try again later.',
      thumbnail: data.thumbnail?.source ?? null,
      articleUrl:
        data.content_urls?.desktop?.page ?? data.content_urls?.mobile?.page ?? 'https://en.wikipedia.org/wiki/A._R._Rahman',
    }
  } catch (error) {
    console.error('[Wikipedia API] fetch error', error)
    return {
      title: 'A.R. Rahman',
      description: 'Unable to load summary at this time',
      extract: 'Could not fetch Wikipedia summary. Please check back in a few minutes.',
      thumbnail: null,
      articleUrl: 'https://en.wikipedia.org/wiki/A._R._Rahman',
    }
  }
}
