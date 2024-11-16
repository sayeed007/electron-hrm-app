const fs = require('fs')
const path = require('path')

const localesDir = './locales' // Path to your locales directory
const defaultLang = 'en' // Reference language for placeholders
const placeholderValue = (key) => `Missing translation for "${key}"`

// Load all translation files
const translations = {}
fs.readdirSync(localesDir).forEach((file) => {
  if (file.endsWith('.json')) {
    const lang = path.basename(file, '.json')
    translations[lang] = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf8'))
  }
})

// Get all unique keys from all translation files
const allKeys = new Set()
Object.values(translations).forEach((translation) => {
  const collectKeys = (obj, prefix = '') => {
    Object.keys(obj).forEach((key) => {
      const fullKey = prefix ? `${prefix}.${key}` : key
      allKeys.add(fullKey)
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        collectKeys(obj[key], fullKey)
      }
    })
  }
  collectKeys(translation)
})

// Fill missing keys
Object.entries(translations).forEach(([lang, translation]) => {
  if (lang === defaultLang) return // Skip the default language

  allKeys.forEach((key) => {
    const keyParts = key.split('.')
    let current = translation
    let defaultCurrent = translations[defaultLang]
    const pathToKey = []

    for (const part of keyParts) {
      pathToKey.push(part)
      if (current[part] === undefined) {
        current[part] =
          keyParts.length === pathToKey.length
            ? defaultCurrent?.[part] || placeholderValue(key)
            : {}
      }
      current = current[part]
      defaultCurrent = defaultCurrent?.[part]
    }
  })
})

// Save updated translations
Object.entries(translations).forEach(([lang, translation]) => {
  const filePath = path.join(localesDir, `${lang}.json`)
  fs.writeFileSync(filePath, JSON.stringify(translation, null, 2), 'utf8')
  console.log(`Updated ${filePath}`)
})
