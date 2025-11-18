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
