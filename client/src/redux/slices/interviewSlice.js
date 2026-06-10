
import { createSlice } from '@reduxjs/toolkit'

const interviewSlice = createSlice({
    name: 'interview',
    initialState: {
        currentPrep: null,
        allPreps: [],
        loading:false
       
    },
    reducers: {
        setCurrentPrep: (state, action) => {
            state.currentPrep = action.payload
        },
        setAllPreps: (state, action) => {
            state.allPreps = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        }
    }
})

export const { setCurrentPrep, setAllPreps,setLoading} = interviewSlice.actions
export default interviewSlice.reducer