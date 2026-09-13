import { describe, expect, it } from 'vitest'
import type { JsonPrimitive, JsonPrimitiveType } from '../types'
import { getJsonPrimitiveType } from './utilService'

describe('getJsonPrimitiveType', () => {
  it.each<[JsonPrimitive, JsonPrimitiveType]>([
    ['hello', 'string'],
    [42, 'number'],
    [true, 'boolean'],
    ['#2563EB', 'color'],
    ['#fff', 'color'],
    ['#Ab12Cd', 'color'],
    ['#12', 'string'],
    ['blue', 'string'],
  ])('classifies %j as %s', (value, expectedType) => {
    expect(getJsonPrimitiveType(value)).toBe(expectedType)
  })
})
