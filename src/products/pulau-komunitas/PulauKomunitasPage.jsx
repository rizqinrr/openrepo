import './pulau-komunitas.css'

export default function PulauKomunitasPage() {
  return (
    <main className="pulau-komunitas-page">
      <a className="pulau-komunitas-back" href="#/">
        <span className="material-symbols-outlined">arrow_back</span>
        Kembali ke OpenRepo
      </a>
      <iframe
        className="pulau-komunitas-frame"
        src="./products/pulau-komunitas/index.html"
        title="Pulau Komunitas 3D"
        allow="autoplay; fullscreen; microphone"
      />
    </main>
  )
}
