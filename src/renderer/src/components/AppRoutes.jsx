import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// Pages
const Home = () => {
  const { t } = useTranslation()
  return <div className="p-5 text-center text-2xl">{t('content.welcome')}</div>
}
const About = () => {
  const { t } = useTranslation()
  return <div className="p-5 text-center text-2xl">{t('content.aboutUs')}</div>
}
const Contact = () => {
  const { t } = useTranslation()
  return <div className="p-5 text-center text-2xl">{t('content.contactInfo')}</div>
}

const AppRoutes = () => {
  const { t, i18n } = useTranslation()

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
  }

  return (
    <Router>
      {/* Navigation Bar */}
      <nav className="bg-blue-500 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-lg font-bold">My Electron App</h1>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-blue-200 font-semibold">
                {t('navbar.home')}
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-200 font-semibold">
                {t('navbar.about')}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-200 font-semibold">
                {t('navbar.contact')}
              </Link>
            </li>
          </ul>
          {/* Language Selector */}
          <div className="flex space-x-2">
            <button
              onClick={() => changeLanguage('en')}
              className="bg-white text-blue-500 px-3 py-1 rounded hover:bg-gray-200"
            >
              English
            </button>
            <button
              onClick={() => changeLanguage('fr')}
              className="bg-white text-blue-500 px-3 py-1 rounded hover:bg-gray-200"
            >
              Français
            </button>
            <button
              onClick={() => changeLanguage('bn')}
              className="bg-white text-blue-500 px-3 py-1 rounded hover:bg-gray-200"
            >
              বাংলা
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="container mx-auto mt-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  )
}

export default AppRoutes
