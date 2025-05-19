import React, {useState, useEffect} from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View, Alert, Text, TextInput, ActivityIndicator, Modal, NativeSyntheticEvent, NativeScrollEvent, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import GoBackRoute from '@/components/GoBackRoute';
import { FontAwesome6 } from '@expo/vector-icons';
import { cameraService } from '@/services/api/camera';

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
    items: Array<{
        name: string;
        price: string;
        quantity?: string;
    }>;
}

const CameraModalScreen = () => {
    const { pictureUri } = useLocalSearchParams();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeductionModal, setShowDeductionModal] = useState(false);
    const [deductionInfo, setDeductionInfo] = useState<{
        isEligible: boolean;
        amount: string;
        reason: string;
    } | null>(null);
    const [hasShownDeduction, setHasShownDeduction] = useState(false);
    const [scrollViewHeight, setScrollViewHeight] = useState(0);
    const [contentHeight, setContentHeight] = useState(0);

    const handleAnalyze = async () => {
        try {
            setIsAnalyzing(true);
            const response = await cameraService.processReceipt(pictureUri as string);
            if (response.success && response.data) {
                const { store_info, transaction_info, items, totals } = response.data;
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
                    items: items?.map(item => ({
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity
                    })) || [],
                });
            } else {
                Alert.alert('Error', 'Failed to analyze receipt');
            }
        } catch (error) {
            console.error('Error analyzing receipt:', error);
            Alert.alert('Error', 'Failed to analyze receipt. Please try again.');
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
                items: extractedData.items?.map(item => ({
                    title: item.name,
                    quantity: item.quantity || '1',
                    price: item.price,
                    subtotal: (parseFloat(item.price) * parseInt(item.quantity || '1')).toString(),
                    deductible_amount: '0',
                })) || [],
                totals: {
                    total_expediture: extractedData.total_amount || '0',
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
                Alert.alert('Error', response.error || 'Failed to save receipt');
            }
        } catch (error) {
            console.error('Error saving receipt:', error);
            Alert.alert('Error', 'Failed to save receipt. Please try again.');
        }
    };

    const updateField = (field: keyof ExtractedData, value: string) => {
        setExtractedData(prev => prev ? { ...prev, [field]: value } : null);
    };

    const updateItem = (index: number, field: keyof ExtractedData['items'][0], value: string) => {
        setExtractedData(prev => {
            if (!prev) return prev;
            const newItems = [...prev.items];
            newItems[index] = { ...newItems[index], [field]: value };
            return { ...prev, items: newItems };
        });
    };

    // Calculate deduction info (moved to a function)
    const calculateDeduction = () => {
        if (!extractedData) return { isEligible: false, amount: '0', reason: '' };
        const totalAmount = parseFloat(extractedData.total_amount || '0');
        const isEligible = totalAmount > 0;
        const deductionAmount = isEligible ? (totalAmount * 0.1).toFixed(2) : '0';
        return {
            isEligible,
            amount: deductionAmount,
            reason: isEligible ? 'This receipt may be eligible for tax deduction based on the total amount.' : 'This receipt is not eligible for tax deduction.'
        };
    };

    // Show deduction modal when scrolled to bottom
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { layoutMeasurement, contentOffset } = event.nativeEvent;
        const paddingToBottom = 40;
        if (
            layoutMeasurement.height + contentOffset.y >= contentHeight - paddingToBottom &&
            !showDeductionModal &&
            !hasShownDeduction &&
            extractedData
        ) {
            setDeductionInfo(calculateDeduction());
            setShowDeductionModal(true);
            setHasShownDeduction(true);
        }
    };

    if (extractedData) {
        return (
            <ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={16}
                onContentSizeChange={(_, h) => setContentHeight(h)}
                onLayout={e => setScrollViewHeight(e.nativeEvent.layout.height)}
                contentContainerStyle={{ padding: 16, paddingBottom: 200 }}
            >
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
                    <View className="mb-6">
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

                    {/* TIN */}
                    <View className="mb-6">
                        <Text className="text-gray-600 mb-1">TIN</Text>
                        {isEditing ? (
                            <TextInput
                                value={extractedData.tin}
                                onChangeText={(value) => updateField('tin', value)}
                                className="border border-gray-300 rounded-lg p-2"
                            />
                        ) : (
                            <Text className="text-lg">{extractedData.tin}</Text>
                        )}
                    </View>

                    {/* Branch */}
                    <View className="mb-6">
                        <Text className="text-gray-600 mb-1">Branch</Text>
                        {isEditing ? (
                            <TextInput
                                value={extractedData.branch}
                                onChangeText={(value) => updateField('branch', value)}
                                className="border border-gray-300 rounded-lg p-2"
                            />
                        ) : (
                            <Text className="text-lg">{extractedData.branch}</Text>
                        )}
                    </View>

                    {/* Date */}
                    <View className="mb-6">
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

                    {/* Time */}
                    <View className="mb-6">
                        <Text className="text-gray-600 mb-1">Time</Text>
                        {isEditing ? (
                            <TextInput
                                value={extractedData.time}
                                onChangeText={(value) => updateField('time', value)}
                                className="border border-gray-300 rounded-lg p-2"
                            />
                        ) : (
                            <Text className="text-lg">{extractedData.time}</Text>
                        )}
                    </View>

                    {/* Payment Method */}
                    <View className="mb-6">
                        <Text className="text-gray-600 mb-1">Payment Method</Text>
                        {isEditing ? (
                            <TextInput
                                value={extractedData.payment_method}
                                onChangeText={(value) => updateField('payment_method', value)}
                                className="border border-gray-300 rounded-lg p-2"
                            />
                        ) : (
                            <Text className="text-lg">{extractedData.payment_method}</Text>
                        )}
                    </View>

                    {/* Items */}
                    <View className="mb-6">
                        <Text className="text-gray-600 mb-2">Items</Text>
                        {extractedData.items?.map((item, index) => (
                            <View key={index} className="border-b border-gray-200 py-3 mb-3">
                                {isEditing ? (
                                    <View>
                                        <TextInput
                                            value={item.name}
                                            onChangeText={(value) => updateItem(index, 'name', value)}
                                            className="border border-gray-300 rounded-lg p-2 mb-2"
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
                                        <View className="flex-row justify-between mt-1">
                                            <Text className="text-gray-600">Qty: {item.quantity}</Text>
                                            <Text className="text-gray-600">₱{item.price}</Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>

                    {/* VAT */}
                    <View className="mb-6">
                        <Text className="text-gray-600 mb-1">VAT</Text>
                        {isEditing ? (
                            <TextInput
                                value={extractedData.vat}
                                onChangeText={(value) => updateField('vat', value)}
                                className="border border-gray-300 rounded-lg p-2"
                                keyboardType="numeric"
                            />
                        ) : (
                            <Text className="text-lg">₱{extractedData.vat}</Text>
                        )}
                    </View>

                    {/* Service Charge */}
                    <View className="mb-6">
                        <Text className="text-gray-600 mb-1">Service Charge</Text>
                        {isEditing ? (
                            <TextInput
                                value={extractedData.service_charge}
                                onChangeText={(value) => updateField('service_charge', value)}
                                className="border border-gray-300 rounded-lg p-2"
                                keyboardType="numeric"
                            />
                        ) : (
                            <Text className="text-lg">₱{extractedData.service_charge}</Text>
                        )}
                    </View>

                    {/* Discount */}
                    <View className="mb-6">
                        <Text className="text-gray-600 mb-1">Discount</Text>
                        {isEditing ? (
                            <TextInput
                                value={extractedData.discount}
                                onChangeText={(value) => updateField('discount', value)}
                                className="border border-gray-300 rounded-lg p-2"
                                keyboardType="numeric"
                            />
                        ) : (
                            <Text className="text-lg">₱{extractedData.discount}</Text>
                        )}
                    </View>

                    {/* Total Amount */}
                    <View className="mb-8">
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
                        className="bg-primary py-3 rounded-lg flex-row justify-center items-center mt-4 mb-8"
                    >
                        <FontAwesome6 name="save" size={20} color="white" className="mr-2" />
                        <Text className="text-white font-semibold text-lg">Save Receipt</Text>
                    </TouchableOpacity>

                    {/* Tax Deduction Modal */}
                    <Modal
                        visible={showDeductionModal}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setShowDeductionModal(false)}
                    >
                        <View className="flex-1 justify-center items-center bg-black/50">
                            <View className="bg-white p-6 rounded-xl w-[90%] max-w-[400px]">
                                <Text className="text-2xl font-bold mb-4 text-center">
                                    Tax Deduction Eligibility
                                </Text>
                                {deductionInfo && (
                                    <>
                                        <View className="mb-4">
                                            <Text className="text-lg font-semibold mb-2">
                                                Status: {deductionInfo.isEligible ? 'Eligible' : 'Not Eligible'}
                                            </Text>
                                            <Text className="text-gray-600 mb-2">
                                                {deductionInfo.reason}
                                            </Text>
                                            {deductionInfo.isEligible && (
                                                <Text className="text-lg font-bold text-primary">
                                                    Potential Deduction: ₱{deductionInfo.amount}
                                                </Text>
                                            )}
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => setShowDeductionModal(false)}
                                            className="bg-primary py-3 rounded-lg"
                                        >
                                            <Text className="text-white text-center font-semibold">
                                                Continue
                                            </Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        </View>
                    </Modal>
                </View>
            </ScrollView>
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
                        className="bg-primary rounded-full size-20 flex items-center justify-center"
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
