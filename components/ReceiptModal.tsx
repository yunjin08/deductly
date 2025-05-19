import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { formatDate } from '@/utils/formatDate';

interface ReceiptModalProps {
    isVisible: boolean;
    onClose: () => void;
    receipt: {
        title: string;
        category: string;
        total_expediture: number;
        created_at: string;
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
                                <Text className="text-lg font-semibold">P{receipt.total_expediture}</Text>
                            </View>

                            <View className="bg-gray-50 p-4 rounded-xl">
                                <Text className="text-gray-500 text-sm">Date</Text>
                                <Text className="text-lg font-semibold">{formatDate(receipt.created_at)}</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}; 