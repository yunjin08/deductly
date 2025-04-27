import { createApiService, api } from '@/services/api/baseApi';
import type { Receipt, ReceiptItem } from '@/interfaces';

const endpoint = '/receipt';

export const receiptsApi = {
    ...createApiService<Receipt>(endpoint),

    // Receipt-specific methods
    scan: async (
        imageData: FormData,
        onProgress?: (progress: number) => void
    ) => {
        const response = await api.post<Receipt>(
            `${endpoint}/scan`,
            imageData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total && onProgress) {
                        const progress =
                            (progressEvent.loaded / progressEvent.total) * 100;
                        onProgress(progress);
                    }
                },
            }
        );
        return response.data;
    },

    getByUserId: async (userId: string) => {
        const response = await api.get<Receipt[]>(`${endpoint}/user/${userId}`);
        return response.data;
    },

    getByCategory: async (category: string) => {
        const response = await api.get<Receipt[]>(
            `${endpoint}/category/${category}`
        );
        return response.data;
    },

    getByDateRange: async (startDate: Date, endDate: Date) => {
        const response = await api.get<Receipt[]>(`${endpoint}/date-range`, {
            params: { startDate, endDate },
        });
        return response.data;
    },

    getItems: async (receiptId: string) => {
        const response = await api.get<ReceiptItem[]>(
            `${endpoint}/${receiptId}/items`
        );
        return response.data;
    },

    addItem: async (receiptId: string, item: Partial<ReceiptItem>) => {
        const response = await api.post<ReceiptItem>(
            `${endpoint}/${receiptId}/items`,
            item
        );
        return response.data;
    },

    calculateDeductions: async (receiptId: string) => {
        const response = await api.get<{ totalDeductible: number }>(
            `${endpoint}/${receiptId}/deductions`
        );
        return response.data;
    },
};
