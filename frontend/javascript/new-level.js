const levelName = document.getElementById("level-name")
const visibilityElement = document.getElementById("visibility")
const descriptionElement = document.getElementById("description")
const updateButton = document.getElementById("update")

const backToLevel = document.getElementById("back-to-level")

const serverUrl = window.location.origin


async function getMe() {
  const raw = await fetch(`${serverUrl}/api/me`, {
    credentials: "include",
  })
  const response = await raw.json()
  const user = response.user
  return user
}

async function uploadLevel() {
  const payload = {
    name: levelName.value,
    public: visibilityElement.value == "public" ? true : false,
    description: descriptionElement.value,
    data: {}
  }
  console.log(payload)
  return await fetch(`${serverUrl}/api/upload`, {
    method: "POST",
    body: JSON.stringify(payload),
    credentials: "include"
  })
}

updateButton.addEventListener("click", () => {
  uploadLevel().then(level => {
    console.log(level)
    window.location.href = `/level/${level.id}`
  })
})