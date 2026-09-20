function requireText(value, field, subject) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${subject} requires a non-empty ${field}`)
  }
}

function assertUnique(items, field, subject) {
  const seen = new Set()
  for (const item of items) {
    const value = item[field]
    if (seen.has(value)) throw new Error(`Duplicate ${subject} ${field}: ${value}`)
    seen.add(value)
  }
}

export function validateCatalog(categoryList, productList) {
  for (const category of categoryList) {
    requireText(category.id, 'id', 'Category')
    requireText(category.title, 'title', `Category ${category.id}`)
    requireText(category.description, 'description', `Category ${category.id}`)
    requireText(category.icon, 'icon', `Category ${category.id}`)
  }
  assertUnique(categoryList, 'id', 'category')

  const categoryIds = new Set(categoryList.map((category) => category.id))
  for (const product of productList) {
    requireText(product.slug, 'slug', 'Product')
    requireText(product.route, 'route', `Product ${product.slug}`)
    requireText(product.title, 'title', `Product ${product.slug}`)
    requireText(product.category, 'category', `Product ${product.slug}`)
    requireText(product.author?.name, 'author.name', `Product ${product.slug}`)
    requireText(product.author?.github, 'author.github', `Product ${product.slug}`)
    if (!categoryIds.has(product.category)) {
      throw new Error(`Product ${product.slug} uses unknown category: ${product.category}`)
    }
    if (typeof product.Page !== 'function') {
      throw new Error(`Product ${product.slug} requires a Page component`)
    }
  }
  assertUnique(productList, 'slug', 'product')
  assertUnique(productList, 'route', 'product')
  return true
}
