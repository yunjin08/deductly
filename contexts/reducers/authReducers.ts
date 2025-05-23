import { loginWithGoogle } from "@/contexts/actions/authActions"
import type { AuthState, Session } from "@/interfaces/authenticationInterface"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { registerUser, loginUser } from "@/contexts/actions/authActions"
import { updateUserProfile } from "../actions/authActions"
const initialState: AuthState = {
  session: null,
  isLoading: false,
  errors: [],
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.errors = []
    },
    removeError: (state, action) => {
      state.errors = state.errors?.filter((error) => error !== action.payload)
    },
    saveLoginData: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload
    },
    resetLoginData: (state) => {
      state.session = null
    },
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload
    },
    logout: (state) => {
      state.session = null
      state.errors = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.errors = []
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.errors = action.payload as string[]
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.errors = []
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<Session>) => {
        state.isLoading = false
        state.session = {
          token: action.payload.token,
          email: action.payload?.user?.email,
          user: action.payload.user,
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.errors = action.payload as string[]
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true
        state.errors = []
      })
      .addCase(loginWithGoogle.fulfilled, (state, action: PayloadAction<Session>) => {
        state.isLoading = false
        state.session = {
          token: action.payload.token,
          email: action.payload?.user?.email,
          user: action.payload.user,
        }
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        console.log("Updated user payload:", action.payload)
        if (state.session) {
          // Create a merged user object that preserves existing properties
          // and adds the new ones from the payload
          state.session.user = {
            ...state.session.user,
            ...action.payload,
            profilePicture: action.payload.profilePicture || action.payload.profile_picture,
            profile_picture: action.payload.profile_picture || action.payload.profilePicture,
            }
        }
      })

      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false
        state.errors = action.payload as string[]
      })
  },
})

export const { clearErrors, removeError, setSession, logout, saveLoginData, resetLoginData } = authSlice.actions
export default authSlice.reducer
