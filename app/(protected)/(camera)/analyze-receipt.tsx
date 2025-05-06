import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Image } from 'expo-image';
import { FontAwesome6 } from '@expo/vector-icons';
import { cameraService } from '@/services/api/camera';
import GoBackRoute from '@/components/GoBackRoute';

interface ExtractedData {
    store_name?: string;
    date?: string;
    total_amount?: string;
    items: Array<{
        name: string;
        price: string;
        quantity?: string;
    }>;
    vat?: string;
    discount?: string;
    service_charge?: string;
    payment_method?: string;
    tin?: string;
}

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

const AnalyzeReceiptScreen = () => {
    const { pictureUri } = useLocalSearchParams();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleAnalyze = async () => {
        try {
            setIsAnalyzing(true);
            console.log('Starting receipt analysis...');
            const response = await cameraService.processReceipt(pictureUri as string) as BackendResponse;
            console.log('Received response:', JSON.stringify(response, null, 2));
            
            if (response.success && response.data) {
                console.log('Setting extracted data:', response.data);
                // Transform the data to match the frontend interface
                const transformedData: ExtractedData = {
                    store_name: response.data.store_info?.name,
                    tin: response.data.store_info?.tin,
                    date: response.data.transaction_info?.date,
                    payment_method: response.data.transaction_info?.payment_method,
                    items: response.data.items?.map(item => ({
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity
                    })) || [],
                    vat: response.data.totals?.vat,
                    service_charge: response.data.totals?.service_charge,
                    discount: response.data.totals?.discount,
                    total_amount: response.data.totals?.total
                };
                setExtractedData(transformedData);
            } else {
                console.error('Analysis failed:', response.error);
                Alert.alert('Error', response.error || 'Failed to analyze receipt');
            }
        } catch (error) {
            console.error('Error analyzing receipt:', error);
            Alert.alert('Error', 'Failed to analyze receipt. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSave = () => {
        router.push({
            pathname: '/(protected)/(tabs)/home',
            params: { receipt_data: JSON.stringify(extractedData) }
        });
    };

    const updateField = (field: keyof ExtractedData, value: string) => {
        setExtractedData(prev => prev ? { ...prev, [field]: value } : null);
    };

    const updateItem = (index: number, field: keyof ExtractedData['items'][number], value: string) => {
        setExtractedData(prev => {
            if (!prev || !prev.items) return prev;
            const newItems = [...prev.items];
            newItems[index] = { ...newItems[index], [field]: value };
            return { ...prev, items: newItems };
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <GoBackRoute />
            
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Receipt Image */}
                <View className="h-48 w-full">
                    <Image
                        source={{ uri: pictureUri as string }}
                        className="w-full h-full"
                        contentFit="cover"
                    />
                </View>

                {/* Analysis Button or Loading */}
                {!extractedData && (
                    <View className="p-4">
                        {isAnalyzing ? (
                            <ActivityIndicator size="large" color="#1fddee" />
                        ) : (
                            <TouchableOpacity
                                onPress={handleAnalyze}
                                className="bg-primary py-3 rounded-lg flex-row justify-center items-center"
                            >
                                <FontAwesome6 name="receipt" size={20} color="white" className="mr-2" />
                                <Text className="text-white font-semibold text-lg">Analyze Receipt</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* Extracted Data */}
                {extractedData && (
                    <View className="p-4">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-xl font-bold">Receipt Details</Text>
                            <TouchableOpacity
                                onPress={() => setIsEditing(!isEditing)}
                                className="bg-gray-100 p-2 rounded-full"
                            >
                                <FontAwesome6 
                                    name={isEditing ? "check" : "pen"} 
                                    size={20} 
                                    color="#1fddee"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Store Name */}
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-1">Store Name</Text>
                            {isEditing ? (
                                <TextInput
                                    value={extractedData.store_name}
                                    onChangeText={(value) => updateField('store_name', value)}
                                    className="border border-gray-300 rounded-lg p-2"
                                />
                            ) : (
                                <Text className="text-lg">{extractedData.store_name}</Text>
                            )}
                        </View>

                        {/* TIN Number */}
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-1">TIN Number</Text>
                            {isEditing ? (
                                <TextInput
                                    value={extractedData.tin}
                                    onChangeText={(value) => updateField('tin', value)}
                                    className="border border-gray-300 rounded-lg p-2"
                                    placeholder="Enter TIN number"
                                />
                            ) : (
                                <Text className="text-lg">{extractedData.tin || 'Not available'}</Text>
                            )}
                        </View>

                        {/* Date */}
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-1">Date</Text>
                            {isEditing ? (
                                <TextInput
                                    value={extractedData.date}
                                    onChangeText={(value) => updateField('date', value)}
                                    className="border border-gray-300 rounded-lg p-2"
                                />
                            ) : (
                                <Text className="text-lg">{extractedData.date}</Text>
                            )}
                        </View>

                        {/* Payment Method */}
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-1">Payment Method</Text>
                            {isEditing ? (
                                <TextInput
                                    value={extractedData.payment_method}
                                    onChangeText={(value) => updateField('payment_method', value)}
                                    className="border border-gray-300 rounded-lg p-2"
                                    placeholder="Cash/Card/GCash/etc."
                                />
                            ) : (
                                <Text className="text-lg">{extractedData.payment_method || 'Not specified'}</Text>
                            )}
                        </View>

                        {/* Items */}
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-2">Items</Text>
                            {extractedData.items?.map((item, index) => (
                                <View key={index} className="border-b border-gray-200 py-2">
                                    {isEditing ? (
                                        <View>
                                            <TextInput
                                                value={item.name}
                                                onChangeText={(value) => updateItem(index, 'name', value)}
                                                className="border border-gray-300 rounded-lg p-2 mb-1"
                                                placeholder="Item name"
                                            />
                                            <View className="flex-row">
                                                <TextInput
                                                    value={item.quantity}
                                                    onChangeText={(value) => updateItem(index, 'quantity', value)}
                                                    className="border border-gray-300 rounded-lg p-2 flex-1 mr-2"
                                                    placeholder="Quantity"
                                                    keyboardType="numeric"
                                                />
                                                <TextInput
                                                    value={item.price}
                                                    onChangeText={(value) => updateItem(index, 'price', value)}
                                                    className="border border-gray-300 rounded-lg p-2 flex-1"
                                                    placeholder="Price"
                                                    keyboardType="numeric"
                                                />
                                            </View>
                                        </View>
                                    ) : (
                                        <View>
                                            <Text className="text-lg">{item.name}</Text>
                                            <View className="flex-row justify-between">
                                                <Text className="text-gray-600">Qty: {item.quantity}</Text>
                                                <Text className="text-gray-600">₱{item.price}</Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>

                        {/* VAT */}
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-1">VAT (12%)</Text>
                            {isEditing ? (
                                <TextInput
                                    value={extractedData.vat}
                                    onChangeText={(value) => updateField('vat', value)}
                                    className="border border-gray-300 rounded-lg p-2"
                                    keyboardType="numeric"
                                />
                            ) : (
                                <Text className="text-lg">₱{extractedData.vat || '0.00'}</Text>
                            )}
                        </View>

                        {/* Service Charge */}
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-1">Service Charge</Text>
                            {isEditing ? (
                                <TextInput
                                    value={extractedData.service_charge}
                                    onChangeText={(value) => updateField('service_charge', value)}
                                    className="border border-gray-300 rounded-lg p-2"
                                    keyboardType="numeric"
                                />
                            ) : (
                                <Text className="text-lg">₱{extractedData.service_charge || '0.00'}</Text>
                            )}
                        </View>

                        {/* Discount */}
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-1">Discount</Text>
                            {isEditing ? (
                                <TextInput
                                    value={extractedData.discount}
                                    onChangeText={(value) => updateField('discount', value)}
                                    className="border border-gray-300 rounded-lg p-2"
                                    keyboardType="numeric"
                                />
                            ) : (
                                <Text className="text-lg">₱{extractedData.discount || '0.00'}</Text>
                            )}
                        </View>

                        {/* Total Amount */}
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-1">Total Amount</Text>
                            {isEditing ? (
                                <TextInput
                                    value={extractedData.total_amount}
                                    onChangeText={(value) => updateField('total_amount', value)}
                                    className="border border-gray-300 rounded-lg p-2"
                                    keyboardType="numeric"
                                />
                            ) : (
                                <Text className="text-xl font-bold">₱{extractedData.total_amount}</Text>
                            )}
                        </View>

                        {/* Save Button */}
                        <TouchableOpacity
                            onPress={handleSave}
                            className="bg-primary py-3 rounded-lg flex-row justify-center items-center mt-4"
                        >
                            <FontAwesome6 name="save" size={20} color="white" className="mr-2" />
                            <Text className="text-white font-semibold text-lg">Save Receipt</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default AnalyzeReceiptScreen; 