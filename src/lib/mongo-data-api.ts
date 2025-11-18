// Lightweight MongoDB Atlas Data API client for Cloudflare Workers
// Requires the following environment variables in production:
// - MONGODB_DATA_API_URL (e.g. https://data.mongodb-api.com/app/<APP-ID>/endpoint/data/v1)
// - MONGODB_DATA_API_KEY
// - MONGODB_DATA_SOURCE (Cluster name)
// - MONGODB_DB (database name)

export type FindOptions = {
  filter?: Record<string, unknown>
  projection?: Record<string, unknown>
  sort?: Record<string, 1 | -1>
  limit?: number
}

function requiredEnv(name: string) {
  const val = process.env[name]
  if (!val) throw new Error(`Missing required env: ${name}`)
  return val
}

export async function dataApiFind<T = any>(collection: string, opts: FindOptions = {}) {
  const url = requiredEnv("MONGODB_DATA_API_URL").replace(/\/$/, "") + "/action/find"
  const apiKey = requiredEnv("MONGODB_DATA_API_KEY")
  const dataSource = requiredEnv("MONGODB_DATA_SOURCE")
  const database = process.env.MONGODB_DB || "hafrincoffee"

  const body = {
    dataSource,
    database,
    collection,
    filter: opts.filter || {},
    projection: opts.projection,
    sort: opts.sort,
    limit: opts.limit,
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
      "Accept": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Data API find failed: ${res.status} ${res.statusText} - ${text.slice(0, 300)}`)
  }

  const json = await res.json() as { documents?: T[] }
  return json.documents || []
}

export type FindOneOptions = {
  filter: Record<string, unknown>
  projection?: Record<string, unknown>
}

export async function dataApiFindOne<T = any>(collection: string, opts: FindOneOptions) {
  const url = requiredEnv("MONGODB_DATA_API_URL").replace(/\/$/, "") + "/action/findOne"
  const apiKey = requiredEnv("MONGODB_DATA_API_KEY")
  const dataSource = requiredEnv("MONGODB_DATA_SOURCE")
  const database = process.env.MONGODB_DB || "hafrincoffee"

  const body = {
    dataSource,
    database,
    collection,
    filter: opts.filter || {},
    projection: opts.projection,
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000) // 5s timeout - faster fail

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
        "Accept": "application/json",
        "Connection": "keep-alive", // Reuse connections
      },
      body: JSON.stringify(body),
      signal: controller.signal,
      // @ts-ignore - some runtimes support this
      keepalive: true,
    })

    clearTimeout(timeoutId)

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Data API findOne failed: ${res.status} ${res.statusText} - ${text.slice(0, 300)}`)
    }

    const json = await res.json() as { document?: T }
    return json.document
  } catch (err) {
    clearTimeout(timeoutId)
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Data API findOne timed out after 5s')
    }
    throw err
  }
}

export type UpdateOneOptions = {
  filter: Record<string, unknown>
  update: Record<string, unknown>
}

export async function dataApiUpdateOne(collection: string, opts: UpdateOneOptions) {
  const url = requiredEnv("MONGODB_DATA_API_URL").replace(/\/$/, "") + "/action/updateOne"
  const apiKey = requiredEnv("MONGODB_DATA_API_KEY")
  const dataSource = requiredEnv("MONGODB_DATA_SOURCE")
  const database = process.env.MONGODB_DB || "hafrincoffee"

  const body = {
    dataSource,
    database,
    collection,
    filter: opts.filter,
    update: opts.update,
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000)

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
        "Accept": "application/json",
        "Connection": "keep-alive",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
      // @ts-ignore
      keepalive: true,
    })

    clearTimeout(timeoutId)

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Data API updateOne failed: ${res.status} ${res.statusText} - ${text.slice(0, 300)}`)
    }

    const json = await res.json() as { matchedCount?: number; modifiedCount?: number }
    return json
  } catch (err) {
    clearTimeout(timeoutId)
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Data API updateOne timed out after 5s')
    }
    throw err
  }
}

export type InsertOneOptions = {
  document: Record<string, unknown>
}

export async function dataApiInsertOne(collection: string, opts: InsertOneOptions) {
  const url = requiredEnv("MONGODB_DATA_API_URL").replace(/\/$/, "") + "/action/insertOne"
  const apiKey = requiredEnv("MONGODB_DATA_API_KEY")
  const dataSource = requiredEnv("MONGODB_DATA_SOURCE")
  const database = process.env.MONGODB_DB || "hafrincoffee"

  const body = {
    dataSource,
    database,
    collection,
    document: opts.document,
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000)

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
        "Accept": "application/json",
        "Connection": "keep-alive",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
      // @ts-ignore
      keepalive: true,
    })

    clearTimeout(timeoutId)

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Data API insertOne failed: ${res.status} ${res.statusText} - ${text.slice(0, 300)}`)
    }

    const json = await res.json() as { insertedId?: string }
    return json
  } catch (err) {
    clearTimeout(timeoutId)
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Data API insertOne timed out after 5s')
    }
    throw err
  }
}

export type DeleteOneOptions = {
  filter: Record<string, unknown>
}

export async function dataApiDeleteOne(collection: string, opts: DeleteOneOptions) {
  const url = requiredEnv("MONGODB_DATA_API_URL").replace(/\/$/, "") + "/action/deleteOne"
  const apiKey = requiredEnv("MONGODB_DATA_API_KEY")
  const dataSource = requiredEnv("MONGODB_DATA_SOURCE")
  const database = process.env.MONGODB_DB || "hafrincoffee"

  const body = {
    dataSource,
    database,
    collection,
    filter: opts.filter,
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000)

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
        "Accept": "application/json",
        "Connection": "keep-alive",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
      // @ts-ignore
      keepalive: true,
    })

    clearTimeout(timeoutId)

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Data API deleteOne failed: ${res.status} ${res.statusText} - ${text.slice(0, 300)}`)
    }

    const json = await res.json() as { deletedCount?: number }
    return json
  } catch (err) {
    clearTimeout(timeoutId)
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Data API deleteOne timed out after 5s')
    }
    throw err
  }
}

// Helper for Extended JSON ObjectId
export function toObjectId(id: string) {
  return { $oid: id }
}

// Helper to extract ObjectId string from Extended JSON
export function fromObjectId(oid: any): string {
  if (typeof oid === 'string') return oid
  if (oid && typeof oid === 'object' && oid.$oid) return oid.$oid
  return String(oid)
}
