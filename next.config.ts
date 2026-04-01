import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.scdn.co' },            // Spotify cover art
      { protocol: 'https', hostname: 'cdn.sanity.io' },        // Sanity images
      { protocol: 'https', hostname: 'coverartarchive.org' },  // MusicBrainz cover art
      { protocol: 'https', hostname: '*.archive.org' },        // archive.org cover art mirror
      { protocol: 'https', hostname: 'upload.wikimedia.org' }, // Wikipedia thumbnails
      { protocol: 'https', hostname: 'th-i.thgim.com' }, // Wikipedia thumbnails
    ],
  },
}

export default nextConfig
