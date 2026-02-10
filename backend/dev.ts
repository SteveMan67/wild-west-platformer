async function awaitPassword() {
  const ok = await Bun.password.verify("e24e5919-eed8-419a-9375-e20257b1ea25", "$argon2id$v=19$m=65536,t=2,p=1$S4tX3KEegnURJlmklFS3GM9LvEhNi/iCP3cVaGnKTA8$hb0zYJkw3aw98tN9Ogpbniyi9VSnKJa53whQjzEmCN0")
  console.log(ok)
}

awaitPassword()