const loginForm = document.getElementById('login-form')
const serverUrl = "http://localhost:1010"

fetch(`${serverUrl}/api/ping`, {method: "POST"}).then(res => console.log(res.body))

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault()
  const form = e.target;
  const payload = {
    username: form.username.value,
    password: form.password.value
  }

  const url = `${serverUrl}/api/login`
  console.log(JSON.stringify(payload))
  const res = await fetch(url, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  })
  
  if (res.ok) {
    window.location.href = '/frontend/editor.html'
  } else {
    const text = await res.text()
    alert(`Login failed: ${text}`)
  }
})