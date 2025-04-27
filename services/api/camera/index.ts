import { api } from '../baseApi';
import * as FileSystem from 'expo-file-system';

interface ExtractedData {
    store_name?: string;
    date?: string;
    total_amount?: string;
    items?: Array<{
        name: string;
        price: string;
        quantity?: string;
    }>;
}

interface OCRResponse {
    success: boolean;
    data: ExtractedData;
    error?: string;
}

export const cameraService = {
    processReceipt: async (imageUri: string): Promise<OCRResponse> => {
        try {
            // Convert image to base64
            const base64Image = await FileSystem.readAsStringAsync(imageUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Make API call
            const response = await api.post<OCRResponse>('/api/v1/camera/process_receipt/', {
                image: base64Image
            });

            return response.data;
        } catch (error: any) {
            console.error('Error processing receipt:', error);
            throw error;
        }
    }
}; 