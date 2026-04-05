// This is a Client Component wrapper for AlbumGridWithSearch
"use client"
import AlbumGridWithSearch from './AlbumGridWithSearch'
import type { Album } from '@/types'

export default function AlbumGridWithSearchWrapper({ albums }: { albums: Album[] }) {
  return <AlbumGridWithSearch albums={albums} />
}