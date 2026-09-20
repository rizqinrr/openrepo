import CvPage from '../pages/legacy/CvPage.jsx'
import PortfolioPage from '../pages/legacy/PortfolioPage.jsx'
import NeoProfilePage from '../experiments/profile-templates/neo/NeoProfilePage.jsx'
import CyberProfilePage from '../experiments/profile-templates/cyber/CyberProfilePage.jsx'
import { LuxuryProfilePage } from '../experiments/profile-templates/luxury/LuxuryProfilePage.jsx'
import FluidProfilePage from '../experiments/profile-templates/fluid/FluidProfilePage.jsx'
import { productRoutes } from '../catalog/registry.js'

export const routes = {
  '#/cv': CvPage,
  '#/portfolio': PortfolioPage,
  '#/neo': NeoProfilePage,
  '#/cyber': CyberProfilePage,
  '#/luxury': LuxuryProfilePage,
  '#/fluid': FluidProfilePage,
  ...productRoutes,
}

export function renderRoute(route) {
  const Page = routes[route]
  return Page ? <Page /> : null
}
