import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translation files
import en from './locales/en.json'
import fr from './locales/fr.json'
import bn from './locales/bn.json'

// i18n configuration
i18n
  .use(LanguageDetector) // Automatically detect user language
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    resources: {
      en: {
        translation: en // English translations
      },
      fr: {
        translation: fr // French translations
      },
      bn: { translation: bn }
    },
    fallbackLng: 'en', // Default language
    interpolation: {
      escapeValue: false // React already protects against XSS
    }
  })

export default i18n
