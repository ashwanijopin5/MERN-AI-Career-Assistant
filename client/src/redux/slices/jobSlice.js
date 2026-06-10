
import { createSlice } from '@reduxjs/toolkit'

const jobSlice = createSlice({
    name: 'job',
    initialState: {
        recommendedJobs: [],
        savedJobs: [],
        stats: null,
        loading: false,
        error: null
    },
    reducers: {
        setRecommendedJobs: (state, action) => {
            state.recommendedJobs = action.payload
        },
        setSavedJobs: (state, action) => {
            state.savedJobs = action.payload
        },
        setStats: (state, action) => {
            state.stats = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        }
    }
})

export const { setRecommendedJobs, setSavedJobs, setStats, setLoading } = jobSlice.actions
export default jobSlice.reducer