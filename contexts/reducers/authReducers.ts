import { loginWithGoogle } from '@/contexts/actions/authActions';
import type { AuthState, Session } from '@/interfaces/authenticationInterface';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { registerUser, loginUser } from '@/contexts/actions/authActions';

const initialState: AuthState = {
    session: null,
    isLoading: false,
    errors: [],
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.errors = [];
        },
        removeError: (state, action) => {
            state.errors = state.errors?.filter(
                (error) => error !== action.payload
            );
        },
        saveLoginData: (state, action: PayloadAction<Session | null>) => {
            state.session = action.payload;
        },
        resetLoginData: (state) => {
            state.session = null;
        },
        setSession: (state, action: PayloadAction<Session | null>) => {
            state.session = action.payload;
        },
        logout: (state) => {
            state.session = null;
            state.errors = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = action.payload as string[];
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(
                loginUser.fulfilled,
                (state, action: PayloadAction<Session>) => {
                    state.isLoading = false;
                    state.session = {
                        token: action.payload.token,
                        email: action.payload.email,
                        user: action.payload.user,
                    };
                }
            )
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = action.payload as string[];
            })
            .addCase(loginWithGoogle.pending, (state) => {
                state.isLoading = true;
                state.errors = [];
            })
            .addCase(
                loginWithGoogle.fulfilled,
                (state, action: PayloadAction<Session>) => {
                    state.isLoading = false;
                    state.session = {
                        token: action.payload.token,
                        email: action.payload.email,
                        user: action.payload.user,
                    };
                }
            )
            .addCase(loginWithGoogle.rejected, (state, action) => {
                state.isLoading = false;
                state.errors = action.payload as string[];
            });
    },
});

export const {
    clearErrors,
    removeError,
    setSession,
    logout,
    saveLoginData,
    resetLoginData,
} = authSlice.actions;
export default authSlice.reducer;
