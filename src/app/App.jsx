import { useEffect, useState } from 'react'
import { ACCENT, THEME_KEY } from '../shared/config/theme.js'
import HomePage from '../pages/home/HomePage.jsx'
import { HOME_THEMES } from '../pages/home/themes.js'
import { renderRoute } from './routes.jsx'
import { useHashRoute } from './useHashRoute.js'

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light')
  const route = useHashRoute()
  const routedPage = renderRoute(route)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.setAttribute('data-accent', ACCENT)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  if (routedPage) return routedPage
  const themeRoute = HOME_THEMES[route] ? route : '#/'
  return <HomePage theme={theme} setTheme={setTheme} themeRoute={themeRoute} />
}
