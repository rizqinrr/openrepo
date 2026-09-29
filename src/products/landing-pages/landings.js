import LmsLanding from './LmsLanding.jsx'
import SaasLanding from './SaasLanding.jsx'

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
  {
    slug: 'saas',
    title: 'PulseMetrics',
    tagline: 'Pantau produkmu dalam satu dasbor.',
    description:
      'Analytics SaaS: metrik realtime, funnel, dan alert anomali untuk tim produk.',
    tags: ['SaaS', 'Analytics', 'Dashboard'],
    icon: 'query_stats',
    theme: {
      accent: '#ea580c',
      accentDeep: '#c2410c',
      accentSoft: 'rgba(234, 88, 12, 0.16)',
      accentContrast: '#ffffff',
      fontHead: "'Playfair Display', Georgia, serif",
      radius: '14px',
    },
    Page: SaasLanding,
  },
]

export function landingBySlug(slug) {
  return landings.find((landing) => landing.slug === slug)
}