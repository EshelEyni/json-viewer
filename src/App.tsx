import { JsonViewer } from './components/JsonViewer'

function App() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 sm:py-12">
      <section className="mx-auto max-w-4xl">
        <header className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
            Developer tool
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            JSON Viewer &amp; Editor
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Browse the configuration tree and edit its values. Changes are saved directly to the global store.
          </p>
        </header>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
            <span className="font-mono text-sm font-semibold text-slate-700">portal.json</span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
              Editable
            </span>
          </div>
          <JsonViewer />
        </div>
      </section>
    </main>
  )
}

export default App
