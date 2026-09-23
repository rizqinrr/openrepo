import { useHashRoute } from '../../app/useHashRoute.js'
import { DEV_TOOL_TABS } from './tools/toolTabs.js'
import './dev-tools.css'

const BASE_HASH = '#/dev-tools'

function toolIdFromRoute(route) {
  const match = route.match(/^#\/dev-tools\/([a-z0-9-]+)/)
  if (match) return match[1]
  return DEV_TOOL_TABS[0].id
}

export default function DevToolsPage() {
  const route = useHashRoute()
  const activeId = toolIdFromRoute(route)
  const activeTool =
    DEV_TOOL_TABS.find((tool) => tool.id === activeId) ?? DEV_TOOL_TABS[0]
  const ActiveComponent = activeTool.Component

  return (
    <main className="dt-page">
      <header className="dt-toolbar">
        <a className="dt-back" href="#/">
          <span className="material-symbols-outlined">arrow_back</span>
          <span>Kembali ke OpenRepo</span>
        </a>
        <div className="dt-toolbar-title">
          <span className="material-symbols-outlined">code</span>
          <span>Dev Tools</span>
        </div>
      </header>

      <nav className="dt-tabs" aria-label="Pilih tool">
        {DEV_TOOL_TABS.map((tool) => (
          <a
            key={tool.id}
            href={`${BASE_HASH}/${tool.id}`}
            className={`dt-tab${tool.id === activeTool.id ? ' is-active' : ''}`}
            aria-current={tool.id === activeTool.id ? 'page' : undefined}
            title={tool.description}
          >
            <span className="material-symbols-outlined">{tool.icon}</span>
            <span>{tool.label}</span>
          </a>
        ))}
      </nav>

      <section className="dt-panel" aria-label={`${activeTool.label} tool`}>
        <header className="dt-panel-head">
          <div>
            <h1>{activeTool.title}</h1>
            <p>{activeTool.description}</p>
          </div>
        </header>
        <ActiveComponent />
      </section>
    </main>
  )
}