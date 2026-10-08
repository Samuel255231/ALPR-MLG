import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"


export interface MouvementCamion {
    id: number
    immatriculation: string,
    marque: string,
    modele: string,
    chauffeur: string,
    etat: string,
    date: string,
    type:string

}

interface EvenementtState {
    evenements: MouvementCamion[]
    loading: boolean
    error: string | null
}
const initialState: EvenementtState = {
    evenements: [],
    loading: false,
    error: null,
}
const API_URL = "http://localhost:8000/evenements/"

export const fetchEvenements = createAsyncThunk<MouvementCamion[], void, { rejectValue: string }>(
    "evenements/fetchEvenements",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get<MouvementCamion[]>(API_URL)
            return response.data
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message)
        }
    }
)

export const addEvenement = createAsyncThunk<MouvementCamion, Omit<MouvementCamion, "id" | 'date' >, { rejectValue: string }>(
    "evenements/addEvenement",
    async (dataEvenement, { rejectWithValue }) => {
        try {
            const response = await axios.post<MouvementCamion>(`${API_URL}create/`, dataEvenement)
            return response.data
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message)
        }
    }
)

export const deleteEvenement = createAsyncThunk<
    number,
    number,
    { rejectValue: string }
>(
    "cameras/deleteEvenement",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}${id}/`)
            return id
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message)
        }
    }
)
const cameraSlice = createSlice({
    name: "camions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchEvenements
            .addCase(fetchEvenements.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchEvenements.fulfilled, (state, action: PayloadAction<MouvementCamion[]>) => {
                state.loading = false
                state.evenements = action.payload
            })
            .addCase(fetchEvenements.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

            // addEvenement
            .addCase(addEvenement.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addEvenement.fulfilled, (state, action: PayloadAction<MouvementCamion>) => {
                state.loading = false
                state.evenements.push(action.payload)
            })
            .addCase(addEvenement.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })


        // ✅ DELETE
        builder.addCase(deleteEvenement.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(deleteEvenement.fulfilled, (state, action) => {
            state.loading = false
            state.evenements = state.evenements.filter((z) => z.id !== action.payload)
        })
        builder.addCase(deleteEvenement.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || "Erreur lors de la suppression"
        })
    },
})

export default cameraSlice.reducer
