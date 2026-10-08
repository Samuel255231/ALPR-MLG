/*

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

type MouvementTotals = {
  stock_actuel:number
  entree: number
  sortie: number
}

interface MouvementState {
  totals: MouvementTotals
  loading: boolean
  error: string | null
}

const initialState: MouvementState = {
  totals: { stock_actuel:0,entree: 0, sortie: 0 },
  loading: false,
  error: null,
}

// Thunk pour récupérer depuis l’API
export const fetchMouvementTotals = createAsyncThunk(
  "mouvement/fetchTotals",
  async () => {
    const res = await fetch(`http://localhost:8000/mouvements/totals/`)
    if (!res.ok) throw new Error("Erreur API mouvements")
    return (await res.json()) as MouvementTotals
  }
)

const mouvementTotalSlice = createSlice({
  name: "mouvementTotal",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMouvementTotals.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMouvementTotals.fulfilled, (state, action) => {
        state.loading = false
        state.totals = action.payload
      })
      .addCase(fetchMouvementTotals.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Erreur inconnue"
      })
  },
})

export default mouvementTotalSlice.reducer


*/

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

type ALPRTotals = {
  detectees: number
  reconnues: number
  uniques: number
  non_reconnues: number
}

interface ALPRState {
  totals: ALPRTotals
  loading: boolean
  error: string | null
}

const initialState: ALPRState = {
  totals: {
    detectees: 0,
    reconnues: 0,
    uniques: 0,
    non_reconnues: 0,
  },
  loading: false,
  error: null,
}

export const fetchALPRTotals = createAsyncThunk(
  "alpr/fetchTotals",
  async () => {
    const res = await fetch(`http://localhost:8000/alpr/totals/`)
    if (!res.ok) throw new Error("Erreur API ALPR")
    return (await res.json()) as ALPRTotals
  }
)

const alprTotalSlice = createSlice({
  name: "alprTotal",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchALPRTotals.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchALPRTotals.fulfilled, (state, action) => {
        state.loading = false
        state.totals = action.payload
      })
      .addCase(fetchALPRTotals.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Erreur inconnue"
      })
  },
})

export default alprTotalSlice.reducer
