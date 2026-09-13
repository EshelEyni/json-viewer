import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { loadData } from '../store/jsonSlice'
import { JsonNode } from './JsonNode'

export function JsonViewer() {
  const dispatch = useAppDispatch()
  const { data, error, status } = useAppSelector((state) => state.json)

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(loadData())
    }
  }, [dispatch, status])

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="flex min-h-56 items-center justify-center gap-3 text-sm text-slate-500">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
        Loading JSON data…
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm font-medium text-red-700">{error}</p>
        <button
          className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          onClick={() => void dispatch(loadData())}
          type="button"
        >
          Try again
        </button>
      </div>
    )
  }

  if (!data) {
    return <p className="py-16 text-center text-sm text-slate-500">No JSON data available.</p>
  }

  return (
    <div className="p-3 sm:p-5" role="tree">
      {Object.entries(data).map(([name, value]) => (
        <JsonNode key={name} name={name} path={[name]} value={value} />
      ))}
    </div>
  )
}
