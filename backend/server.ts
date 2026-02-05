import postgres from "postgres"

const DATABASE_URL = process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:4321/postgres"
const sql = postgres(DATABASE_URL)


const server = Bun.serve({
  port: 1010,
  async fetch(req) {
    console.log(await crypto.randomUUID())
    const url = new URL(req.url)
    const pathname = url.pathname
    const cookies = (req as any).cookies

    if (pathname == "/api/login") {
      let username: string | null = null
      let password: string | null = null

      username = url.searchParams.get("username")
      password = url.searchParams.get("password")

      if (!username) {
        return new Response("No username provided", { status: 400})
      }
      if (!password) {
        return new Response("No password provided", { status: 400})
      }
      console.log(username, password)
      const rows = await sql`select id, password_hash from users where username = ${username} limit 1`
      const user = rows[0]
      if (!user) return new Response("Invalid credentials", {status: 401})

      const valid = await Bun.password.verify(password, user.password_hash)
      if (!valid) {
        return new Response("Invalid credentials", {status: 401})
      }

      // add cookie to sessions and set the cookie in the response header
      const uuid = crypto.randomUUID()
      const hashedCookie = await Bun.password.hash(uuid)
      cookies.set("user_id", uuid, {
        maxAge: 60 * 60 * 24 * 14, // two weeks
        httpOnly: true,
        secure: true, 
        path: "/"
      })

      const setSession = await sql`
      insert into sessions(token_hash, expires_at) 
      values (${hashedCookie}, ${60 * 60 * 24 * 14})
      `

      return new Response("Login successful")
    }

    if (pathname == "/api/ping") {
      return new Response("pong")
    }

    if (pathname == "/api/level") {
      const match = url.search.match(/levelId=(\d+)/)
      const levelId = match ? Number(match[1]) : undefined
      if (levelId) {
        const level = await sql`select data, name, width, height, owner, tags, image_url, approvals, disapprovals, approval_percentage, total_plays, finished_plays, description, level_style from levels where id = ${levelId} limit 1`
        if (!level || level.length === 0) {
          return new Response(JSON.stringify({ error: "Level not found"}), { status: 404, headers: {"Content-Type": "application/json"}})
        }
        return new Response(JSON.stringify(level), { headers: {"Content-Type": "application/json" } })
      } else {
        return new Response(JSON.stringify({ error: "Must specify a level id with the levelId parameter" }), { status: 404, headers: {"Content-Type": "application/json"}})
      }
    }

    if (pathname == "/api/browse") {
      const match = url.search.match(/page=(\d+)/)
      const page = match ? Number(match[1]) : 1
      if (page) {
        const levels = await sql`select id, name, created_at, width, height, owner, tags, image_url, approvals, disapprovals, approval_percentage, total_plays, finished_plays, description, level_style from levels limit 50 offset ${(page - 1) * 50}`
        return new Response(JSON.stringify(levels), { headers: {"Content-Type": "application/json" } })
      }
    }

    if (pathname == "/api/users") {
      const users = await sql`select * from users`
      return new Response(JSON.stringify(users), { headers: {"Content-Type": "application/json"}})
    }
    return new Response("Not Found", { status: 404})
  }
})

console.log(`listening on http://localhost:${server.port}`)