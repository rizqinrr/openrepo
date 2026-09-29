import LmsLanding from './LmsLanding.jsx'

export const landings = [
  {
    slug: 'lms',
    title: 'LearnCode',
    tagline: 'Belajar kode dengan jalur yang jelas.',
    description:
      'LMS kursus coding: jalur bertingkat, tantangan langsung di browser, dan sertifikat.',
    tags: ['LMS', 'Kursus coding', 'Sertifikat'],
    icon: 'school',
    theme: {
      accent: '#059669',
      accentDeep: '#047857',
      accentSoft: 'rgba(16, 185, 129, 0.16)',
      accentContrast: '#ffffff',
      fontHead: "'Space Grotesk', system-ui, sans-serif",
      radius: '20px',
    },
    Page: LmsLanding,
  },
]

export function landingBySlug(slug) {
  return landings.find((landing) => landing.slug === slug)
}