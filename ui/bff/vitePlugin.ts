import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Connect, Plugin } from 'vite'
import { bffApp } from './app.ts'

function readRequestBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer | string) => {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

function createBffConnectMiddleware(): Connect.NextHandleFunction {
  return async (
    req: IncomingMessage,
    res: ServerResponse,
    next: Connect.NextFunction,
  ) => {
    if (!req.url || !req.url.startsWith('/bff')) {
      next()
      return
    }

    try {
      const host = req.headers.host ?? 'localhost:5173'
      const url = `http://${host}${req.url}`
      const method = (req.method ?? 'GET').toUpperCase()

      const headers = new Headers()
      for (const [key, value] of Object.entries(req.headers)) {
        if (Array.isArray(value)) {
          for (const item of value) headers.append(key, item)
        } else if (typeof value === 'string') {
          headers.set(key, value)
        }
      }

      const hasBody = method !== 'GET' && method !== 'HEAD'
      const bodyBuffer = hasBody ? await readRequestBody(req) : undefined

      const webRequest = new Request(url, {
        method,
        headers,
        body:
          bodyBuffer && bodyBuffer.length > 0
            ? new Uint8Array(bodyBuffer)
            : undefined,
      })

      const webResponse = await bffApp.fetch(webRequest)

      res.statusCode = webResponse.status
      webResponse.headers.forEach((value, key) => {
        if (key.toLowerCase() === 'set-cookie') {
          const cookies = webResponse.headers.getSetCookie()
          res.setHeader('Set-Cookie', cookies)
        } else {
          res.setHeader(key, value)
        }
      })

      const arrayBuffer = await webResponse.arrayBuffer()
      res.end(Buffer.from(arrayBuffer))
    } catch {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Error interno en el BFF' }))
    }
  }
}

export function tonoPersianasBffPlugin(): Plugin {
  const middleware = createBffConnectMiddleware()
  return {
    name: 'tono-persianas-hono-bff',
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}
