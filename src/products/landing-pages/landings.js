import LmsLanding from './LmsLanding.jsx'
import SaasLanding from './SaasLanding.jsx'
import StoreLanding from './StoreLanding.jsx'
import HostingLanding from './HostingLanding.jsx'

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
  {
    slug: 'store',
    title: 'TokoKita',
    tagline: 'Belanja online terpercaya, penuh promo.',
    description:
      'Landing marketplace e-commerce ala Shopee: flash sale, kategori, dan katalog produk.',
    tags: ['E-commerce', 'Marketplace', 'Katalog'],
    icon: 'storefront',
    theme: {
      accent: '#fb5533',
      accentDeep: '#ee4d2d',
      accentSoft: 'rgba(251, 85, 51, 0.14)',
      accentContrast: '#ffffff',
      fontHead: "'Roboto', system-ui, sans-serif",
      radius: '6px',
    },
    Page: StoreLanding,
  },
  {
    slug: 'hosting',
    title: 'Domais',
    tagline: 'Produk cloud yang sederhana, aman, dan stabil.',
    description:
      'Landing cloud provider ala GNAME: domain checker, cloud server, SSL, dan email bisnis.',
    tags: ['Hosting', 'Cloud', 'Domain'],
    icon: 'cloud',
    theme: {
      accent: '#e8001c',
      accentDeep: '#cc0018',
      accentSoft: 'rgba(232, 0, 28, 0.12)',
      accentContrast: '#ffffff',
      fontHead: "'PingFang SC', 'Noto Sans SC', system-ui, sans-serif",
      radius: '12px',
    },
    Page: HostingLanding,
  },
]

export function landingBySlug(slug) {
  return landings.find((landing) => landing.slug === slug)
}