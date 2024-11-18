const fs = require('fs')
const path = require('path')

const localesDir = './locales' // Path to your locales directory
const defaultLang = 'en' // Reference language
const targetLang = 'bn' // Target language (Bangla)

// Dynamically import the translate module (ESM)
;(async () => {
  const translate = (await import('translate')).default

  // Set LibreTranslate API endpoint
  translate.engine = 'libre'
  translate.url = 'https://libretranslate.com/translate'

  // Load all translation files
  const translations = {}
  fs.readdirSync(localesDir).forEach((file) => {
    if (file.endsWith('.json')) {
      const lang = path.basename(file, '.json')
      translations[lang] = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf8'))
    }
  })

  // Translate missing keys
  const translateKey = async (key, text) => {
    try {
      console.log(await translate(text, { from: defaultLang, to: targetLang }))
      return await translate(text, { from: defaultLang, to: targetLang })
    } catch (err) {
      console.error(`Error translating "${key}":`, err)
      return text // Fallback to English if translation fails
    }
  }

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
  for (const [lang, translation] of Object.entries(translations)) {
    if (lang === defaultLang) continue // Skip the default language

    for (const key of allKeys) {
      const keyParts = key.split('.')
      let current = translation
      let defaultCurrent = translations[defaultLang]
      const pathToKey = []

      for (const part of keyParts) {
        pathToKey.push(part)
        if (!current[part]) {
          if (pathToKey.length === keyParts.length) {
            // Translate or use placeholder
            const englishText = defaultCurrent?.[part]
            current[part] = await translateKey(key, englishText)
          } else {
            current[part] = {}
          }
        }
        current = current[part]
        defaultCurrent = defaultCurrent?.[part]
      }
    }

    // Save updated translations
    const filePath = path.join(localesDir, `${lang}.json`)
    fs.writeFileSync(filePath, JSON.stringify(translation, null, 2), 'utf8')
    console.log(`Updated ${filePath}`)
  }
})()
