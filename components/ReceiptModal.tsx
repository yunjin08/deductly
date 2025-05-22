import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { formatDate } from '@/utils/formatDate';

interface ReceiptModalProps {
    isVisible: boolean;
    onClose: () => void;
    receipt: {
        title: string;
        category: string;
        total_expenditure: number;
        created_at: string;
        is_deductible: boolean;
        deductible_amount?: number;
        // Add more fields as needed
    } | null;
}

export const ReceiptModal = ({ isVisible, onClose, receipt }: ReceiptModalProps) => {
    if (!receipt) return null;

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-white rounded-t-3xl h-[80%]">
                    {/* Header */}
                    <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                        <Text className="text-xl font-bold">Receipt Details</Text>
                        <TouchableOpacity onPress={onClose}>
                            <FontAwesome6 name="xmark" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <ScrollView className="p-4">
                        <View className="space-y-4">
                            <View className="bg-gray-50 p-4 rounded-xl">
                                <Text className="text-gray-500 text-sm">Title</Text>
                                <Text className="text-lg font-semibold">{receipt.title}</Text>
                            </View>

                            <View className="bg-gray-50 p-4 rounded-xl">
                                <Text className="text-gray-500 text-sm">Category</Text>
                                <Text className="text-lg font-semibold">{receipt.category}</Text>
                            </View>

                            <View className="bg-gray-50 p-4 rounded-xl">
                                <Text className="text-gray-500 text-sm">Total Amount</Text>
                                <Text className="text-lg font-semibold">P{receipt.total_expenditure}</Text>
                            </View>

                            <View className="bg-gray-50 p-4 rounded-xl">
                                <Text className="text-gray-500 text-sm">Date</Text>
                                <Text className="text-lg font-semibold">{formatDate(receipt.created_at)}</Text>
                            </View>

                            {/* Deductibles Section */}
                            <View className="bg-gray-50 p-4 rounded-xl">
                                <Text className="text-gray-500 text-sm mb-2">Deductibles</Text>
                                
                                {/* Status */}
                                <View className="flex-row justify-between items-center mb-2">
                                    <Text className="text-gray-600">Status</Text>
                                    <View className="flex-row items-center">
                                        <Text className="mr-2 text-gray-800">
                                            {receipt.is_deductible ? 'Eligible' : 'Not Eligible'}
                                        </Text>
                                        <FontAwesome6 
                                            name={receipt.is_deductible ? "circle-check" : "circle-xmark"} 
                                            size={20} 
                                            color={receipt.is_deductible ? "#22c55e" : "#ef4444"} 
                                        />
                                    </View>
                                </View>

                                {/* Category */}
                                <View className="flex-row justify-between items-center mb-2">
                                    <Text className="text-gray-600">Category</Text>
                                    <Text className="text-gray-800">{receipt.category}</Text>
                                </View>

                                {/* Deductible Amount */}
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-gray-600">Deductible Amount</Text>
                                    <Text className="text-gray-800 font-semibold">₱{receipt.deductible_amount || '0.00'}</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}; 