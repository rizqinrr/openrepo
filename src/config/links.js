import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaTelegram,
  FaDiscord,
  FaGraduationCap,
} from 'react-icons/fa'

export const SITE = {
  shareTitle: 'Profil & Links',
  shareText: 'Kunjungi profil',
  footerRights: 'All rights reserved.',
}

export const SOCIALS = [
  {
    label: 'GitHub',
    icon: FaGithub,
    href: 'https://github.com/rizqinrr',
  },
  {
    label: 'Instagram',
    icon: FaInstagram,
    href: 'https://www.instagram.com/rzqiinrr/',
  },
  {
    label: 'LinkedIn',
    icon: FaLinkedin,
    href: 'https://www.linkedin.com/in/riznv/',
  },
]

export const COURSE = {
  title: 'Nurman Course',
  desc: 'Belajar & tingkatkan skill',
  icon: FaGraduationCap,
  href: '#',
}

export const TEMPLATES = [
  {
    label: 'Neo-Brutalism',
    icon: 'palette',
    desc: 'Pop Art & High Contrast',
    href: '#/neo',
  },
  {
    label: 'Cyber Glass',
    icon: 'blur_on',
    desc: 'Glassmorphism & Neon Glow',
    href: '#/cyber',
  },
  {
    label: 'Editorial Luxury',
    icon: 'auto_awesome',
    desc: 'Serif Elegance & Gold Accents',
    href: '#/luxury',
  },
  {
    label: 'Fluid Motion',
    icon: 'animation',
    desc: 'Aura Spotlight & Spring Cursor',
    href: '#/fluid',
  },
  {
    label: '8-Bit Retro Arcade',
    icon: 'sports_esports',
    desc: 'Game Boy & 8-Bit Web Audio',
    href: '#/arcade',
  },
  {
    label: 'CLI Terminal Hacker',
    icon: 'terminal',
    desc: 'Phosphor CRT & Shell Emulator',
    href: '#/terminal',
  },
  {
    label: 'Swiss Editorial Grid',
    icon: 'grid_view',
    desc: 'International Style & Typographic Grid',
    href: '#/swiss',
  },
  {
    label: 'Airbnb Experience',
    icon: 'home',
    desc: 'Warm Hospitality, Clean Whitespace & Superhost UI',
    href: '#/airbnb',
  },
]

export const MENU = [
  {
    label: 'CV',
    icon: 'description',
    href: '#/cv',
  },
  {
    label: 'Buat CV',
    icon: 'edit_document',
    href: '#/creator',
  },
  {
    label: 'Game Mengetik',
    icon: 'keyboard',
    href: '#/typing-game',
  },
  {
    label: 'Komunitas',
    icon: 'forum',
    href: '#/komunitas',
  },
]

export const HOME_CATEGORIES = [
  {
    title: 'Mulai dari sini',
    icon: 'rocket_launch',
    desc: 'Profil, CV, dan karya yang siap dibagikan.',
    items: [
      { label: 'Buat CV', href: '#/creator', icon: 'edit_document', author: 'rizqinrr', github: 'https://github.com/rizqinrr' },
    ],
  },
  {
    title: 'Playground',
    icon: 'sports_esports',
    desc: 'Mainkan, coba, dan temukan interaksi baru.',
    items: [
      { label: 'Game Mengetik', href: '#/typing-game', icon: 'keyboard', author: 'rizqinrr', github: 'https://github.com/rizqinrr' },
      { label: 'Refresh Man: Urban Rush', href: '#/game-lawas', icon: 'directions_run', author: 'Dermawanpurba', github: 'https://github.com/Dermawanpurba' },
      { label: 'Arcade Profile', href: '#/arcade', icon: 'sports_esports', author: 'rizqinrr', github: 'https://github.com/rizqinrr' },
      { label: 'Terminal Profile', href: '#/terminal', icon: 'terminal', author: 'rizqinrr', github: 'https://github.com/rizqinrr' },
    ],
  },
  {
    title: 'Komunitas & template',
    icon: 'hub',
    desc: 'Jelajahi ruang komunitas dan format profil lainnya.',
    items: [
      { label: 'Komunitas', href: '#/komunitas', icon: 'forum', author: 'rizqinrr', github: 'https://github.com/rizqinrr' },
      { label: 'Swiss Editorial', href: '#/swiss', icon: 'grid_view', author: 'rizqinrr', github: 'https://github.com/rizqinrr' },
      { label: 'Airbnb Experience', href: '#/airbnb', icon: 'home', author: 'rizqinrr', github: 'https://github.com/rizqinrr' },
    ],
  },
]

export const WHATSAPP_GROUP = 'https://chat.whatsapp.com/LUw1SErvcJC4WeLiVO17OM'

export const COMMUNITY = {
  title: 'Komunitas',
  subtitle: 'Gabung dan ngobrol bareng di Ngomongin AI',
  items: [
    {
      id: 'wa-group',
      label: 'Grup Ngomongin AI',
      icon: FaWhatsapp,
      action: 'open',
      href: WHATSAPP_GROUP,
    },
    {
      id: 'wa-channel',
      label: 'Channel Ngomongin AI',
      icon: FaWhatsapp,
      action: 'open',
      href: 'https://whatsapp.com/channel/0029Vb72vF04dTnAinqyoO3e',
    },
    {
      id: 'telegram',
      label: 'Grup Telegram Ngomongin AI',
      icon: FaTelegram,
      action: 'gate',
      title: 'Grup Telegram Ngomongin AI',
      message: 'Link grup Telegram belum tersedia.',
    },
    {
      id: 'discord',
      label: 'Discord Ngomongin AI',
      icon: FaDiscord,
      action: 'gate',
      title: 'Discord Ngomongin AI',
      message: 'Link invite Discord sudah kadaluarsa.',
    },
  ],
}