import Image from 'next/image'
import Link from 'next/link'
import { fetchARRahmanWikipediaSummary } from '@/lib/wikipedia'

export const revalidate = 3600

async function fetchWikiSummary() {
  return await fetchARRahmanWikipediaSummary()
}

export default async function External() {
  const data = await fetchWikiSummary()

  if (!data) {
    return (
      <div className="px-8 md:px-16 py-12 text-text">
        <Link href="/" className="underline hover:text-accent-light">← Back to home</Link>
        <h1 className="text-4xl font-bold mt-6 mb-4">External API: Wikipedia summary</h1>
        <p className="mt-4 text-muted">Could not fetch data from Wikipedia at the moment. Please try again shortly.</p>
      </div>
    )
  }


  return (
    <div className="px-8 md:px-16 py-12 text-text">
      <Link href="/" className="underline hover:text-accent-light">← Back to home</Link>
      <h1 className="text-4xl font-bold mt-6 mb-4">External API: Wikipedia summary</h1>

      <div className="rounded-2xl p-6 border border-neon-subtle bg-[rgba(20,40,80,0.45)] shadow-[0_0_32px_rgba(98,232,255,0.18)]">
        <h2 className="text-2xl font-semibold mb-2">{data.title}</h2>
        <p className="text-sm text-muted mb-4">{data.description}</p>
        <p className="leading-relaxed mb-5">{data.extract}</p>

        {data.thumbnail && (
          <div className="relative w-48 h-48 mb-4 rounded overflow-hidden">
            <Image
              src={data.thumbnail}
              alt={`${data.title} thumbnail`}
              fill
              className="object-cover"
              sizes="192px"
            />
          </div>
        )}

        <a
          href={data.articleUrl || ''}
          target="_blank"
          rel="noreferrer"
          className="inline-block px-3 py-2 rounded-lg border border-accent text-accent hover:bg-accent hover:text-black transition"
        >
          Open Wikipedia Article
        </a>
      </div>
    </div>
  )
}
