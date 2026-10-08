
//src\redux\slices\CameraSlice.tsx
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
    rtsp_url: string,
    description?: string,
    type: string,
    zone: Zone,
    status: StatusType

}

interface CameratState {
    cameras: Camera[]
    loading: boolean
    error: string | null
}
const initialState: CameratState = {
    cameras: [],
    loading: false,
    error: null,
}
const API_URL = "http://localhost:8000/cameras/"

export const fetchCameras = createAsyncThunk<Camera[], void, { rejectValue: string }>(
    "cameras/fetchCameras",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get<Camera[]>(API_URL)
            return response.data
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message)
        }
    }
)

export const addCamera = createAsyncThunk<Camera, Omit<Camera, "id" | 'description'>, { rejectValue: string }>(
    "cameras/addCamra",
    async (cameraData, { rejectWithValue }) => {
        try {
            const response = await axios.post<Camera>(API_URL, cameraData)
            return response.data
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message)
        }
    }
)
export const updateCamera = createAsyncThunk<
    Camera,
    Camera,
    { rejectValue: string }
>(
    "cameras/updateCamera",
    async (cameraData, { rejectWithValue }) => {
        try {
            // ✅ On crée un nouvel objet à envoyer avec seulement l’ID de la zone
            const payload = {
                code: cameraData.code,
                rtsp_url: cameraData.rtsp_url,
                description: cameraData.description,
                type: cameraData.type,
                status: cameraData.status,
                zone: typeof cameraData.zone === "object"
                    ? cameraData.zone.id
                    : cameraData.zone, // ✅ zone = id seulement
            }

            const response = await axios.put<Camera>(
                `${API_URL}${cameraData.id}/`,
                payload
            )

            return response.data
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message)
        }
    }
)
export const deleteCamera = createAsyncThunk<
    number,
    number,
    { rejectValue: string }
>(
    "cameras/deleteCamera",
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
    name: "cameras",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchCameras
            .addCase(fetchCameras.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchCameras.fulfilled, (state, action: PayloadAction<Camera[]>) => {
                state.loading = false
                state.cameras = action.payload
            })
            .addCase(fetchCameras.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

            // addCamera
            .addCase(addCamera.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addCamera.fulfilled, (state, action: PayloadAction<Camera>) => {
                state.loading = false
                state.cameras.push(action.payload)
            })
            .addCase(addCamera.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

        builder.addCase(updateCamera.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(updateCamera.fulfilled, (state, action) => {
            state.loading = false
            const index = state.cameras.findIndex((z) => z.id === action.payload.id)
            if (index !== -1) {
                state.cameras[index] = action.payload
            }
        })
        builder.addCase(updateCamera.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || "Erreur lors de la mise à jour"
        })

        // ✅ DELETE
        builder.addCase(deleteCamera.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(deleteCamera.fulfilled, (state, action) => {
            state.loading = false
            state.cameras = state.cameras.filter((z) => z.id !== action.payload)
        })
        builder.addCase(deleteCamera.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || "Erreur lors de la suppression"
        })
    },
})

export default cameraSlice.reducer
