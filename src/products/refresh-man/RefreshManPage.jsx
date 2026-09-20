import './refresh-man.css'

export default function RefreshManPage() {
  return (
    <main className="game-lawas-page">
      <a className="game-lawas-back" href="#/">
        <span className="material-symbols-outlined">arrow_back</span>
        Kembali ke OpenRepo
      </a>
      <iframe
        className="game-lawas-frame"
        src="./products/refresh-man/index.html"
        title="Refresh Man: Urban Rush"
        allow="autoplay; fullscreen"
      />
    </main>
  )
}
