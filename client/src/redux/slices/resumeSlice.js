
import { createSlice } from '@reduxjs/toolkit'

const resumeSlice = createSlice({
    name: 'resume',
    initialState: {
        resumes: [],

        loading: false,

    },
    reducers: {
        setResumes: (state, action) => {
            state.resumes = action.payload

            state.activeResume = action.payload.find(r => r.isActive) || null
        },

        setLoading: (state, action) => {
            state.loading = action.payload
        },

    }
})

export const { setResumes, setLoading } = resumeSlice.actions
export default resumeSlice.reducer