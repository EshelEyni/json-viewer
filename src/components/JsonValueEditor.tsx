import type { ChangeEvent } from 'react'
import { getJsonPrimitiveType } from '../services/utilService'
import { useAppDispatch } from '../store/hooks'
import { updateValue } from '../store/jsonSlice'
import type { JsonPath, JsonPrimitive } from '../types'

interface JsonValueEditorProps {
  name: string
  path: JsonPath
  value: JsonPrimitive
}

const inputClassName =
  'min-w-0 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

const normalizeHexColor = (color: string) => {
  if (color.length !== 4) {
    return color
  }

  const [red, green, blue] = color.slice(1)
  return `#${red}${red}${green}${green}${blue}${blue}`
}

export function JsonValueEditor({ name, path, value }: JsonValueEditorProps) {
  const dispatch = useAppDispatch()
  const valueType = getJsonPrimitiveType(value)

  const update = (nextValue: JsonPrimitive) => {
    dispatch(updateValue({ path, value: nextValue }))
  }

  if (valueType === 'boolean') {
    return (
      <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
        <input
          aria-label={`Edit ${name}`}
          checked={value as boolean}
          className="peer sr-only"
          onChange={(event) => update(event.currentTarget.checked)}
          type="checkbox"
        />
        <span className="relative h-5 w-9 rounded-full bg-slate-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:bg-blue-600 peer-checked:after:translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-300" />
        <span className="w-9 font-mono text-xs text-slate-500">
          {value ? 'true' : 'false'}
        </span>
      </label>
    )
  }

  if (valueType === 'number') {
    const handleNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.currentTarget.valueAsNumber

      if (!Number.isNaN(nextValue)) {
        update(nextValue)
      }
    }

    return (
      <input
        aria-label={`Edit ${name}`}
        className={`${inputClassName} w-32 font-mono`}
        onChange={handleNumberChange}
        type="number"
        value={value as number}
      />
    )
  }

  if (valueType === 'color') {
    const color = value as string

    return (
      <label className="inline-flex items-center gap-2">
        <input
          aria-label={`Edit ${name}`}
          className="h-8 w-10 cursor-pointer rounded-md border border-slate-200 bg-white p-1"
          onChange={(event) => update(event.currentTarget.value.toUpperCase())}
          type="color"
          value={normalizeHexColor(color)}
        />
        <span className="font-mono text-xs text-slate-500">{color}</span>
      </label>
    )
  }

  return (
    <input
      aria-label={`Edit ${name}`}
      className={`${inputClassName} w-full max-w-sm`}
      onChange={(event) => update(event.currentTarget.value)}
      type="text"
      value={value as string}
    />
  )
}
