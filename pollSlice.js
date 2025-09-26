import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userRole: null,
  studentName: '',
  isRegistered: false,
  currentQuestion: null,
  options: [],
  isActive: false,
  results: {},
  totalStudents: 0,
  answered: 0,
  hasAnswered: false,
  connectionStatus: 'disconnected'
}

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setUserRole: (state, action) => {
      state.userRole = action.payload
    },
    setStudentName: (state, action) => {
      state.studentName = action.payload
    },
    setRegistered: (state, action) => {
      state.isRegistered = action.payload
    },
    setPollData: (state, action) => {
      state.currentQuestion = action.payload.question
      state.options = action.payload.options
      state.isActive = action.payload.isActive
      state.hasAnswered = false
    },
    setResults: (state, action) => {
      state.results = action.payload.results
      state.totalStudents = action.payload.totalStudents
      state.answered = action.payload.answered
    },
    setAnswered: (state, action) => {
      state.hasAnswered = action.payload
    },
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload
    },
    resetPoll: (state) => {
      state.currentQuestion = null
      state.options = []
      state.isActive = false
      state.results = {}
      state.hasAnswered = false
      state.answered = 0
    }
  }
})

export const {
  setUserRole,
  setStudentName,
  setRegistered,
  setPollData,
  setResults,
  setAnswered,
  setConnectionStatus,
  resetPoll
} = pollSlice.actions

export default pollSlice.reducer