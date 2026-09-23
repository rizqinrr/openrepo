import { cvCreatorProduct } from '../products/cv-creator/product.js'
import { typingSurvivalProduct } from '../products/typing-survival/product.js'
import { refreshManProduct } from '../products/refresh-man/product.js'
import { devToolsProduct } from '../products/dev-tools/product.js'
import CommunityPage from '../community/CommunityPage.jsx'

export const products = [
  cvCreatorProduct,
  devToolsProduct,
  typingSurvivalProduct,
  refreshManProduct,
  {
    slug: 'community', route: '#/komunitas', title: 'Komunitas', description: 'Kanal komunitas yang dikurasi.', category: 'community', icon: 'forum', order: 10,
    author: { name: 'rizqinrr', github: 'https://github.com/rizqinrr' }, Page: CommunityPage,
  },
]
