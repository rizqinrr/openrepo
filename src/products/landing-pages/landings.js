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
    accent: '#2563eb',
    Page: LmsLanding,
  },
]

export function landingBySlug(slug) {
  return landings.find((landing) => landing.slug === slug)
}