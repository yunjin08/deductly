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
            console.log('Starting receipt processing...');
            // Create a permanent directory for receipts if it doesn't exist
            const receiptsDir = `${FileSystem.documentDirectory}receipts/`;
            const dirInfo = await FileSystem.getInfoAsync(receiptsDir);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(receiptsDir, { intermediates: true });
            }

            // Generate a new filename for the copied image
            const filename = `receipt_${Date.now()}.jpg`;
            const newUri = `${receiptsDir}${filename}`;

            // Copy the image to the permanent location
            await FileSystem.copyAsync({
                from: imageUri,
                to: newUri
            });

            // Convert the copied image to base64
            const base64Image = await FileSystem.readAsStringAsync(newUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            console.log('Sending image to backend...');
            // Make API call
            const response = await api.post<OCRResponse>('/camera/process_receipt/', {
                image: base64Image
            });
            console.log('Received response from backend:', JSON.stringify(response.data, null, 2));

            // Clean up - delete the copied image after processing
            await FileSystem.deleteAsync(newUri);

            return response.data;
        } catch (error: any) {
            console.error('Error processing receipt:', error);
            throw error;
        }
    }
}; 