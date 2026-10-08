// src/redux/slices/ALPRSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
interface PlateResult {
  numero: string
  confidence: number
}
interface ALPRResponse {
  results: PlateResult[]
  image_url?: string
  video_url?: string
  camera_name?: string
}
interface ALPRState {
  data: ALPRResponse | null
  loading: boolean
  error: string | null
}
interface UploadPayload {
  file: File
  camera_id: number
}
const initialState: ALPRState = {
  data: null,
  loading: false,
  error: null,
}
export const detectALPRVideo = createAsyncThunk<
  ALPRResponse,
  UploadPayload,
  { rejectValue: string }
>(
  "alpr/detect",
  async ({ file, camera_id }, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("camera_id", camera_id.toString())

      const res = await fetch("http://localhost:8000/alpr/detect/", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const errorText = await res.text()
        return rejectWithValue(errorText)
      }

      const data: ALPRResponse = await res.json()
      return data
    } catch (error: unknown) {
  if (error instanceof Error) {
    return rejectWithValue(error.message);
  }
  return rejectWithValue("Erreur inconnue");
}

  }
)

const alprSlice = createSlice({
  name: "alpr",
  initialState,
  reducers: {
    resetALPR(state) {
      state.data = null
      state.error = null
      state.loading = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(detectALPRVideo.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(detectALPRVideo.fulfilled, (state, action: PayloadAction<ALPRResponse>) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(detectALPRVideo.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { resetALPR } = alprSlice.actions
export default alprSlice.reducer
