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
            is_deductible: boolean;
            deductible_amount: string;
            category: string;
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
            transaction_category: string;
            is_deductible: boolean;
            deductible_amount: string;
        };
        image_url: string;
    };
    error?: string;
}

export const cameraService = {
    processReceipt: async (imageUri: string): Promise<BackendResponse> => {
        try {
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

            // Clean up - delete the copied image after processing
            await FileSystem.deleteAsync(newUri);

            return response.data;
        } catch (error: any) {
            console.error('Error processing receipt:', error);
            throw error;
        }
    },

    saveReceipt: async (
        receiptData: any
    ): Promise<{ success: boolean; receipt_id?: number; error?: string }> => {
        try {
            
            // Transform the data to match backend expectations
            const transformedData = {
                store_info: {
                    name: receiptData.store_info.name,
                    tin: receiptData.store_info.tin,
                    address: '', // Add default empty values for required fields
                    email: '',
                    contact_number: '',
                    establishment: receiptData.store_info.name
                },
                transaction_info: {
                    date: receiptData.transaction_info.date,
                    time: receiptData.transaction_info.time,
                    payment_method: receiptData.transaction_info.payment_method,
                },
                items: receiptData.items.map((item: any) => ({
                    title: item.title,
                    quantity: parseInt(item.quantity, 10),
                    price: parseFloat(item.price),
                    subtotal: parseFloat(item.subtotal),
                    deductible_amount: parseFloat(item.deductible_amount || '0'),
                })),
                totals: {
                    total_expenditure: parseFloat(receiptData.totals.total_expediture),
                    value_added_tax: parseFloat(receiptData.totals.value_added_tax),
                    discount: parseFloat(receiptData.totals.discount),
                },
                metadata: {
                    transaction_category: receiptData.metadata.transaction_category,
                    is_deductible: receiptData.metadata.is_deductible,
                    deductible_amount: parseFloat(receiptData.metadata.deductible_amount || '0'),
                },
            };

            const response = await api.post(
                '/camera/save_receipt/',
                transformedData
            );

            return response.data;
        } catch (error: any) {
            console.error('Error saving receipt:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to save receipt',
            };
        }
    },
};
