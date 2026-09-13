import { useAppDispatch, useAppSelector } from '../store/hooks'
import { toggleNode } from '../store/jsonSlice'
import type { JsonPath, JsonValue } from '../types'
import { JsonValueEditor } from './JsonValueEditor'

interface JsonNodeProps {
  name: string
  path: JsonPath
  value: JsonValue
}

export function JsonNode({ name, path, value }: JsonNodeProps) {
  const dispatch = useAppDispatch()
  const pathKey = JSON.stringify(path)
  const isCollapsed = useAppSelector((state) =>
    state.json.collapsedPaths.includes(pathKey),
  )

  if (typeof value !== 'object') {
    return (
      <div className="grid min-h-11 grid-cols-1 items-center gap-1.5 rounded-lg px-2 py-2 transition-colors hover:bg-slate-50 sm:grid-cols-[minmax(9rem,0.7fr)_minmax(12rem,1.3fr)] sm:gap-4 sm:px-3 sm:py-1.5">
        <span className="truncate font-mono text-sm font-medium text-slate-700" title={name}>
          {name}
        </span>
        <JsonValueEditor name={name} path={path} value={value} />
      </div>
    )
  }

  const entries = Object.entries(value)

  return (
    <div>
      <button
        aria-expanded={!isCollapsed}
        className="group flex min-h-11 w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        onClick={() => dispatch(toggleNode(path))}
        type="button"
      >
        <span
          aria-hidden="true"
          className={`text-xs text-slate-400 transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
        >
          ▼
        </span>
        <span className="font-mono text-sm font-semibold text-slate-800">{name}</span>
        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-500">
          {entries.length}
        </span>
        <span className="ml-auto text-xs text-slate-400 opacity-0 transition-opacity group-hover:opacity-100">
          {isCollapsed ? 'Expand' : 'Collapse'}
        </span>
      </button>

      {!isCollapsed && (
        <div className="ml-2 border-l border-slate-200 pl-2 sm:ml-5 sm:pl-3">
          {entries.map(([childName, childValue]) => (
            <JsonNode
              key={childName}
              name={childName}
              path={[...path, childName]}
              value={childValue}
            />
          ))}
        </div>
      )}
    </div>
  )
}
