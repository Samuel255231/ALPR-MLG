import { configureStore } from "@reduxjs/toolkit"

import detectionReducer from "./slices/DetectionSlice"
import zoneReducer from "./slices/ZoneSlice"
import cameraReducer from "./slices/CameraSlice"
import userReducer from "./slices/UserSlice"
import authReducer from "./slices/AuthSlice"
import totalReducer from "./slices/DahsboardSlice"
import alprReducer from "./slices/ALPRSlice"

export const store = configureStore({
  reducer: {
    detections: detectionReducer,
    zones: zoneReducer,
    cameras: cameraReducer,
    users: userReducer,
    auth: authReducer,
    alprTotal: totalReducer,
    alpr: alprReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
