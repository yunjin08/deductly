import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

// ReceiptItem interface for the items property
interface ReceiptItem {
    id: number;
    title: string;
    quantity: number;
    price: string;
    subtotal_expenditure: string;
    deductable_amount: string;
    date_created: string;
    date_updated: string;
    receipt: number;
}

// Custom interface that extends Receipt for our specific use case
interface ReceiptDetails {
    id: string;
    title: string;
    user_id?: string;
    category: 'UTILITIES' | 'FOOD' | 'TRANSPORTATION' | 'ENTERTAINMENT' | 'OTHER';
    items?: ReceiptItem[];
    total_expenditure: string;
    created_at: string;
    updated_at: string;
    payment_method: string;
    discount: string;
    value_added_tax: string;
    is_deductible: boolean;
    deductible_amount: string;
}

interface ReceiptDetailsModalProps {
    isVisible: boolean;
    onClose: () => void;
    receipt: ReceiptDetails | null;
}

export const ReceiptDetailsModal = ({
    isVisible,
    onClose,
    receipt,
}: ReceiptDetailsModalProps) => {

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
            supportedOrientations={['portrait', 'landscape']}
        >
            <View className="flex-1 bg-black/50">
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={onClose}
                    className="absolute top-0 left-0 right-0 bottom-0"
                />

                <View className="mt-24 mx-4 bg-white rounded-xl overflow-hidden">
                    {/* Custom header with close button */}
                    <View className="w-full bg-primary py-3 px-4 flex-row justify-between items-center">
                        <Text className="text-xl font-bold text-white">
                            Receipt Details
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <FontAwesome6
                                name="times"
                                size={24}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>

                    {receipt ? (
                        <ScrollView className="p-4" style={{ maxHeight: 600 }}>
                            {/* Receipt Image Placeholder */}
                            <View className="w-full h-44 bg-gray-100 items-center justify-center mb-4 rounded-lg">
                                <FontAwesome6
                                    name="receipt"
                                    size={48}
                                    color="#A0A0A0"
                                />
                            </View>

                            {/* Receipt Details */}
                            <View className="mb-6">
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">Date</Text>
                                    <Text>
                                        {receipt.created_at
                                            ? formatDate(receipt.created_at)
                                            : 'N/A'}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">
                                        Category
                                    </Text>
                                    <Text>{receipt.category || 'N/A'}</Text>
                                </View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">
                                        Payment Method
                                    </Text>
                                    <Text>
                                        {receipt.payment_method || 'N/A'}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">
                                        Total Spendings
                                    </Text>
                                    <Text>
                                        ₱{receipt.total_expenditure || '0.00'}
                                    </Text>
                                </View>
                            </View>

                            {/* Deductibles Section */}
                            <View className="mb-6">
                                <Text className="text-lg font-bold mb-3">Deductibles</Text>
                                
                                {/* Status */}
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">Status</Text>
                                    <View className="flex-row items-center">
                                        <Text className="mr-2">
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
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">Category</Text>
                                    <Text>{receipt.category || 'OTHER'}</Text>
                                </View>

                                {/* Deductible Amount */}
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">Deductible Amount</Text>
                                    <Text className="font-semibold">₱{receipt.deductible_amount || '0.00'}</Text>
                                </View>
                            </View>

                            {/* Receipt Breakdown */}
                            <Text className="text-lg font-bold mb-3">
                                Receipt Breakdown
                            </Text>
                            <View className="flex-row mb-2">
                                <Text className="w-1/6 font-medium text-gray-500">
                                    QTY
                                </Text>
                                <Text className="w-3/6 font-medium text-gray-500">
                                    DESCRIPTION
                                </Text>
                                <Text className="w-2/6 font-medium text-gray-500 text-right">
                                    COST
                                </Text>
                            </View>

                            {/* Receipt Items */}
                            {receipt.items && receipt.items.length > 0 ? (
                                receipt.items.map((item: ReceiptItem) => (
                                    <View
                                        key={item.id}
                                        className="flex-row mb-2"
                                    >
                                        <Text className="w-1/6">
                                            {item.quantity}
                                        </Text>
                                        <Text className="w-3/6">
                                            {item.title}
                                        </Text>
                                        <Text className="w-2/6 text-right">
                                            ₱{item.subtotal_expenditure}
                                        </Text>
                                    </View>
                                ))
                            ) : (
                                <View className="flex-row mb-2">
                                    <Text className="text-gray-500 italic">
                                        No items available
                                    </Text>
                                </View>
                            )}

                            {/* Additional Details */}
                            <View className="mt-4 pt-4 border-t border-gray-200 mb-6">
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">
                                        Discount
                                    </Text>
                                    <Text>₱{receipt.discount || '0.00'}</Text>
                                </View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">VAT</Text>
                                    <Text>
                                        ₱{receipt.value_added_tax || '0.00'}
                                    </Text>
                                </View>
                            </View>
                        </ScrollView>
                    ) : (
                        <View className="items-center justify-center p-8">
                            <Text className="text-lg text-gray-500">
                                No receipt data available
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};
