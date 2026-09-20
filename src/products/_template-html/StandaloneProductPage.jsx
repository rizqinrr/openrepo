import './product.css'

export default function StandaloneProductPage() {
  return (
    <main className="standalone-product">
      <a className="standalone-product-back" href="#/">Kembali ke OpenRepo</a>
      <iframe
        className="standalone-product-frame"
        src="./products/example-standalone-product/index.html"
        title="Example standalone product"
      />
    </main>
  )
}
