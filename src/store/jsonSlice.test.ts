import { configureStore } from '@reduxjs/toolkit'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { JsonObject } from '../types'
import jsonReducer, { loadData, toggleNode, updateValue } from './jsonSlice'

const sampleData: JsonObject = {
  product: {
    name: 'Portal',
    branding: {
      primaryColor: '#2563EB',
    },
  },
  dashboard: {
    title: 'Operations',
  },
}

const createLoadedState = () =>
  jsonReducer(
    undefined,
    loadData.fulfilled(structuredClone(sampleData), 'test-request', undefined),
  )

afterEach(() => {
  vi.useRealTimers()
})

describe('jsonSlice', () => {
  it('updates a deeply nested value and preserves unrelated branches', () => {
    const previousState = createLoadedState()
    const previousDashboard = previousState.data?.dashboard

    const nextState = jsonReducer(
      previousState,
      updateValue({
        path: ['product', 'branding', 'primaryColor'],
        value: '#000000',
      }),
    )

    expect(nextState.data).toMatchObject({
      product: {
        branding: {
          primaryColor: '#000000',
        },
      },
    })
    expect(nextState.data?.dashboard).toBe(previousDashboard)
  })

  it('updates a top-level primitive value', () => {
    const stateWithVersion = jsonReducer(
      undefined,
      loadData.fulfilled({ version: 1 }, 'test-request', undefined),
    )

    const nextState = jsonReducer(
      stateWithVersion,
      updateValue({ path: ['version'], value: 2 }),
    )

    expect(nextState.data?.version).toBe(2)
  })

  it('ignores empty, missing, and object-targeting paths', () => {
    const previousState = createLoadedState()
    const actions = [
      updateValue({ path: [], value: 'ignored' }),
      updateValue({ path: ['missing', 'value'], value: 'ignored' }),
      updateValue({ path: ['product'], value: 'ignored' }),
    ]

    for (const action of actions) {
      expect(jsonReducer(previousState, action)).toEqual(previousState)
    }
  })

  it('toggles an object path between expanded and collapsed', () => {
    const path = ['product', 'branding'] as const
    const pathKey = JSON.stringify(path)
    const collapsedState = jsonReducer(createLoadedState(), toggleNode(path))

    expect(collapsedState.collapsedPaths).toContain(pathKey)

    const expandedState = jsonReducer(collapsedState, toggleNode(path))

    expect(expandedState.collapsedPaths).not.toContain(pathKey)
  })

  it('loads the demo dataset through the async thunk', async () => {
    vi.useFakeTimers()
    const store = configureStore({ reducer: { json: jsonReducer } })

    const loadPromise = store.dispatch(loadData())

    expect(store.getState().json.status).toBe('loading')

    await vi.advanceTimersByTimeAsync(300)
    await loadPromise

    expect(store.getState().json.status).toBe('succeeded')
    expect(store.getState().json.data?.product).toBeDefined()
  })
})
