import { configureStore } from '@reduxjs/toolkit'
import pollReducer from './PollSlice'
import socketMiddleware from './socketMiddleware'

export const store = configureStore({
  reducer: {
    poll: pollReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddleware),
})

export default store