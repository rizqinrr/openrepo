export const categories = [
  {
    id: 'start-here',
    title: 'Mulai dari sini',
    description: 'Profil dan tools yang bisa langsung dipakai.',
    icon: 'rocket_launch',
    order: 10,
  },
  {
    id: 'playground',
    title: 'Playground',
    description: 'Game dan eksperimen interaktif.',
    icon: 'sports_esports',
    order: 20,
  },
  {
    id: 'community',
    title: 'Komunitas & template',
    description: 'Ruang komunitas dan format profil lainnya.',
    icon: 'hub',
    order: 30,
  },
]

export function categoryById(id) {
  return categories.find((category) => category.id === id)
}
