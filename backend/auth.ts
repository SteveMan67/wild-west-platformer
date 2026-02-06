import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:4321/postgres"
const sql = postgres(DATABASE_URL)

export type SessionCookie = { sessionId: string; token: string }

export async function authenticate(session_cookie: SessionCookie) {
  const sessions = await sql`SELECT id, token_hash, expires_at, user_id from sessions WHERE id = ${session_cookie.sessionId} AND expires_at > NOW()`
  if (!sessions.length) return false
  const row = sessions[0]
  const ok = await Bun.password.verify(session_cookie.token, row.token_hash)
  return ok
}