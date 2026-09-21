import { useRef, useState } from 'react'
import { repositoryCategories } from './repositories.js'
import {
  REPOSITORY_SUBMISSION_MIN_REASON,
  buildRepositoryIssueUrl,
  validateRepositorySubmission,
} from './repositorySubmission.js'

const initialSubmission = {
  githubUrl: '',
  category: '',
  contributor: '',
  reason: '',
  confirmed: false,
}

export default function RepositorySubmission() {
  const [submission, setSubmission] = useState(initialSubmission)
  const [errors, setErrors] = useState({})
  const [method, setMethod] = useState('propose')
  const formRef = useRef(null)

  const updateField = (event) => {
    const { name, type, checked, value } = event.target
    setSubmission((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const submitRepository = (event) => {
    event.preventDefault()
    const result = validateRepositorySubmission(submission)
    setErrors(result.errors)

    if (Object.keys(result.errors).length > 0) {
      window.requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus())
      return
    }

    window.location.assign(buildRepositoryIssueUrl(submission, result.repository))
  }

  return (
    <section className="repository-submission" aria-labelledby="repository-submission-title">
      <div className="repository-submission-intro">
        <span className="repositories-kicker">OPEN CURATION</span>
        <h2 id="repository-submission-title">Punya repo yang benar-benar berguna?</h2>
        <p>Usulkan repository publik untuk ditinjau. Bukan daftar otomatis: setiap usulan dicek manfaat, kualitas dokumentasi, keamanan, dan lisensinya sebelum masuk katalog.</p>
        <div className="repository-submission-criteria" aria-label="Kriteria repository">
          <div><span className="material-symbols-outlined" aria-hidden="true">task_alt</span><span><strong>Siap dipakai</strong>README menjelaskan instalasi dan penggunaan nyata.</span></div>
          <div><span className="material-symbols-outlined" aria-hidden="true">license</span><span><strong>Lisensi jelas</strong>Kontributor dan pengguna tahu hak pemakaiannya.</span></div>
          <div><span className="material-symbols-outlined" aria-hidden="true">verified_user</span><span><strong>Aman dan terawat</strong>Tidak berisi credential, malware, atau klaim menyesatkan.</span></div>
        </div>
      </div>

      <div className="repository-submission-panel">
      <div className="repository-contribution-switch" role="group" aria-label="Pilih cara berkontribusi">
        <button type="button" className={method === 'propose' ? 'is-active' : ''} aria-pressed={method === 'propose'} onClick={() => setMethod('propose')}>
          <span className="material-symbols-outlined" aria-hidden="true">add_link</span>
          Usulkan repo
        </button>
        <button type="button" className={method === 'direct' ? 'is-active' : ''} aria-pressed={method === 'direct'} onClick={() => setMethod('direct')}>
          <span className="material-symbols-outlined" aria-hidden="true">fork_right</span>
          Kontribusi langsung
        </button>
      </div>
        <div className="repository-submission-content">

          {method === 'propose' ? (
            <form ref={formRef} className="repository-submission-form" noValidate onSubmit={submitRepository}>
        <div className="repository-field repository-field-wide">
          <label htmlFor="repository-github-url">URL repository GitHub</label>
          <input
            id="repository-github-url"
            name="githubUrl"
            type="url"
            inputMode="url"
            autoComplete="url"
            placeholder="https://github.com/owner/repo"
            value={submission.githubUrl}
            aria-invalid={Boolean(errors.githubUrl)}
            aria-describedby={errors.githubUrl ? 'repository-github-url-error' : undefined}
            onChange={updateField}
          />
          {errors.githubUrl && <span id="repository-github-url-error" className="repository-field-error">{errors.githubUrl}</span>}
        </div>

        <div className="repository-field">
          <label htmlFor="repository-category">Kategori</label>
          <select
            id="repository-category"
            name="category"
            value={submission.category}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? 'repository-category-error' : undefined}
            onChange={updateField}
          >
            <option value="">Pilih kategori</option>
            {repositoryCategories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
          </select>
          {errors.category && <span id="repository-category-error" className="repository-field-error">{errors.category}</span>}
        </div>

        <div className="repository-field">
          <label htmlFor="repository-contributor">Nama / username GitHub</label>
          <input
            id="repository-contributor"
            name="contributor"
            type="text"
            autoComplete="username"
            placeholder="username"
            value={submission.contributor}
            aria-invalid={Boolean(errors.contributor)}
            aria-describedby={errors.contributor ? 'repository-contributor-error' : undefined}
            onChange={updateField}
          />
          {errors.contributor && <span id="repository-contributor-error" className="repository-field-error">{errors.contributor}</span>}
        </div>

        <div className="repository-field repository-field-wide">
          <label htmlFor="repository-reason">Apa manfaat nyatanya?</label>
          <textarea
            id="repository-reason"
            name="reason"
            rows="5"
            minLength={REPOSITORY_SUBMISSION_MIN_REASON}
            placeholder="Jelaskan masalah yang diselesaikan, siapa penggunanya, dan kenapa repo ini layak dikurasi."
            value={submission.reason}
            aria-invalid={Boolean(errors.reason)}
            aria-describedby={errors.reason ? 'repository-reason-error repository-reason-help' : 'repository-reason-help'}
            onChange={updateField}
          />
          <span id="repository-reason-help" className="repository-field-help">Minimal {REPOSITORY_SUBMISSION_MIN_REASON} karakter. Hindari deskripsi pemasaran.</span>
          {errors.reason && <span id="repository-reason-error" className="repository-field-error">{errors.reason}</span>}
        </div>

        <div className="repository-field repository-field-wide repository-confirmation">
          <input
            id="repository-confirmed"
            name="confirmed"
            type="checkbox"
            checked={submission.confirmed}
            aria-invalid={Boolean(errors.confirmed)}
            aria-describedby={errors.confirmed ? 'repository-confirmed-error' : undefined}
            onChange={updateField}
          />
          <label htmlFor="repository-confirmed">Saya sudah memastikan repository dapat diakses publik dan memiliki lisensi yang jelas.</label>
          {errors.confirmed && <span id="repository-confirmed-error" className="repository-field-error">{errors.confirmed}</span>}
        </div>

        <div className="repository-submission-action repository-field-wide">
          <button type="submit">Buat usulan di GitHub <span className="material-symbols-outlined" aria-hidden="true">open_in_new</span></button>
          <p>GitHub akan membuka issue yang sudah terisi. Kamu bisa meninjau isinya sebelum benar-benar mengirim.</p>
        </div>
            </form>
          ) : (
            <div className="repository-direct-contribution">
          <div className="repository-direct-heading">
            <span className="material-symbols-outlined" aria-hidden="true">code_blocks</span>
            <div>
              <h3>Tambah repo lewat pull request</h3>
              <p>Cocok jika kamu nyaman mengubah source. Satu object baru otomatis muncul di homepage dan halaman katalog.</p>
            </div>
          </div>
          <ol className="repository-direct-steps">
            <li><span>1</span><div><strong>Fork OpenRepo</strong><p>Buat salinan repository ke akun GitHub kamu.</p></div></li>
            <li><span>2</span><div><strong>Edit satu sumber data</strong><p>Tambahkan metadata ke <code>src/repositories/repositories.js</code>. Jangan mengedit card atau homepage.</p></div></li>
            <li><span>3</span><div><strong>Periksa perubahan</strong><p>Jalankan <code>npm run lint</code> dan <code>npm run build</code>.</p></div></li>
            <li><span>4</span><div><strong>Kirim pull request</strong><p>Jelaskan manfaat repository dan sertakan bukti lisensinya.</p></div></li>
          </ol>
          <div className="repository-direct-actions">
            <a className="repository-direct-primary" href="https://github.com/rizqinrr/openrepo/fork" target="_blank" rel="noopener noreferrer">Fork OpenRepo <span className="material-symbols-outlined" aria-hidden="true">open_in_new</span></a>
            <a href="https://github.com/rizqinrr/openrepo/edit/main/src/repositories/repositories.js" target="_blank" rel="noopener noreferrer">Edit data repository <span className="material-symbols-outlined" aria-hidden="true">edit</span></a>
            <a href="https://github.com/rizqinrr/openrepo/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer">Baca panduan <span className="material-symbols-outlined" aria-hidden="true">menu_book</span></a>
          </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
