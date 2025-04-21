import { api } from '../baseApi';

interface OCRResponse {
    success: boolean;
    data: any; // You can type this more specifically based on your backend response
    error?: string;
}

export const cameraService = {
    processReceipt: async (base64Image: string): Promise<OCRResponse> => {
        const response = await api.post<OCRResponse>('/api/v1/camera/process_receipt/', {
            image: base64Image
        });
        return response.data;
    }
}; 