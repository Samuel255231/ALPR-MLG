
/*
import { configureStore } from "@reduxjs/toolkit"

// Import des slices
import mouvementReducer from "./slices/MouvementSlice"
import zoneReducer from "./slices/ZoneSlice"
import cameraReducer from "./slices/CameraSlice"
import camionReducer from "./slices/CamionSlice"
import entrainementReducer from "./slices/EntrainementSlice"
import userReducer from "./slices/UserSlice"
import authReducer from "./slices/AuthSlice"
import totalReducer from "./slices/DahsboardSlice"
import alprReducer from "./slices/ALPRSlice"

export const store = configureStore({
  reducer: {
    mouvements: mouvementReducer,
    zones: zoneReducer,
    cameras: cameraReducer,
    camions: camionReducer,
    entrainements: entrainementReducer,   // ✔ nom corrigé
    users: userReducer,
    auth: authReducer,
    alprTotal: totalReducer,
    alpr: alprReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

*/

import { configureStore } from "@reduxjs/toolkit"

// Import des slices
import mouvementReducer from "./slices/MouvementSlice"
import zoneReducer from "./slices/ZoneSlice"
import cameraReducer from "./slices/CameraSlice"
import camionReducer from "./slices/CamionSlice"
import analyseALPRReducer from "./slices/ALPRSlice"
import userReducer from "./slices/UserSlice"
import authReducer from "./slices/AuthSlice"
import totalReducer from "./slices/DahsboardSlice"
import alprReducer from "./slices/ALPRSlice"

export const store = configureStore({
  reducer: {
    mouvements: mouvementReducer,
    zones: zoneReducer,
    cameras: cameraReducer,
    camions: camionReducer,
    analyseALPR: analyseALPRReducer,   // ✔ nom corrigé
    users: userReducer,
    auth: authReducer,
    alprTotal: totalReducer,
    alpr: alprReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

