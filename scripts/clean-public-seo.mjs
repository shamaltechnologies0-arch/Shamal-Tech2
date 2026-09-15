import { rmSync } from 'node:fs'
import { resolve } from 'node:path'

/** next-sitemap used to write public/robots.txt with host-only sitemap URLs that overrode Next.js. */
const generated = ['public/robots.txt', 'public/sitemap.xml', 'public/sitemap-0.xml']

for (const file of generated) {
  rmSync(resolve(process.cwd(), file), { force: true })
}

console.log('Removed generated public SEO files so Next.js robots.ts and sitemap.xml route are used.')
