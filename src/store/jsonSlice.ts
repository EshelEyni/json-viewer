import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import demoData from '../data/data.json'
import type { JsonObject, JsonPath, JsonPrimitive } from '../types'

type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

interface JsonState {
  data: JsonObject | null
  status: LoadingStatus
  error: string | null
  collapsedPaths: string[]
}

interface UpdateValuePayload {
  path: JsonPath
  value: JsonPrimitive
}

const initialState: JsonState = {
  data: null,
  status: 'idle',
  error: null,
  collapsedPaths: [],
}

export const fetchDemoData = (): Promise<JsonObject> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(structuredClone(demoData) as JsonObject)
    }, 300)
  })

export const loadData = createAsyncThunk<
  JsonObject,
  void,
  { state: { json: JsonState } }
>('json/loadData', fetchDemoData, {
  condition: (_, { getState }) => getState().json.status !== 'loading',
})

const jsonSlice = createSlice({
  name: 'json',
  initialState,
  reducers: {
    toggleNode: (state, action: PayloadAction<JsonPath>) => {
      const pathKey = JSON.stringify(action.payload)
      const collapsedIndex = state.collapsedPaths.indexOf(pathKey)

      if (collapsedIndex === -1) {
        state.collapsedPaths.push(pathKey)
      } else {
        state.collapsedPaths.splice(collapsedIndex, 1)
      }
    },
    updateValue: (state, action: PayloadAction<UpdateValuePayload>) => {
      if (!state.data || action.payload.path.length === 0) {
        return
      }

      const { path, value } = action.payload
      let currentObject = state.data

      for (const key of path.slice(0, -1)) {
        const nextValue = currentObject[key]

        if (typeof nextValue !== 'object') {
          return
        }

        currentObject = nextValue
      }

      const leafKey = path[path.length - 1]
      const currentValue = currentObject[leafKey]

      if (currentValue === undefined || typeof currentValue === 'object') {
        return
      }

      currentObject[leafKey] = value
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadData.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadData.fulfilled, (state, action) => {
        state.data = action.payload
        state.status = 'succeeded'
      })
      .addCase(loadData.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to load JSON data'
      })
  },
})

export const { toggleNode, updateValue } = jsonSlice.actions
export default jsonSlice.reducer
