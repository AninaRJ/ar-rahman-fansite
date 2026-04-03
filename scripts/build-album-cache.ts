// scripts/build-album-cache.ts
// Build-time script to fetch and cache album summaries for fast runtime access

import { fetchARRahmanReleaseGroupSummaries } from '../lib/musicbrainz'
import fs from 'fs'
import path from 'path'

async function main() {
  const limit = 200; // Fetch up to 200 albums (adjust as needed)
  const albums = await fetchARRahmanReleaseGroupSummaries(limit, 0);
  const cacheDir = path.join(process.cwd(), '.next', 'cache');
  const cacheFile = path.join(cacheDir, 'albums.json');

  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  fs.writeFileSync(cacheFile, JSON.stringify(albums, null, 2), 'utf-8');
  console.log(`Cached ${albums.length} albums to ${cacheFile}`);
}

main().catch((err) => {
  console.error('Failed to build album cache:', err);
  process.exit(1);
});
