import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { bffApp } from './app.ts'
import { bffConfig } from './config.ts'

/**
 * Production entry: serves the built UI (dist/) and the Hono BFF from a
 * single Node process, without Vite. Run from the `ui/` directory.
 */
const distDir = path.resolve(process.cwd(), 'dist')
const indexHtmlPath = path.join(distDir, 'index.html')

const app = new Hono()

app.route('/', bffApp)
app.use('/*', serveStatic({ root: './dist' }))

// SPA fallback: any non-/bff route returns index.html
app.get('*', async (c) => {
  if (c.req.path.startsWith('/bff')) return c.notFound()
  const html = await readFile(indexHtmlPath, 'utf-8')
  return c.html(html)
})

serve({ fetch: app.fetch, port: bffConfig.bffPort, hostname: '0.0.0.0' }, (info) => {
  console.log(`BFF + UI listening on http://0.0.0.0:${info.port}`)
})
