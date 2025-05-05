import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { ScrollableLayout } from './ScrollableLayout';
import { Receipt } from '@/interfaces';

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
    category: string;
    items?: ReceiptItem[];
    total_expenditure: string;
    created_at: string;
    updated_at: string;
    payment_method: string;
    discount: string;
    value_added_tax: string;
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
        >
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white w-[90%] max-h-[80%] rounded-xl p-5">
                    {/* Modal Header */}
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-xl font-bold">
                            Receipt Item Details
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <FontAwesome6 name="times" size={20} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {receipt && (
                        <ScrollableLayout>
                            {/* Receipt Image Placeholder */}
                            <View className="w-full h-44 bg-gray-100 items-center justify-center mb-4 rounded-lg">
                                <FontAwesome6
                                    name="image"
                                    size={32}
                                    color="#A0A0A0"
                                />
                            </View>

                            {/* Receipt Details */}
                            <View className="mb-6">
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">Date</Text>
                                    <Text>
                                        {formatDate(receipt.created_at)}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">
                                        Category
                                    </Text>
                                    <Text>{receipt.category}</Text>
                                </View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">
                                        Payment Method
                                    </Text>
                                    <Text>{receipt.payment_method}</Text>
                                </View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">
                                        Total Spendings
                                    </Text>
                                    <Text>₱{receipt.total_expenditure}</Text>
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
                            {receipt.items &&
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
                                ))}

                            {/* Additional Details */}
                            <View className="mt-4 pt-4 border-t border-gray-200">
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">
                                        Discount
                                    </Text>
                                    <Text>₱{receipt.discount}</Text>
                                </View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">VAT</Text>
                                    <Text>₱{receipt.value_added_tax}</Text>
                                </View>
                            </View>
                        </ScrollableLayout>
                    )}
                </View>
            </View>
        </Modal>
    );
};
