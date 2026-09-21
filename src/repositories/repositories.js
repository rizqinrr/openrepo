export const repositoryCategories = [
  { id: 'agent-tools', label: 'AI & Agent Tools' },
  { id: 'security', label: 'Security' },
  { id: 'design', label: 'Design' },
]

export const repositories = [
  {
    slug: 'blitzstrike',
    name: 'BlitzStrike',
    owner: 'shinthink',
    github: 'https://github.com/shinthink/blitzstrike',
    stars: 639,
    category: 'security',
    icon: 'bolt',
    summary: 'MCP penetration-testing toolbelt dengan metodologi terstruktur dan katalog 130 tools.',
    description: 'BlitzStrike membantu agent menjalankan reconnaissance, pemetaan attack surface, analisis source-to-sink, dan validasi langsung melalui satu MCP server. Gunakan hanya pada sistem yang kamu miliki atau punya izin eksplisit untuk diuji.',
  },
  {
    slug: 'strix',
    name: 'Strix',
    owner: 'usestrix',
    github: 'https://github.com/usestrix/strix',
    stars: 63900,
    category: 'security',
    icon: 'security',
    summary: 'Agent AI open-source untuk menemukan dan membantu memperbaiki kerentanan aplikasi.',
    description: 'Strix mengotomatisasi pengujian keamanan aplikasi menggunakan agent AI. Repositorinya menyediakan benchmark, container, dokumentasi, serta suite pengujian untuk workflow penetration testing yang terkontrol.',
  },
  {
    slug: 'impeccable',
    name: 'Impeccable',
    owner: 'pbakaus',
    github: 'https://github.com/pbakaus/impeccable',
    stars: 69400,
    category: 'design',
    icon: 'design_services',
    summary: 'Design language dan skill untuk meningkatkan kualitas desain yang dibuat AI.',
    description: 'Impeccable menyediakan bahasa desain serta paket skill untuk berbagai AI coding harness. Fokusnya membantu agent menghasilkan antarmuka yang lebih konsisten, terarah, dan tidak terasa generik.',
  },
  {
    slug: '9router',
    name: '9router',
    owner: 'decolua',
    github: 'https://github.com/decolua/9router',
    stars: 29500,
    category: 'agent-tools',
    icon: 'route',
    summary: 'Router AI coding dengan banyak provider, auto-fallback, dan optimasi penggunaan token.',
    description: '9router menghubungkan Claude Code, Codex, Cursor, Cline, Copilot, dan agent lain ke banyak provider model. Fitur utamanya mencakup pemilihan provider, fallback otomatis, dan pengurangan pemakaian token.',
  },
  {
    slug: 'viserys-agent',
    name: 'Viserys Agent',
    owner: 'rizqinrr',
    github: 'https://github.com/rizqinrr/viserys-agent',
    stars: 667,
    category: 'agent-tools',
    icon: 'smart_toy',
    summary: 'Toolkit agent, command, skill, hook, dan workflow untuk coding agent lintas platform.',
    description: 'Viserys Agent mengemas konfigurasi agent, command, skill, hook, referensi, evaluasi, dan task agar workflow coding-agent dapat dipakai konsisten di beberapa harness.',
  },
]

export function formatStars(stars) {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(stars)
}

export function repositoryCategory(id) {
  return repositoryCategories.find((category) => category.id === id)
}
