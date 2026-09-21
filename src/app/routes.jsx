import CvPage from '../pages/legacy/CvPage.jsx'
import PortfolioPage from '../pages/legacy/PortfolioPage.jsx'
import RepositoriesPage from '../repositories/RepositoriesPage.jsx'
import { HOME_THEMES } from '../pages/home/themes.js'
import { productRoutes } from '../catalog/registry.js'

const experimentRoutes = new Set(Object.keys(HOME_THEMES))

export const routes = {
  '#/cv': CvPage,
  '#/portfolio': PortfolioPage,
  '#/repos': RepositoriesPage,
  '#/repos?contribute=1': RepositoriesPage,
  ...productRoutes,
}

export function renderRoute(route) {
  if (experimentRoutes.has(route)) return null
  const Page = routes[route]
  return Page ? <Page /> : null
}
