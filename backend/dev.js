const token = "2cce20fd-b7fe-4c8f-a570-d5c99a3a4727"
const hash = Bun.password.hash(token)
const ok = Bun.password.verify(token, hash)