import { api } from '../baseApi';
import * as FileSystem from 'expo-file-system';

interface BackendResponse {
    success: boolean;
    data: {
        store_info: {
            name: string;
            tin: string;
            branch: string;
        };
        transaction_info: {
            date: string;
            time: string;
            payment_method: string;
        };
        items: Array<{
            name: string;
            price: string;
            quantity: string;
        }>;
        totals: {
            subtotal: string;
            vat: string;
            service_charge: string;
            discount: string;
            total: string;
        };
        metadata: {
            currency: string;
            vat_rate: number;
            bir_accreditation: string;
            serial_number: string;
        };
        image_url: string;
    };
    error?: string;
}

export const cameraService = {
    processReceipt: async (imageUri: string): Promise<BackendResponse> => {
        try {
            console.log('Starting receipt processing...');
            // Create a permanent directory for receipts if it doesn't exist
            const receiptsDir = `${FileSystem.documentDirectory}receipts/`;
            const dirInfo = await FileSystem.getInfoAsync(receiptsDir);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(receiptsDir, {
                    intermediates: true,
                });
            }

            // Generate a new filename for the copied image
            const filename = `receipt_${Date.now()}.jpg`;
            const newUri = `${receiptsDir}${filename}`;

            // Copy the image to the permanent location
            await FileSystem.copyAsync({
                from: imageUri,
                to: newUri,
            });

            // Create FormData object
            const formData = new FormData();
            formData.append('image', {
                uri: newUri,
                type: 'image/jpeg',
                name: filename,
            } as any);

            console.log('Sending image to backend...');
            // Make API call with multipart/form-data
            const response = await api.post<BackendResponse>(
                '/camera/process_receipt/',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console.log(
                'Received response from backend:',
                JSON.stringify(response.data, null, 2)
            );

            // Clean up - delete the copied image after processing
            await FileSystem.deleteAsync(newUri);

            return response.data;
        } catch (error: any) {
            console.error('Error processing receipt:', error);
            throw error;
        }
    },
};
