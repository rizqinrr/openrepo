import { lazy } from 'react'
import { meta as lms } from './lms/meta.js'
import { meta as saas } from './saas/meta.js'
import { meta as store } from './store/meta.js'
import { meta as hosting } from './hosting/meta.js'
import { meta as restaurant } from './restaurant/meta.js'

const pages = {
  lms: lazy(() => import('./lms/Landing.jsx')),
  saas: lazy(() => import('./saas/Landing.jsx')),
  store: lazy(() => import('./store/Landing.jsx')),
  hosting: lazy(() => import('./hosting/Landing.jsx')),
  restaurant: lazy(() => import('./restaurant/Landing.jsx')),
}

export const landings = [
  { ...lms, Page: pages.lms },
  { ...saas, Page: pages.saas },
  { ...store, Page: pages.store },
  { ...hosting, Page: pages.hosting },
  { ...restaurant, Page: pages.restaurant },
]

export function landingBySlug(slug) {
  return landings.find((landing) => landing.slug === slug)
}
