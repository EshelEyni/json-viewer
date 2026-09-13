import type { JsonPrimitive, JsonPrimitiveType } from '../types'

const HEX_COLOR_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i

export const getJsonPrimitiveType = (
  value: JsonPrimitive,
): JsonPrimitiveType => {
  if (typeof value === 'boolean') {
    return 'boolean'
  }

  if (typeof value === 'number') {
    return 'number'
  }

  if (HEX_COLOR_PATTERN.test(value)) {
    return 'color'
  }

  return 'string'
}
