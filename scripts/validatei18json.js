const fs = require('fs')
const path = require('path')

const localesDir = './locales' // Path to your locales directory

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

// Check for missing keys in each file
let hasError = false
Object.entries(translations).forEach(([lang, translation]) => {
  const missingKeys = []
  allKeys.forEach((key) => {
    const keyParts = key.split('.')
    let current = translation
    for (const part of keyParts) {
      current = current?.[part]
      if (current === undefined) {
        missingKeys.push(key)
        break
      }
    }
  })
  if (missingKeys.length > 0) {
    hasError = true
    console.error(`Missing keys in ${lang}:`, missingKeys)
  }
})

if (!hasError) {
  console.log('All translation files are consistent!')
}
