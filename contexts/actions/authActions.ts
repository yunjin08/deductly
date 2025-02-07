import { createAsyncThunk } from '@reduxjs/toolkit';
import { register, login } from '@/services/auth';
import { handleSignInWithGoogle } from '@/services/sso/google';
import { isAxiosError } from 'axios';
import { AuthSessionResult } from 'expo-auth-session';
import type {
    RegisterData,
    LoginData,
} from '@/interfaces/authenticationInterface';

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
            console.log('loginWithGoogle response', ssoResponse);
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
