import ExampleProductPage from './ExampleProductPage.jsx'

export const product = {
  slug: 'example-product',
  route: '#/example-product',
  title: 'Example Product',
  description: 'Jelaskan hasil yang diberikan produk ini.',
  category: 'start-here',
  icon: 'extension',
  order: 100,
  author: {
    name: 'github-username',
    github: 'https://github.com/github-username',
  },
  Page: ExampleProductPage,
}
