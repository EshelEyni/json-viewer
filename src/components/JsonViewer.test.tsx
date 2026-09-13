import { configureStore } from '@reduxjs/toolkit'
import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { afterEach, describe, expect, it, vi } from 'vitest'
import jsonReducer, { loadData } from '../store/jsonSlice'
import type { JsonObject, JsonValue } from '../types'
import { JsonViewer } from './JsonViewer'

const testData: JsonObject = {
  product: {
    name: 'Portal',
    isActive: true,
    releaseVersion: 12,
    branding: {
      primaryColor: '#2563EB',
    },
  },
}

const createTestStore = () =>
  configureStore({
    reducer: {
      json: jsonReducer,
    },
  })

const createLoadedStore = () => {
  const store = createTestStore()
  store.dispatch(
    loadData.fulfilled(structuredClone(testData), 'test-request', undefined),
  )
  return store
}

const renderViewer = (store = createLoadedStore()) => ({
  store,
  ...render(
    <Provider store={store}>
      <JsonViewer />
    </Provider>,
  ),
})

const getStoredValue = (
  store: ReturnType<typeof createTestStore>,
  path: readonly string[],
) => {
  let currentValue: JsonValue = store.getState().json.data as JsonObject

  for (const key of path) {
    if (typeof currentValue !== 'object') {
      throw new Error(`Path does not point to a JSON value: ${path.join('.')}`)
    }

    currentValue = currentValue[key]
  }

  return currentValue
}

afterEach(() => {
  vi.useRealTimers()
})

describe('JsonViewer', () => {
  it('renders nested data recursively with the correct input types', () => {
    renderViewer()

    expect(screen.getByText('product')).toBeInTheDocument()
    expect(screen.getByText('branding')).toBeInTheDocument()
    expect(screen.getByLabelText('Edit name')).toHaveAttribute('type', 'text')
    expect(screen.getByLabelText('Edit releaseVersion')).toHaveAttribute(
      'type',
      'number',
    )
    expect(screen.getByLabelText('Edit isActive')).toHaveAttribute(
      'type',
      'checkbox',
    )
    expect(screen.getByLabelText('Edit primaryColor')).toHaveAttribute(
      'type',
      'color',
    )
  })

  it('collapses and expands an object through Redux state', async () => {
    const user = userEvent.setup()
    const { store } = renderViewer()
    const brandingButton = screen.getByRole('button', { name: /branding/i })
    const pathKey = JSON.stringify(['product', 'branding'])

    await user.click(brandingButton)

    expect(screen.queryByLabelText('Edit primaryColor')).not.toBeInTheDocument()
    expect(store.getState().json.collapsedPaths).toContain(pathKey)

    await user.click(brandingButton)

    expect(screen.getByLabelText('Edit primaryColor')).toBeInTheDocument()
    expect(store.getState().json.collapsedPaths).not.toContain(pathKey)
  })

  it('updates string, number, boolean, and color values in Redux', async () => {
    const user = userEvent.setup()
    const { store } = renderViewer()

    const nameInput = screen.getByLabelText('Edit name')
    await user.clear(nameInput)
    await user.type(nameInput, 'New Portal')

    const versionInput = screen.getByLabelText('Edit releaseVersion')
    await user.clear(versionInput)
    await user.type(versionInput, '42')

    await user.click(screen.getByLabelText('Edit isActive'))
    fireEvent.change(screen.getByLabelText('Edit primaryColor'), {
      target: { value: '#abcdef' },
    })

    expect(getStoredValue(store, ['product', 'name'])).toBe('New Portal')
    expect(getStoredValue(store, ['product', 'releaseVersion'])).toBe(42)
    expect(getStoredValue(store, ['product', 'isActive'])).toBe(false)
    expect(getStoredValue(store, ['product', 'branding', 'primaryColor'])).toBe(
      '#ABCDEF',
    )
  })

  it('renders the loading state', () => {
    const store = createTestStore()
    store.dispatch(loadData.pending('test-request', undefined))

    renderViewer(store)

    expect(screen.getByText('Loading JSON data…')).toBeInTheDocument()
  })

  it('renders an error and retries the request', async () => {
    vi.useFakeTimers()
    const store = createTestStore()
    store.dispatch(
      loadData.rejected(new Error('Demo request failed'), 'test-request', undefined),
    )
    renderViewer(store)

    expect(screen.getByText('Demo request failed')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(store.getState().json.status).toBe('loading')

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300)
    })

    expect(store.getState().json.status).toBe('succeeded')
  })
})
