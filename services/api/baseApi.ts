import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Determine if running in an Android emulator
const isAndroidEmulator =
    Platform.OS === 'android' && Constants.isDevice === false;

// Choose the appropriate base URL
const baseURL = isAndroidEmulator
    ? process.env.EXPO_PUBLIC_EMULATOR_BASE_URL
    : process.env.EXPO_PUBLIC_LOCAL_AREA_BASE_URL;

export const api = axios.create({
    baseURL,
    timeout: 120000, // 120 seconds timeout (2 minutes)
});

// Add request interceptor for debugging
api.interceptors.request.use(
    async (config) => {
        // Get the auth token and email from AsyncStorage
        const token = await AsyncStorage.getItem('auth_token');
        const email = await AsyncStorage.getItem('user_email');

        // Add auth headers if they exist
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (email) {
            config.headers['X-User-Email'] = email;
        }

        console.log(
            `Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`
        );
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        console.log('Response received:', response.status);
        return response;
    },
    (error) => {
        console.error('Response error:', error);
        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
        }
        return Promise.reject(error);
    }
);

export const createApiService = <T>(endpoint: string) => ({
    getAll: async () => {
        const response = await api.get<T[]>(endpoint);
        return response.data;
    },

    getOne: async (id: string) => {
        const response = await api.get<T>(`${endpoint}/${id}/`);
        return response.data;
    },

    create: async (data: Partial<T>) => {
        const response = await api.post<T>(endpoint, data);
        return response.data;
    },

    update: async (id: string, data: Partial<T>) => {
        const response = await api.put<T>(`${endpoint}/${id}/`, data);
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`${endpoint}/${id}`);
        return id;
    },
});
