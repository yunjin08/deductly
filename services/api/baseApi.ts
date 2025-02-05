import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
});

export const createApiService = <T>(endpoint: string) => ({
    getAll: async () => {
        const response = await api.get<T[]>(endpoint);
        return response.data;
    },

    getOne: async (id: string) => {
        const response = await api.get<T>(`${endpoint}/${id}`);
        return response.data;
    },

    create: async (data: Partial<T>) => {
        const response = await api.post<T>(endpoint, data);
        return response.data;
    },

    update: async (id: string, data: Partial<T>) => {
        const response = await api.put<T>(`${endpoint}/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`${endpoint}/${id}`);
        return id;
    },
});
