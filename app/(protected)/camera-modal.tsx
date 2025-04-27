import React, {useState, useEffect} from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View, Alert, Text, TextInput, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import GoBackRoute from '@/components/GoBackRoute';
import { FontAwesome6 } from '@expo/vector-icons';
import { cameraService } from '@/services/api/camera';

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


const CameraModalScreen = () => {
    const { pictureUri } = useLocalSearchParams();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleAnalyze = async () => {
        try {
            setIsAnalyzing(true);
            const response = await cameraService.processReceipt(pictureUri as string);
            
            if (response.success && response.data) {
                setExtractedData(response.data);
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

    const handleSave = () => {
        // TODO: Save the edited data
        router.push({
            pathname: '/(protected)/(tabs)/home',
            params: { receipt_data: JSON.stringify(extractedData) }
        });
    };

    const updateField = (field: keyof ExtractedData, value: string) => {
        setExtractedData(prev => prev ? { ...prev, [field]: value } : null);
    };

    const updateItem = (index: number, field: keyof ExtractedData['items'][0], value: string) => {
        setExtractedData(prev => {
            if (!prev || !prev.items) return prev;
            const newItems = [...prev.items];
            newItems[index] = { ...newItems[index], [field]: value };
            return { ...prev, items: newItems };
        });
    };

    if (extractedData) {
        return (
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
        )
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
