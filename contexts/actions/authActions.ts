import { createAsyncThunk } from '@reduxjs/toolkit';
import { register, login } from '@/services/auth';
import { handleSignInWithGoogle } from '@/services/sso/google';
import { isAxiosError } from 'axios';
import { AuthSessionResult } from 'expo-auth-session';

export interface Session {
    token: string;
    email: string;
}

export interface AuthState {
    session: Session | null;
    isLoading: boolean;
    errors?: string[];
}

export interface AuthAction {
    type: string;
    payload?: any;
}

export interface RegisterData {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface LoginData {
    username: string;
    password: string;
}

export const AUTH_ACTIONS = {
    SAVE_LOGIN_DATA: 'auth/saveLoginData',
    RESET_LOGIN_DATA: 'auth/resetLoginData',
    SET_LOADING: 'auth/setLoading',
} as const;

export const saveLoginData = (data: { token: string; email: string }) => ({
    type: AUTH_ACTIONS.SAVE_LOGIN_DATA,
    payload: data,
});

export const resetLoginData = () => ({
    type: AUTH_ACTIONS.RESET_LOGIN_DATA,
});

export const setLoading = (isLoading: boolean) => ({
    type: AUTH_ACTIONS.SET_LOADING,
    payload: isLoading,
});

export const registerUser = createAsyncThunk(
    'auth/register',
    async (data: RegisterData, { rejectWithValue }) => {
        try {
            const registeredUsername = await register(data);
            return registeredUsername;
        } catch (error) {
            if (isAxiosError(error) || error instanceof Error) {
                return rejectWithValue([`${error.name}: ${error.message}`]);
            }
            return rejectWithValue(['An unknown error occurred']);
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async (data: LoginData, { rejectWithValue }) => {
        try {
            const response = await login(data.username, data.password);
            return response;
        } catch (error) {
            if (isAxiosError(error) || error instanceof Error) {
                return rejectWithValue([`${error.name}: ${error.message}`]);
            }
            return rejectWithValue(['An unknown error occurred']);
        }
    }
);

// New SSO thunk
export const loginWithGoogle = createAsyncThunk(
    'auth/loginWithGoogle',
    async (response: AuthSessionResult, { rejectWithValue }) => {
        try {
            const ssoResponse = await handleSignInWithGoogle(response);
            if (!ssoResponse || !ssoResponse.token || !ssoResponse.email) {
                throw new Error('Invalid SSO response');
            }
            return ssoResponse;
        } catch (error) {
            if (isAxiosError(error) || error instanceof Error) {
                return rejectWithValue([`${error.name}: ${error.message}`]);
            }
            return rejectWithValue([
                'An unknown error occurred during Google sign-in',
            ]);
        }
    }
);
