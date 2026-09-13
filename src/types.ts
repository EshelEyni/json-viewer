export type JsonPrimitive = string | number | boolean

export type JsonPrimitiveType = 'boolean' | 'number' | 'color' | 'string'

export interface JsonObject {
  [key: string]: JsonValue
}

export type JsonValue = JsonPrimitive | JsonObject

export type JsonPath = readonly string[]
