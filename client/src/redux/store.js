
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice.js'
import resumeReducer from './slices/resumeSlice.js'
import analysisReducer from './slices/analysisSlice.js'
import interviewReducer from './slices/interviewSlice.js'
import jobReducer from './slices/jobSlice.js'

const store = configureStore({
    reducer: {
        auth: authReducer,
        resume: resumeReducer,
        analysis: analysisReducer,
        interview: interviewReducer,
        job: jobReducer,
    }
})

export default store