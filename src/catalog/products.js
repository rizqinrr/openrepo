import { cvCreatorProduct } from '../products/cv-creator/product.js'
import { typingSurvivalProduct } from '../products/typing-survival/product.js'
import { refreshManProduct } from '../products/refresh-man/product.js'
import CommunityPage from '../community/CommunityPage.jsx'
import ArcadeProfilePage from '../experiments/profile-templates/arcade/ArcadeProfilePage.jsx'
import TerminalProfilePage from '../experiments/profile-templates/terminal/TerminalProfilePage.jsx'
import SwissProfilePage from '../experiments/profile-templates/swiss/SwissProfilePage.jsx'
import AirbnbProfilePage from '../experiments/profile-templates/airbnb/AirbnbProfilePage.jsx'

export const products = [
  cvCreatorProduct,
  typingSurvivalProduct,
  refreshManProduct,
  {
    slug: 'arcade-profile', route: '#/arcade', title: 'Arcade Profile', description: 'Eksperimen profil bergaya konsol 8-bit.', category: 'playground', icon: 'sports_esports', order: 30,
    author: { name: 'rizqinrr', github: 'https://github.com/rizqinrr' }, Page: ArcadeProfilePage,
  },
  {
    slug: 'terminal-profile', route: '#/terminal', title: 'Terminal Profile', description: 'Eksperimen profil bergaya terminal.', category: 'playground', icon: 'terminal', order: 40,
    author: { name: 'rizqinrr', github: 'https://github.com/rizqinrr' }, Page: TerminalProfilePage,
  },
  {
    slug: 'community', route: '#/komunitas', title: 'Komunitas', description: 'Kanal komunitas yang dikurasi.', category: 'community', icon: 'forum', order: 10,
    author: { name: 'rizqinrr', github: 'https://github.com/rizqinrr' }, Page: CommunityPage,
  },
  {
    slug: 'swiss-profile', route: '#/swiss', title: 'Swiss Editorial', description: 'Eksperimen profil dengan grid editorial.', category: 'community', icon: 'grid_view', order: 20,
    author: { name: 'rizqinrr', github: 'https://github.com/rizqinrr' }, Page: SwissProfilePage,
  },
  {
    slug: 'airbnb-profile', route: '#/airbnb', title: 'Airbnb Experience', description: 'Eksperimen profil dengan visual hospitality.', category: 'community', icon: 'home', order: 30,
    author: { name: 'rizqinrr', github: 'https://github.com/rizqinrr' }, Page: AirbnbProfilePage,
  },
]
