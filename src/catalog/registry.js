import { categories } from './categories.js'
import { products } from './products.js'
import { validateCatalog } from './validate.js'

validateCatalog(categories, products)

export const catalogCategories = categories
  .map((category) => ({
    ...category,
    products: products
      .filter((product) => product.category === category.id)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  }))
  .filter((category) => category.products.length > 0)
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

export const productRoutes = Object.fromEntries(
  products.map((product) => [product.route, product.Page]),
)
