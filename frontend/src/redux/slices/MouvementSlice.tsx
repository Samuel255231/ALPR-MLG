import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

type StatusType = "Actif" | "En maintenance" | "En panne";
export interface Zone {
    id: number
    nom: string
}
export interface Camera {
    id: number
    code: string,
    rtsp_url:string,
    description:string,
    type:string,
    zone:Zone,
    status:StatusType
    
}
// --- Types ---
export interface Mouvement {
  id: number
  camera: Camera
  quantite: number
  timestamp: string 
}

interface MouvementState {
  items: Mouvement[]
  loading: boolean
  error: string | null
}

// --- Initial State ---
const initialState: MouvementState = {
  items: [],
  loading: false,
  error: null,
}

// --- API URL ---
const API_URL = "http://localhost:8000/mouvements/"

// --- Async thunks ---
export const fetchMouvements = createAsyncThunk<Mouvement[], void, { rejectValue: string }>(
  "mouvements/fetchMouvements",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Mouvement[]>(API_URL)   
      return response.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

export const addMouvement = createAsyncThunk<Mouvement, Omit<Mouvement, "id" | "timestamp">, { rejectValue: string }>(
  "mouvements/addMouvement",
  async (mouvementData, { rejectWithValue }) => {
    try {
      const response = await axios.post<Mouvement>(API_URL, mouvementData)
      return response.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

// --- Slice ---
const mouvementSlice = createSlice({
  name: "mouvements",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchMouvements
      .addCase(fetchMouvements.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMouvements.fulfilled, (state, action: PayloadAction<Mouvement[]>) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchMouvements.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // addMouvement
      .addCase(addMouvement.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addMouvement.fulfilled, (state, action: PayloadAction<Mouvement>) => {
        state.loading = false
        state.items.push(action.payload)
      })
      .addCase(addMouvement.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default mouvementSlice.reducer
