import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import api from "@/api/client"

export interface Zone {
    id: number
    nom: string
}

interface ZonetState {
    zones: Zone[]
    loading: boolean
    error: string | null
}
const initialState: ZonetState = {
    zones: [],
    loading: false,
    error: null,
}
const API_PATH = "/zones/"

export const fetchZones = createAsyncThunk<Zone[], void, { rejectValue: string }>(
    "zones/fetchZones",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<Zone[]>(API_PATH)
            return response.data
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message)
        }
    }
)

export const addZone = createAsyncThunk<Zone, Omit<Zone, "id">, { rejectValue: string }>(
    "zones/addZone",
    async (zoneDate, { rejectWithValue }) => {
        try {
            const response = await api.post<Zone>(API_PATH, zoneDate)
            return response.data
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message)
        }
    }
)
export const updateZone = createAsyncThunk<
    Zone,
    Zone,
    { rejectValue: string }
>(
    "zones/updateZone",
    async (zoneData, { rejectWithValue }) => {
        try {
            const response = await api.put<Zone>(`${API_PATH}${zoneData.id}/`, zoneData)
            return response.data
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message)
        }
    }
)

export const deleteZone = createAsyncThunk<
    number,
    number,
    { rejectValue: string }
>(
    "zones/deleteZone",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`${API_PATH}${id}/`)
            return id
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message)
        }
    }
)
const zoneSlice = createSlice({
    name: "zone",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchZones
            .addCase(fetchZones.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchZones.fulfilled, (state, action: PayloadAction<Zone[]>) => {
                state.loading = false
                state.zones = action.payload
            })
            .addCase(fetchZones.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

            // addZone
            .addCase(addZone.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addZone.fulfilled, (state, action: PayloadAction<Zone>) => {
                state.loading = false
                state.zones.push(action.payload)
            })
            .addCase(addZone.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

        builder.addCase(updateZone.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(updateZone.fulfilled, (state, action) => {
            state.loading = false
            const index = state.zones.findIndex((z) => z.id === action.payload.id)
            if (index !== -1) {
                state.zones[index] = action.payload
            }
        })
        builder.addCase(updateZone.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || "Erreur lors de la mise à jour"
        })

        // ✅ DELETE
        builder.addCase(deleteZone.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(deleteZone.fulfilled, (state, action) => {
            state.loading = false
            state.zones = state.zones.filter((z) => z.id !== action.payload)
        })
        builder.addCase(deleteZone.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || "Erreur lors de la suppression"
        })
    },
})

export default zoneSlice.reducer
