import { createApiService, api } from '@/services/api/baseApi';
import type { Image } from '@/interfaces';

const endpoint = '/camera';

export const imagesApi = {
    ...createApiService<Image>(endpoint),

    // Add image-specific methods
    upload: async (
        file: FormData,
        onUploadProgress?: (progress: number) => void
    ) => {
        const response = await api.post<Image>(`${endpoint}/upload`, file, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total && onUploadProgress) {
                    const progress =
                        (progressEvent.loaded / progressEvent.total) * 100;
                    onUploadProgress(progress);
                }
            },
        });
        return response.data;
    },

    uploadMultiple: async (
        files: FormData,
        onUploadProgress?: (progress: number) => void
    ) => {
        const response = await api.post<Image[]>(
            `${endpoint}/upload-multiple`,
            files,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total && onUploadProgress) {
                        const progress =
                            (progressEvent.loaded / progressEvent.total) * 100;
                        onUploadProgress(progress);
                    }
                },
            }
        );
        return response.data;
    },

    getByUserId: async (userId: string) => {
        const response = await api.get<Image[]>(`${endpoint}/user/${userId}`);
        return response.data;
    },

    optimize: async (
        id: string,
        options: { width?: number; height?: number; quality?: number }
    ) => {
        const response = await api.post<Image>(
            `${endpoint}/${id}/optimize`,
            options
        );
        return response.data;
    },
};
