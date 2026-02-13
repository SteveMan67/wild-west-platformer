import { loadMapFromData } from './file-utils.js'
import { init } from '/javascript/site.js'

const serverUrl = `${window.location.origin}`

// fetch the level if there is a level in the 

async function getLevel(level) {
  try {
    console.log(`${serverUrl}/api/level?levelId=${level}`)
    const raw = await fetch(`${serverUrl}/api/level?levelId=${level}`)
    const levels = raw.json()
    window.dispatchEvent(new CustomEvent('level:loaded', { detail: levels }))
    return await levels
  } catch {
  }
}

let levelNum

try {
  levelNum = Number(window.location.href.match(/\/editor\/(\d+)(?:[\/?#]|$)/)[1])
} catch {
  levelNum = 1
}

getLevel(levelNum).then(level => {
  console.log(level)
  if (level && levelNum && level.error == null) {
    const levelData = level.data
    loadMapFromData(levelData)
  } else if (level && level.error) {
    console.log(level.error)
  }
  init()
})
