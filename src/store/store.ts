import { configureStore } from '@reduxjs/toolkit'
import jsonReducer from './jsonSlice'

export const store = configureStore({
  reducer: {
    json: jsonReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
