import { Hono } from 'hono'
import { bffSecurityMiddleware, type BffVariables } from './security.ts'
import { forwardToUpstream } from './upstream.ts'

export const bffApp = new Hono<{ Variables: BffVariables }>().basePath('/bff')

// Apply HttpOnly session cookie verification, CSRF guard, and header scrubbing
bffApp.use('*', bffSecurityMiddleware)

// BFF Session Verification Endpoint
bffApp.get('/session', (c) => {
  return c.json({
    status: 'ok',
    authenticated: true,
  })
})

// Catalog Categories via BFF
bffApp.get('/catalog/categories', async (c) => {
  return forwardToUpstream(c, '/api/categories')
})

// Catalog Products via BFF
bffApp.get('/catalog/products', async (c) => {
  const category = c.req.query('category')
  const query = category ? `?category=${encodeURIComponent(category)}` : ''
  return forwardToUpstream(c, `/api/products${query}`)
})

// Single Product by Slug via BFF
bffApp.get('/catalog/products/:slug', async (c) => {
  const slug = encodeURIComponent(c.req.param('slug'))
  return forwardToUpstream(c, `/api/products/${slug}`)
})

// Business Contact Info Read via BFF
bffApp.get('/contact-info', async (c) => {
  return forwardToUpstream(c, '/api/contact-info')
})

// Business Contact Info Update via BFF
bffApp.put('/contact-info', async (c) => {
  const rawBody = await c.req.text()
  return forwardToUpstream(c, '/api/contact-info', {
    method: 'PUT',
    body: rawBody,
  })
})
