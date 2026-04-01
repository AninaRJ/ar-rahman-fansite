import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImage } from '@/types'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
})

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImage) {
  return builder.image(source)
}

// ── Queries ────────────────────────────────────────────────────────────────

export const HOME_PAGE_QUERY = `*[_type == "homePage"][0] {
  _id,
  welcomeHeading,
  welcomeSubheading,
  welcomeBody
}`

export const ABOUT_QUERY = `*[_type == "about"][0] {
  _id,
  bio,
  shortBio,
  profileImage,
  awards[] {
    title,
    year,
    category
  },
  tags,
  socialLinks[] {
    platform,
    url
  }
}`

export const PERFORMANCES_QUERY = `*[_type == "performance"] | order(date desc) {
  _id,
  title,
  date,
  venue,
  city,
  country,
  type,
  youtubeUrl,
  description,
  setlist
}`
