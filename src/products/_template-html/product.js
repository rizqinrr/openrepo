import StandaloneProductPage from './StandaloneProductPage.jsx'

export const product = {
  slug: 'example-standalone-product',
  route: '#/example-standalone-product',
  title: 'Example Standalone Product',
  description: 'Jelaskan hasil yang diberikan produk ini.',
  category: 'playground',
  icon: 'web_asset',
  order: 100,
  author: {
    name: 'github-username',
    github: 'https://github.com/github-username',
  },
  Page: StandaloneProductPage,
}
