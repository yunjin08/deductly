import React, { useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Alert,
    Text,
    TextInput,
    ActivityIndicator,
    Modal,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native';
import { Image } from 'expo-image';
import GoBackRoute from '@/components/GoBackRoute';
import { FontAwesome6 } from '@expo/vector-icons';
import { cameraService } from '@/services/api/camera';
import { ScrollableLayout } from '@/components/ScrollableLayout';

interface ExtractedData {
    store_name?: string;
    tin?: string;
    branch?: string;
    date?: string;
    time?: string;
    payment_method?: string;
    vat?: string;
    service_charge?: string;
    discount?: string;
    total_amount?: string;
    category?: 'FOOD' | 'TRANSPORTATION' | 'ENTERTAINMENT' | 'OTHER';
    is_deductible?: boolean;
    deductible_amount?: string;
    items: {
        name: string;
        price: string;
        quantity?: string;
    }[];
}

const CameraModalScreen = () => {
    const { pictureUri } = useLocalSearchParams();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [extractedData, setExtractedData] = useState<ExtractedData | null>(
        null
    );
    const [isEditing, setIsEditing] = useState(false);
    const [scrollViewHeight, setScrollViewHeight] = useState(0);
    const [contentHeight, setContentHeight] = useState(0);

    const handleAnalyze = async () => {
        try {
            setIsAnalyzing(true);
            const response = await cameraService.processReceipt(
                pictureUri as string
            );
            if (response.success && response.data) {
                const { store_info, transaction_info, items, totals, metadata } =
                    response.data;
                setExtractedData({
                    store_name: store_info?.name || '',
                    tin: store_info?.tin || '',
                    branch: store_info?.branch || '',
                    date: transaction_info?.date || '',
                    time: transaction_info?.time || '',
                    payment_method: transaction_info?.payment_method || '',
                    vat: totals?.vat || '',
                    service_charge: totals?.service_charge || '',
                    discount: totals?.discount || '',
                    total_amount: totals?.total || '',
                    category: (metadata?.transaction_category as 'FOOD' | 'TRANSPORTATION' | 'ENTERTAINMENT' | 'OTHER') || 'OTHER',
                    is_deductible: metadata?.is_deductible || false,
                    deductible_amount: metadata?.deductible_amount || '0',
                    items:
                        items?.map((item) => ({
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity,
                        })) || [],
                });
            } else {
                Alert.alert('Error', 'Failed to analyze receipt');
            }
        } catch (error) {
            console.error('Error analyzing receipt:', error);
            Alert.alert(
                'Error',
                'Failed to analyze receipt. Please try again.'
            );
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSave = async () => {
        try {
            if (!extractedData) return;

            const receiptData = {
                store_info: {
                    name: extractedData.store_name || '',
                    tin: extractedData.tin || '',
                },
                transaction_info: {
                    date: extractedData.date || '',
                    time: extractedData.time || '',
                    payment_method: extractedData.payment_method || '',
                },
                items:
                    extractedData.items?.map((item) => ({
                        title: item.name,
                        quantity: item.quantity || '1',
                        price: item.price,
                        subtotal: (
                            parseFloat(item.price) *
                            parseInt(item.quantity || '1')
                        ).toString(),
                        deductible_amount: '0',
                    })) || [],
                totals: {
                    total_expenditure: extractedData.total_amount || '0',
                    value_added_tax: extractedData.vat || '0',
                    discount: extractedData.discount || '0',
                },
                metadata: {
                    transaction_category: 'OTHER',
                    is_deductible: false,
                    deductible_amount: '0',
                },
            };

            const response = await cameraService.saveReceipt(receiptData);

            if (response.success) {
                Alert.alert('Success', 'Receipt saved successfully', [
                    {
                        text: 'OK',
                        onPress: () => router.push('/(protected)/(tabs)/home'),
                    },
                ]);
            } else {
                Alert.alert(
                    'Error',
                    response.error || 'Failed to save receipt'
                );
            }
        } catch (error) {
            console.error('Error saving receipt:', error);
            Alert.alert('Error', 'Failed to save receipt. Please try again.');
        }
    };

    const updateField = (field: keyof ExtractedData, value: string) => {
        setExtractedData((prev) => (prev ? { ...prev, [field]: value } : null));
    };

    const updateItem = (
        index: number,
        field: keyof ExtractedData['items'][0],
        value: string
    ) => {
        setExtractedData((prev) => {
            if (!prev) return prev;
            const newItems = [...prev.items];
            newItems[index] = { ...newItems[index], [field]: value };
            return { ...prev, items: newItems };
        });
    };

    if (extractedData) {
        return (
            <ScrollableLayout>
                <View className="p-4">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-2xl font-bold text-gray-800">
                            Receipt Details
                        </Text>
                        <TouchableOpacity
                            onPress={() => setIsEditing(!isEditing)}
                            className="bg-gray-100 p-3 rounded-full"
                        >
                            <FontAwesome6
                                name={isEditing ? 'check' : 'pen'}
                                size={20}
                                color="#1fddee"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Store Info Section */}
                    <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
                        <Text className="text-lg font-semibold text-gray-800 mb-4">Store Information</Text>
                        
                        {/* Store Name */}
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-1">Store Name</Text>
                            {isEditing ? (
                                <TextInput
                                    value={extractedData.store_name}
                                    onChangeText={(value) => updateField('store_name', value)}
                                    className="border border-gray-300 rounded-xl p-3 bg-gray-50"
                                />
                            ) : (
                                <Text className="text-lg text-gray-800">{extractedData.store_name}</Text>
                            )}
                        </View>

                        {/* TIN */}
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-1">TIN</Text>
                            {isEditing ? (
                                <TextInput
                                    value={extractedData.tin}
                                    onChangeText={(value) => updateField('tin', value)}
                                    className="border border-gray-300 rounded-xl p-3 bg-gray-50"
                                />
                            ) : (
                                <Text className="text-lg text-gray-800">{extractedData.tin}</Text>
                            )}
                        </View>

                        {/* Branch */}
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-1">Branch</Text>
                            {isEditing ? (
                                <TextInput
                                    value={extractedData.branch}
                                    onChangeText={(value) => updateField('branch', value)}
                                    className="border border-gray-300 rounded-xl p-3 bg-gray-50"
                                />
                            ) : (
                                <Text className="text-lg text-gray-800">{extractedData.branch}</Text>
                            )}
                        </View>
                    </View>

                    {/* Transaction Info Section */}
                    <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
                        <Text className="text-lg font-semibold text-gray-800 mb-4">Transaction Details</Text>
                        
                        {/* Date and Time */}
                        <View className="flex-row mb-4">
                            <View className="flex-1 mr-2">
                                <Text className="text-gray-600 mb-1">Date</Text>
                                {isEditing ? (
                                    <TextInput
                                        value={extractedData.date}
                                        onChangeText={(value) => updateField('date', value)}
                                        className="border border-gray-300 rounded-xl p-3 bg-gray-50"
                                    />
                                ) : (
                                    <Text className="text-lg text-gray-800">{extractedData.date}</Text>
                                )}
                            </View>
                            <View className="flex-1 ml-2">
                                <Text className="text-gray-600 mb-1">Time</Text>
                                {isEditing ? (
                                    <TextInput
                                        value={extractedData.time}
                                        onChangeText={(value) => updateField('time', value)}
                                        className="border border-gray-300 rounded-xl p-3 bg-gray-50"
                                    />
                                ) : (
                                    <Text className="text-lg text-gray-800">{extractedData.time}</Text>
                                )}
                            </View>
                        </View>

                        {/* Payment Method */}
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-1">Payment Method</Text>
                            {isEditing ? (
                                <TextInput
                                    value={extractedData.payment_method}
                                    onChangeText={(value) => updateField('payment_method', value)}
                                    className="border border-gray-300 rounded-xl p-3 bg-gray-50"
                                />
                            ) : (
                                <Text className="text-lg text-gray-800">{extractedData.payment_method}</Text>
                            )}
                        </View>
                    </View>

                    {/* Items Section */}
                    <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
                        <Text className="text-lg font-semibold text-gray-800 mb-4">Items</Text>
                        {extractedData.items?.map((item, index) => (
                            <View key={index} className="border-b border-gray-200 py-4 last:border-0">
                                {isEditing ? (
                                    <View>
                                        <TextInput
                                            value={item.name}
                                            onChangeText={(value) => updateItem(index, 'name', value)}
                                            className="border border-gray-300 rounded-xl p-3 bg-gray-50 mb-2"
                                            placeholder="Item name"
                                        />
                                        <View className="flex-row">
                                            <TextInput
                                                value={item.quantity}
                                                onChangeText={(value) => updateItem(index, 'quantity', value)}
                                                className="border border-gray-300 rounded-xl p-3 bg-gray-50 flex-1 mr-2"
                                                placeholder="Quantity"
                                                keyboardType="numeric"
                                            />
                                            <TextInput
                                                value={item.price}
                                                onChangeText={(value) => updateItem(index, 'price', value)}
                                                className="border border-gray-300 rounded-xl p-3 bg-gray-50 flex-1"
                                                placeholder="Price"
                                                keyboardType="numeric"
                                            />
                                        </View>
                                    </View>
                                ) : (
                                    <View>
                                        <Text className="text-lg text-gray-800">{item.name}</Text>
                                        <View className="flex-row justify-between mt-2">
                                            <Text className="text-gray-600">Qty: {item.quantity}</Text>
                                            <Text className="text-gray-800 font-medium">₱{item.price}</Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>

                    {/* Totals Section */}
                    <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
                        <Text className="text-lg font-semibold text-gray-800 mb-4">Totals</Text>
                        
                        {/* VAT */}
                        <View className="flex-row justify-between mb-4">
                            <Text className="text-gray-600">VAT</Text>
                            {isEditing ? (
                                <TextInput
                                    value={extractedData.vat}
                                    onChangeText={(value) => updateField('vat', value)}
                                    className="border border-gray-300 rounded-xl p-3 bg-gray-50 w-32 text-right"
                                    keyboardType="numeric"
                                />
                            ) : (
                                <Text className="text-gray-800">₱{extractedData.vat}</Text>
                            )}
                        </View>

                        {/* Service Charge */}
                        <View className="flex-row justify-between mb-4">
                            <Text className="text-gray-600">Service Charge</Text>
                            {isEditing ? (
                                <TextInput
                                    value={extractedData.service_charge}
                                    onChangeText={(value) => updateField('service_charge', value)}
                                    className="border border-gray-300 rounded-xl p-3 bg-gray-50 w-32 text-right"
                                    keyboardType="numeric"
                                />
                            ) : (
                                <Text className="text-gray-800">₱{extractedData.service_charge}</Text>
                            )}
                        </View>

                        {/* Discount */}
                        <View className="flex-row justify-between mb-4">
                            <Text className="text-gray-600">Discount</Text>
                            {isEditing ? (
                                <TextInput
                                    value={extractedData.discount}
                                    onChangeText={(value) => updateField('discount', value)}
                                    className="border border-gray-300 rounded-xl p-3 bg-gray-50 w-32 text-right"
                                    keyboardType="numeric"
                                />
                            ) : (
                                <Text className="text-gray-800">₱{extractedData.discount}</Text>
                            )}
                        </View>

                        {/* Total Amount */}
                        <View className="flex-row justify-between pt-4 border-t border-gray-200">
                            <Text className="text-lg font-semibold text-gray-800">Total Amount</Text>
                            {isEditing ? (
                                <TextInput
                                    value={extractedData.total_amount}
                                    onChangeText={(value) => updateField('total_amount', value)}
                                    className="border border-gray-300 rounded-xl p-3 bg-gray-50 w-32 text-right"
                                    keyboardType="numeric"
                                />
                            ) : (
                                <Text className="text-xl font-bold text-gray-800">₱{extractedData.total_amount}</Text>
                            )}
                        </View>
                    </View>

                    {/* Deductibles Section */}
                    <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
                        <Text className="text-lg font-semibold text-gray-800 mb-4">Deductibles</Text>
                        
                        {/* Deductible Status */}
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-gray-600">Status</Text>
                            <View className="flex-row items-center">
                                <Text className="mr-2 text-gray-800">
                                    {extractedData.is_deductible ? 'Eligible' : 'Not Eligible'}
                                </Text>
                                <FontAwesome6 
                                    name={extractedData.is_deductible ? "circle-check" : "circle-xmark"} 
                                    size={20} 
                                    color={extractedData.is_deductible ? "#22c55e" : "#ef4444"} 
                                />
                            </View>
                        </View>

                        {/* Category */}
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-gray-600">Category</Text>
                            <Text className="text-gray-800">{extractedData.category || 'OTHER'}</Text>
                        </View>

                        {/* Deductible Amount */}
                        <View className="flex-row justify-between items-center">
                            <Text className="text-gray-600">Deductible Amount</Text>
                            <Text className="text-gray-800 font-semibold">₱{extractedData.deductible_amount || '0.00'}</Text>
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        onPress={handleSave}
                        className="bg-primary py-4 rounded-xl flex-row justify-center items-center mb-8 shadow-sm"
                    >
                        <FontAwesome6 name="save" size={20} color="white" className="mr-2" />
                        <Text className="text-white font-semibold text-lg">Save Receipt</Text>
                    </TouchableOpacity>
                </View>
            </ScrollableLayout>
        );
    }

    return (
        <View style={styles.container}>
            <GoBackRoute />
            <Image
                source={{ uri: pictureUri as string }}
                style={styles.image}
                contentFit="cover"
            />
            <View className="absolute bottom-20 flex-row justify-center space-x-4 w-full">
                {isAnalyzing ? (
                    <ActivityIndicator size="large" color="#1fddee" />
                ) : (
                    <TouchableOpacity
                        className="bg-primary rounded-full size-20 flex items-center justify-center shadow-lg"
                        onPress={handleAnalyze}
                    >
                        <FontAwesome6 name="check" size={30} color="white" solid />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default CameraModalScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        flex: 1,
    },
});
