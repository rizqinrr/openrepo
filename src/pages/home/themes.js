export const HOME_THEMES = {
  '#/neo': { id: 'neo', label: 'Neo-Brutalism', icon: 'palette', desc: 'Pop Art & High Contrast' },
  '#/cyber': { id: 'cyber', label: 'Cyber Glass', icon: 'blur_on', desc: 'Glassmorphism & Neon Glow' },
  '#/luxury': { id: 'luxury', label: 'Editorial Luxury', icon: 'auto_awesome', desc: 'Serif Elegance & Gold Accents' },
  '#/fluid': { id: 'fluid', label: 'Fluid Motion', icon: 'animation', desc: 'Aura Spotlight & Spring Cursor' },
  '#/arcade': { id: 'arcade', label: '8-Bit Retro Arcade', icon: 'sports_esports', desc: 'Game Boy & 8-Bit Web Audio' },
  '#/terminal': { id: 'terminal', label: 'CLI Terminal Hacker', icon: 'terminal', desc: 'Phosphor CRT & Shell Emulator' },
  '#/swiss': { id: 'swiss', label: 'Swiss Editorial Grid', icon: 'grid_view', desc: 'International Style & Typographic Grid' },
  '#/airbnb': { id: 'airbnb', label: 'Airbnb Experience', icon: 'home', desc: 'Warm Hospitality & Clean Whitespace' },
}

export const HOME_THEME_OPTIONS = [
  { id: 'default', label: 'OpenRepo Default', icon: 'home', desc: 'Clean Product Directory', href: '#/' },
  ...Object.entries(HOME_THEMES).map(([href, theme]) => ({ ...theme, href })),
]

export function themeForRoute(route) {
  return HOME_THEMES[route] ?? { id: 'default', label: 'OpenRepo Default' }
}
