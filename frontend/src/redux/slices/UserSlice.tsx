import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import api from "@/api/client"


export interface User {
    id: number
    username: string,
    password?: string,
    email: string,
    telephone: string,
    first_name: string,
    last_name?: string,
    role: string,
    last_login: string,
    is_active: string

}

interface UserState {
    users: User[]
    loading: boolean
    error: string | null
}
const initialState: UserState = {
    users: [],
    loading: false,
    error: null,
}
const API_PATH = "/users/"

export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
    "users/fetchUsers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<User[]>(API_PATH)
            return response.data
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message)
        }
    }
)

export const addUsers = createAsyncThunk<User, Omit<User, "id" | 'last_login' | 'is_active'>, { rejectValue: string }>(
    "users/addUsers",
    async (dataUser, { rejectWithValue }) => {
        try {
            const response = await api.post<User>(`${API_PATH}registration/`, dataUser)
            return response.data
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message)
        }
    }
)

export const deleteUsers = createAsyncThunk<
    number,
    number,
    { rejectValue: string }
>(
    "users/deleteUsers",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`${API_PATH}${id}/`)
            return id
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message)
        }
    }
)
// TOGGLE USER ACTIVE
export const toggleUserActive = createAsyncThunk<
    { userId: number; is_active: string; message: string },
    number,
    { rejectValue: string }
>(
    "users/toggleUserActive",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await api.post(`${API_PATH}${userId}/status_compte/`)
            return {
                userId,
                is_active: response.data.is_active,
                message: response.data.detail,
            }
        } catch (err: any) {
            return rejectWithValue(err.response?.data || "Erreur lors de la modification du statut.")
        }
    }
)
// ---------------------- RESET PASSWORD ----------------------
export const resetUserPassword = createAsyncThunk<
    { userId: number; message: string },
    { userId: number; new_password: string ;password1:string},
    { rejectValue: string }
>(
    "users/resetUserPassword",
    async ({ userId, new_password,password1 }, { rejectWithValue }) => {
        try {
            const response = await api.put(`${API_PATH}reset_password/`, {
                user_id: userId,
                password:new_password,
                password2:password1
            })
            return { userId, message: response.data.detail }
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.detail || "Erreur lors de la réinitialisation du mot de passe"
            )
        }
    }
)

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchUsers
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
                state.loading = false
                state.users = action.payload
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

            // addUsers
            .addCase(addUsers.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addUsers.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false
                state.users.push(action.payload)
            })
            .addCase(addUsers.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })


        // ✅ DELETE
        builder.addCase(deleteUsers.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(deleteUsers.fulfilled, (state, action) => {
            state.loading = false
            state.users = state.users.filter((z) => z.id !== action.payload)
        })
        builder.addCase(deleteUsers.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || "Erreur lors de la suppression"
        })

        builder
            .addCase(toggleUserActive.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(toggleUserActive.fulfilled, (state, action) => {
                state.loading = false
                const index = state.users.findIndex((u) => u.id === action.payload.userId)
                if (index !== -1) {
                    state.users[index].is_active = action.payload.is_active
                }
            })
            .addCase(toggleUserActive.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || "Erreur lors de la modification du statut."
            })
        builder
            .addCase(resetUserPassword.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(resetUserPassword.fulfilled, (state, action) => {
                state.loading = false
                console.log(`Mot de passe réinitialisé pour l'utilisateur ${action.payload.userId}`)
            })
            .addCase(resetUserPassword.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || "Erreur lors de la réinitialisation du mot de passe"
            })

    },
})

export default userSlice.reducer
