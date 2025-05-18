import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Image } from 'expo-image';
import { FontAwesome6 } from '@expo/vector-icons';
import { cameraService } from '@/services/api/camera';
import { receiptsApi } from '@/services/api/receipts';
import GoBackRoute from '@/components/GoBackRoute';

interface ExtractedData {
    store_info: {
        name: string;
        tin: string;
    };
    transaction_info: {
        date: string;
        time: string;
        payment_method: string;
    };
    items: Array<{
        title: string;
        quantity: string;
        price: string;
        subtotal: string;
        is_deductible: boolean;
        deductible_amount: string;
        category: string;
    }>;
    totals: {
        total_expediture: string;
        value_added_tax: string;
        discount: string;
    };
    metadata: {
        transaction_category: string;
        is_deductible: boolean;
        deductible_amount: string;
    };
}

interface BackendResponse {
    success: boolean;
    data: {
        store_info: {
            name: string;
            tin: string;
        };
        transaction_info: {
            date: string;
            time: string;
            payment_method: string;
        };
        items: Array<{
            title: string;
            quantity: string;
            price: string;
            subtotal: string;
        }>;
        totals: {
            total_expediture: string;
            value_added_tax: string;
            discount: string;
        };
    };
    error?: string;
}

const AnalyzeReceiptScreen = () => {
    const { pictureUri } = useLocalSearchParams();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [extractedData, setExtractedData] = useState<ExtractedData | null>(
        null
    );
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        try {
            setIsAnalyzing(true);
            setError(null);
            console.log('Starting receipt analysis...');

            const response = await cameraService.processReceipt(
                pictureUri as string
            );

            if (response.success && response.data) {
                // Transform the data to match our interface
                const transformedData: ExtractedData = {
                    store_info: {
                        name: response.data.store_info.name,
                        tin: response.data.store_info.tin,
                    },
                    transaction_info: {
                        date: response.data.transaction_info.date,
                        time: response.data.transaction_info.time,
                        payment_method:
                            response.data.transaction_info.payment_method,
                    },
                    items: response.data.items.map((item) => ({
                        title: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        subtotal: (
                            parseFloat(item.price) * parseInt(item.quantity)
                        ).toString(),
                        is_deductible: item.is_deductible,
                        deductible_amount: item.deductible_amount,
                        category: item.category,
                    })),
                    totals: {
                        total_expediture: response.data.totals.total,
                        value_added_tax: response.data.totals.vat,
                        discount: response.data.totals.discount,
                    },
                    metadata: {
                        transaction_category:
                            response.data.metadata.transaction_category,
                        is_deductible: response.data.metadata.is_deductible,
                        deductible_amount:
                            response.data.metadata.deductible_amount,
                    },
                };
                setExtractedData(transformedData);
            } else {
                setError(response.error || 'Failed to analyze receipt');
                Alert.alert(
                    'Error',
                    response.error || 'Failed to analyze receipt'
                );
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to analyze receipt';
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSave = async () => {
        console.log('Save button pressed');
        try {
            if (!extractedData) return;

            console.log('Saving receipt with data:', extractedData);

            // Transform the data to match the receipt model
            const receiptData = {
                title: `Receipt from ${extractedData.store_info.name}`,
                category: extractedData.metadata.transaction_category,
                total_expediture: parseFloat(extractedData.totals.total_expediture),
                payment_method: extractedData.transaction_info.payment_method,
                discount: parseFloat(extractedData.totals.discount),
                value_added_tax: parseFloat(extractedData.totals.value_added_tax),
                vendor: {
                    name: extractedData.store_info.name,
                    tin: extractedData.store_info.tin,
                    address: '',
                    email: '',
                    contact_number: '',
                    establishment: extractedData.store_info.name
                },
                items: extractedData.items.map(item => ({
                    title: item.title,
                    quantity: parseInt(item.quantity),
                    price: parseFloat(item.price),
                    subtotal_expenditure: parseFloat(item.subtotal),
                    deductable_amount: parseFloat(item.deductible_amount || '0')
                }))
            };

            console.log('Transformed receipt data:', receiptData);

            const response = await receiptsApi.create(receiptData);
            console.log('Save response:', response);

            Alert.alert('Success', 'Receipt saved successfully', [
                {
                    text: 'OK',
                    onPress: () => router.push('/(protected)/(tabs)/home'),
                },
            ]);
        } catch (error) {
            console.error('Error saving receipt:', error);
            Alert.alert('Error', 'Failed to save receipt');
        }
    };

    const updateField = (field: keyof ExtractedData, value: string) => {
        setExtractedData((prev) => (prev ? { ...prev, [field]: value } : null));
    };

    const updateItem = (
        index: number,
        field: keyof ExtractedData['items'][number],
        value: string
    ) => {
        setExtractedData((prev) => {
            if (!prev || !prev.items) return prev;
            const newItems = [...prev.items];
            newItems[index] = { ...newItems[index], [field]: value };
            return { ...prev, items: newItems };
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <TouchableOpacity
                onPress={() => console.log('Test Save pressed')}
                style={{ zIndex: 9999, backgroundColor: 'red', padding: 20 }}
            >
                <Text>Test Save</Text>
            </TouchableOpacity>
            <GoBackRoute />

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 20 }}
            >
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
                            <View className="items-center">
                                <ActivityIndicator
                                    size="large"
                                    color="#1fddee"
                                />
                                <Text className="mt-2 text-gray-600">
                                    Analyzing receipt...
                                </Text>
                            </View>
                        ) : (
                            <TouchableOpacity
                                onPress={handleAnalyze}
                                className="bg-primary py-3 rounded-lg flex-row justify-center items-center"
                                disabled={isAnalyzing}
                            >
                                <FontAwesome6
                                    name="receipt"
                                    size={20}
                                    color="white"
                                    className="mr-2"
                                />
                                <Text className="text-white font-semibold text-lg">
                                    Analyze Receipt
                                </Text>
                            </TouchableOpacity>
                        )}
                        {error && (
                            <Text className="text-red-500 mt-2 text-center">
                                {error}
                            </Text>
                        )}
                    </View>
                )}

                {/* Extracted Data */}
                {extractedData && (
                    <View className="p-4">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-xl font-bold">
                                Receipt Details
                            </Text>
                            <TouchableOpacity
                                onPress={() => setIsEditing(!isEditing)}
                                className="bg-gray-100 p-2 rounded-full"
                            >
                                <FontAwesome6
                                    name={isEditing ? 'check' : 'pen'}
                                    size={20}
                                    color="#1fddee"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Store Name */}
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-1">
                                Store Name
                            </Text>
                            {isEditing ? (
                                <TextInput
                                    value={extractedData.store_info.name}
                                    onChangeText={(value) =>
                                        setExtractedData((prev) => ({
                                            ...prev!,
                                            store_info: {
                                                ...prev!.store_info,
                                                name: value,
                                            },
                                        }))
                                    }
                                    className="border border-gray-300 rounded-lg p-2"
                                />
                            ) : (
                                <Text className="text-lg">
                                    {extractedData.store_info.name}
                                </Text>
                            )}
                        </View>

                        {/* TIN Number */}
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-1">
                                TIN Number
                            </Text>
                            {isEditing ? (
                                <TextInput
                                    value={extractedData.store_info.tin}
                                    onChangeText={(value) =>
                                        setExtractedData((prev) => ({
                                            ...prev!,
                                            store_info: {
                                                ...prev!.store_info,
                                                tin: value,
                                            },
                                        }))
                                    }
                                    className="border border-gray-300 rounded-lg p-2"
                                    placeholder="Enter TIN number"
                                />
                            ) : (
                                <Text className="text-lg">
                                    {extractedData.store_info.tin ||
                                        'Not available'}
                                </Text>
                            )}
                        </View>

                        {/* Date and Time */}
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-1">
                                Date and Time
                            </Text>
                            {isEditing ? (
                                <View className="flex-row">
                                    <TextInput
                                        value={
                                            extractedData.transaction_info.date
                                        }
                                        onChangeText={(value) =>
                                            setExtractedData((prev) => ({
                                                ...prev!,
                                                transaction_info: {
                                                    ...prev!.transaction_info,
                                                    date: value,
                                                },
                                            }))
                                        }
                                        className="border border-gray-300 rounded-lg p-2 flex-1 mr-2"
                                        placeholder="YYYY-MM-DD"
                                    />
                                    <TextInput
                                        value={
                                            extractedData.transaction_info.time
                                        }
                                        onChangeText={(value) =>
                                            setExtractedData((prev) => ({
                                                ...prev!,
                                                transaction_info: {
                                                    ...prev!.transaction_info,
                                                    time: value,
                                                },
                                            }))
                                        }
                                        className="border border-gray-300 rounded-lg p-2 flex-1"
                                        placeholder="HH:MM:SS"
                                    />
                                </View>
                            ) : (
                                <Text className="text-lg">
                                    {extractedData.transaction_info.date}{' '}
                                    {extractedData.transaction_info.time}
                                </Text>
                            )}
                        </View>

                        {/* Payment Method */}
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-1">
                                Payment Method
                            </Text>
                            {isEditing ? (
                                <TextInput
                                    value={
                                        extractedData.transaction_info
                                            .payment_method
                                    }
                                    onChangeText={(value) =>
                                        setExtractedData((prev) => ({
                                            ...prev!,
                                            transaction_info: {
                                                ...prev!.transaction_info,
                                                payment_method: value,
                                            },
                                        }))
                                    }
                                    className="border border-gray-300 rounded-lg p-2"
                                    placeholder="Cash/Card/GCash/etc."
                                />
                            ) : (
                                <Text className="text-lg">
                                    {extractedData.transaction_info
                                        .payment_method || 'Not specified'}
                                </Text>
                            )}
                        </View>

                        {/* Items */}
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-2">Items</Text>
                            {extractedData.items?.map((item, index) => (
                                <View
                                    key={index}
                                    className="border-b border-gray-200 py-2"
                                >
                                    {isEditing ? (
                                        <View>
                                            <TextInput
                                                value={item.title}
                                                onChangeText={(value) =>
                                                    setExtractedData((prev) => {
                                                        const newItems = [
                                                            ...prev!.items,
                                                        ];
                                                        newItems[index] = {
                                                            ...newItems[index],
                                                            title: value,
                                                        };
                                                        return {
                                                            ...prev!,
                                                            items: newItems,
                                                        };
                                                    })
                                                }
                                                className="border border-gray-300 rounded-lg p-2 mb-1"
                                                placeholder="Item name"
                                            />
                                            <View className="flex-row">
                                                <TextInput
                                                    value={item.quantity}
                                                    onChangeText={(value) =>
                                                        setExtractedData(
                                                            (prev) => {
                                                                const newItems =
                                                                    [
                                                                        ...prev!
                                                                            .items,
                                                                    ];
                                                                newItems[
                                                                    index
                                                                ] = {
                                                                    ...newItems[
                                                                        index
                                                                    ],
                                                                    quantity:
                                                                        value,
                                                                };
                                                                return {
                                                                    ...prev!,
                                                                    items: newItems,
                                                                };
                                                            }
                                                        )
                                                    }
                                                    className="border border-gray-300 rounded-lg p-2 flex-1 mr-2"
                                                    placeholder="Quantity"
                                                    keyboardType="numeric"
                                                />
                                                <TextInput
                                                    value={item.price}
                                                    onChangeText={(value) =>
                                                        setExtractedData(
                                                            (prev) => {
                                                                const newItems =
                                                                    [
                                                                        ...prev!
                                                                            .items,
                                                                    ];
                                                                newItems[
                                                                    index
                                                                ] = {
                                                                    ...newItems[
                                                                        index
                                                                    ],
                                                                    price: value,
                                                                };
                                                                return {
                                                                    ...prev!,
                                                                    items: newItems,
                                                                };
                                                            }
                                                        )
                                                    }
                                                    className="border border-gray-300 rounded-lg p-2 flex-1"
                                                    placeholder="Price"
                                                    keyboardType="numeric"
                                                />
                                            </View>
                                        </View>
                                    ) : (
                                        <View>
                                            <Text className="text-lg">
                                                {item.title}
                                            </Text>
                                            <View className="flex-row justify-between">
                                                <Text className="text-gray-600">
                                                    Qty: {item.quantity}
                                                </Text>
                                                <Text className="text-gray-600">
                                                    ₱{item.price}
                                                </Text>
                                            </View>
                                            <Text className="text-gray-600">
                                                Subtotal: ₱{item.subtotal}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>

                        {/* VAT */}
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-1">
                                VAT (12%)
                            </Text>
                            {isEditing ? (
                                <TextInput
                                    value={extractedData.totals.value_added_tax}
                                    onChangeText={(value) =>
                                        setExtractedData((prev) => ({
                                            ...prev!,
                                            totals: {
                                                ...prev!.totals,
                                                value_added_tax: value,
                                            },
                                        }))
                                    }
                                    className="border border-gray-300 rounded-lg p-2"
                                    keyboardType="numeric"
                                />
                            ) : (
                                <Text className="text-lg">
                                    ₱
                                    {extractedData.totals.value_added_tax ||
                                        '0.00'}
                                </Text>
                            )}
                        </View>

                        {/* Discount */}
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-1">Discount</Text>
                            {isEditing ? (
                                <TextInput
                                    value={extractedData.totals.discount}
                                    onChangeText={(value) =>
                                        setExtractedData((prev) => ({
                                            ...prev!,
                                            totals: {
                                                ...prev!.totals,
                                                discount: value,
                                            },
                                        }))
                                    }
                                    className="border border-gray-300 rounded-lg p-2"
                                    keyboardType="numeric"
                                />
                            ) : (
                                <Text className="text-lg">
                                    ₱{extractedData.totals.discount || '0.00'}
                                </Text>
                            )}
                        </View>

                        {/* Total Amount */}
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-1">
                                Total Amount
                            </Text>
                            {isEditing ? (
                                <TextInput
                                    value={
                                        extractedData.totals.total_expediture
                                    }
                                    onChangeText={(value) =>
                                        setExtractedData((prev) => ({
                                            ...prev!,
                                            totals: {
                                                ...prev!.totals,
                                                total_expediture: value,
                                            },
                                        }))
                                    }
                                    className="border border-gray-300 rounded-lg p-2"
                                    keyboardType="numeric"
                                />
                            ) : (
                                <Text className="text-xl font-bold">
                                    ₱{extractedData.totals.total_expediture}
                                </Text>
                            )}
                        </View>

                        {/* Category */}
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-1">Category</Text>
                            {isEditing ? (
                                <TextInput
                                    value={
                                        extractedData.metadata
                                            .transaction_category
                                    }
                                    onChangeText={(value) =>
                                        setExtractedData((prev) => ({
                                            ...prev!,
                                            metadata: {
                                                ...prev!.metadata,
                                                transaction_category: value,
                                            },
                                        }))
                                    }
                                    className="border border-gray-300 rounded-lg p-2"
                                    placeholder="FOOD/TRANSPORTATION/ENTERTAINMENT/OTHER"
                                />
                            ) : (
                                <Text className="text-lg">
                                    {
                                        extractedData.metadata
                                            .transaction_category
                                    }
                                </Text>
                            )}
                        </View>

                        {/* Deductibility Status */}
                        <View className="mb-4">
                            <Text className="text-gray-600 mb-1">
                                Deductibility Status
                            </Text>
                            <View className="flex-row items-center">
                                <Text className="text-lg mr-2">
                                    {extractedData.metadata.is_deductible
                                        ? 'Deductible'
                                        : 'Non-deductible'}
                                </Text>
                                {extractedData.metadata.is_deductible && (
                                    <Text className="text-lg text-green-600">
                                        (₱
                                        {
                                            extractedData.metadata
                                                .deductible_amount
                                        }
                                        )
                                    </Text>
                                )}
                            </View>
                        </View>

                        {/* Save Button */}
                        <TouchableOpacity
                            onPress={handleSave}
                            className="bg-primary py-3 rounded-lg flex-row justify-center items-center mt-4"
                        >
                            <FontAwesome6
                                name="save"
                                size={20}
                                color="white"
                                className="mr-2"
                            />
                            <Text className="text-white font-semibold text-lg">
                                Save Receipt
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default AnalyzeReceiptScreen;
