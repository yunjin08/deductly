import { createAsyncThunk } from '@reduxjs/toolkit';
import { register, login } from '@/services/api/auth';
import { handleSignInWithGoogle } from '@/services/sso/google';
import { isAxiosError } from 'axios';
import { updateProfile } from "@/services/api/user";
import { AuthSessionResult } from 'expo-auth-session';
import { api } from "@/services/api/baseApi"
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

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (userData: any, { rejectWithValue }) => {
    try {
      // Make sure to log what's being sent to the API
      console.log("Updating user profile with data:", userData)

      const response = await api.patch("/account/me/update/", userData)

      // Log the response to see what's coming back
      console.log("Profile update response:", response.data)

      // Make sure both naming conventions are included in the return value
      return {
        ...response.data,
        profilePicture: response.data.profilePicture || response.data.profile_picture,
        profile_picture: response.data.profile_picture || response.data.profilePicture,
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      return rejectWithValue(error.response?.data?.message || "Failed to update profile")
    }
  },
);