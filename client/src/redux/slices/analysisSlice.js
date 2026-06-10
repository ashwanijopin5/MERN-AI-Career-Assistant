
import { createSlice } from '@reduxjs/toolkit'

const analysisSlice = createSlice({
    name: 'analysis',
    initialState: {
        analyses: [],
        currentAnalysis: null,
        loading: false,
       
    },
    reducers: {
        setAnalyses: (state, action) => {
            state.analyses = action.payload
        },
        setCurrentAnalysis: (state, action) => {
            state.currentAnalysis = action.payload
        },
        
        setLoading: (state, action) => {
            state.loading = action.payload
        }
    }
})

export const { setAnalyses, setCurrentAnalysis,  setLoading } = analysisSlice.actions
export default analysisSlice.reducer