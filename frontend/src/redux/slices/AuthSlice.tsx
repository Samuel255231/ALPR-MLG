import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import api from "@/api/client"
import { API_URL } from "@/config"
import type { RootState } from "../store"

export type Role = "admin"|"quai"| "securite"
// --------------------
// 🔹 Types
// --------------------
interface User {
  id?: number
  username: string
  email?: string
  first_name?: string
  last_name?: string
  telephone?: string
  role?: Role
}

interface TokenData {
  access: string
  refresh: string
  user?: User
}

interface AuthState {
  loading: boolean
  userToken: TokenData | null
  error: string | null
  success: boolean
}

interface LoginParams {
  username: string
  password: string
}

interface UpdatePasswordParams {
  old_password: string
  password: string
  password1: string
}

// --------------------
// 🔹 Async Thunks
// --------------------

// 🔸 Login
export const login = createAsyncThunk<TokenData, LoginParams, { rejectValue: string }>(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/login/", {
        username,
        password,
      })
      return response.data as TokenData
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || "Login failed")
    }
  }
)

// 🔸 Refresh Token
export const refreshToken = createAsyncThunk<TokenData, void, { state: RootState; rejectValue: string }>(
  "auth/refreshToken",
  async (_, { getState, rejectWithValue }) => {
    const { userToken } = getState().auth
    try {
      const response = await fetch(`${API_URL}/auth/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: userToken?.refresh }),
      })
      const data = await response.json()

      if (response.ok) {
        const newToken: TokenData = {
          access: data.access,
          refresh: data.refresh,
          user: userToken?.user,
        }
        localStorage.setItem("userTokenAlpr", JSON.stringify(newToken))
        return newToken
      } else {
        return rejectWithValue("Token expired")
      }
    } catch {
      return rejectWithValue("Token refresh failed")
    }
  }
)

// 🔸 Update Password
export const updatePassword = createAsyncThunk<TokenData, UpdatePasswordParams, { state: RootState; rejectValue: string }>(
  "auth/updatePassword",
  async (dataUser, { getState, rejectWithValue }) => {
    const { userToken } = getState().auth
    const dataPost = {
      old_password: dataUser.old_password,
      password: dataUser.password,
      password2: dataUser.password1,
    }

    try {
      const response = await fetch(`${API_URL}/users/change_password/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(userToken?.access && { Authorization: `Bearer ${userToken.access}` }),
        },
        body: JSON.stringify(dataPost),
      })
      const data = await response.json()

      if (response.ok) {
        const newToken: TokenData = {
          access: data.access,
          refresh: data.refresh,
          user: userToken?.user,
        }
        localStorage.setItem("userTokenAlpr", JSON.stringify(newToken))
        return newToken
      } else {
        return rejectWithValue("Token expired")
      }
    } catch {
      return rejectWithValue("Token refresh failed")
    }
  }
)

// --------------------
// 🔹 Initial State
// --------------------
const userToken: TokenData | null = localStorage.getItem("userTokenAlpr")
  ? JSON.parse(localStorage.getItem("userTokenAlpr") as string)
  : null

const initialState: AuthState = {
  loading: false,
  userToken,
  error: null,
  success: false,
}

// --------------------
// 🔹 Slice
// --------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("userTokenAlpr")
      state.loading = false
      state.error = null
      state.userToken = null
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<TokenData>) => {
        state.loading = false
        state.userToken = action.payload
        // Debug: log payload before storing
        // eslint-disable-next-line no-console
        console.log('AuthSlice login.fulfilled payload:', action.payload)
        localStorage.setItem("userTokenAlpr", JSON.stringify(action.payload))
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // REFRESH TOKEN
      .addCase(refreshToken.fulfilled, (state, action: PayloadAction<TokenData>) => {
        state.userToken = action.payload
        state.loading = false
      })
      .addCase(refreshToken.rejected, (state) => {
        localStorage.removeItem("userTokenAlpr")
        state.userToken = null
        state.loading = false
      })

      // UPDATE PASSWORD
      .addCase(updatePassword.fulfilled, (state, action: PayloadAction<TokenData>) => {
        state.userToken = action.payload
        state.loading = false
      })
      .addCase(updatePassword.rejected, (state) => {
        state.loading = false
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
