import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api, { messageErreur } from "@/api/client"

export interface Detection {
    id: number
    numero: string
    date_detection: string
    reconnue: boolean
    alerte: boolean
    camera: string | null
}

interface DetectionState {
    items: Detection[]
    loading: boolean
    error: string | null
}

const initialState: DetectionState = {
    items: [],
    loading: false,
    error: null,
}

const API_PATH = "/alpr/detections/"

export const fetchDetections = createAsyncThunk<Detection[], void, { rejectValue: string }>(
    "detections/fetchDetections",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<Detection[]>(API_PATH)
            return response.data
        } catch (err) {
            return rejectWithValue(messageErreur(err))
        }
    }
)

const detectionSlice = createSlice({
    name: "detections",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDetections.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchDetections.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload
            })
            .addCase(fetchDetections.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload ?? "Erreur lors du chargement des détections"
            })
    },
})

export default detectionSlice.reducer
