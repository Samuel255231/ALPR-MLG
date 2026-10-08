//D:\Projet_Nicolas\V2\Frontend\gestion_stock_frontend\src\redux\slices\EntrainementSlice.tsx

import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

interface EntrainementResponse {
  video: string
  bigbags_detected: number
  saved_mouvement: number | null
  camera_type: "entree" | "sortie" | null
  current_stock: number | null
}

interface EntrainementState {
  data: EntrainementResponse | null
  loading: boolean
  error: string | null
}

interface UploadPayload {
  file: File
  camera_id: number
}

const initialState: EntrainementState = {
  data: null,
  loading: false,
  error: null,
}

const API_URL = "http://localhost:8000/mouvements/"

export const entrenementVideo = createAsyncThunk<
  EntrainementResponse,
  UploadPayload,
  { rejectValue: string }
>(
  "upload/video",
  async ({ file, camera_id }, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("camera", camera_id.toString())

      const response = await axios.post<EntrainementResponse>(`${API_URL}detect-video/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      return response.data
    } catch (error) {
  if (axios.isAxiosError(error)) {
    return rejectWithValue(error.response?.data?.message || error.message)
  }
  return rejectWithValue("Erreur inconnue")
}
  }
)

const uploadSlice = createSlice({
  name: "entrainement",
  initialState,
  reducers: {
    resetEntrenement(state) {
      state.data = null
      state.error = null
      state.loading = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(entrenementVideo.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(entrenementVideo.fulfilled, (state, action: PayloadAction<EntrainementResponse>) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(entrenementVideo.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { resetEntrenement } = uploadSlice.actions
export default uploadSlice.reducer
