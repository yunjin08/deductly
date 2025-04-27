import { createApiService, api } from '@/services/api/baseApi';
import type { Report } from '@/interfaces';

const endpoint = '/report';

export const reportsApi = {
    ...createApiService<Report>(endpoint),

    // Report-specific methods
    generateAnalytics: async (startDate: Date, endDate: Date) => {
        const response = await api.post<Report>(`${endpoint}/analytics`, {
            startDate,
            endDate,
        });
        return response.data;
    },

    getByDateRange: async (startDate: Date, endDate: Date) => {
        const response = await api.get<Report[]>(`${endpoint}/date-range`, {
            params: { startDate, endDate },
        });
        return response.data;
    },

    getByCategory: async (category: string) => {
        const response = await api.get<Report[]>(
            `${endpoint}/category/${category}`
        );
        return response.data;
    },

    exportReport: async (reportId: string, format: 'pdf' | 'csv' | 'excel') => {
        const response = await api.get(
            `${endpoint}/${reportId}/export/${format}`,
            {
                responseType: 'blob',
            }
        );
        return response.data;
    },

    getDeductionSummary: async (reportId: string) => {
        const response = await api.get<{
            totalDeductions: number;
            categorizedDeductions: Record<string, number>;
        }>(`${endpoint}/${reportId}/deductions`);
        return response.data;
    },
};
