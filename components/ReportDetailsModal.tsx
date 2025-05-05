import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { ScrollableLayout } from './ScrollableLayout';

interface ReportDetails {
    id: string;
    title: string;
    category: string;
    start_date: string;
    end_date: string;
    grand_total_expenditure: string;
    total_tax_deductions: string;
    created_at: string;
    updated_at: string;
}

interface ReportDetailsModalProps {
    isVisible: boolean;
    onClose: () => void;
    report: ReportDetails | null;
}

export const ReportDetailsModal = ({
    isVisible,
    onClose,
    report,
}: ReportDetailsModalProps) => {
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
                            Report Details
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <FontAwesome6 name="times" size={20} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {report && (
                        <ScrollableLayout>
                            {/* Report Icon */}
                            <View className="w-full h-44 bg-gray-100 items-center justify-center mb-4 rounded-lg">
                                <FontAwesome6
                                    name="chart-line"
                                    size={48}
                                    color="#3498db"
                                />
                            </View>

                            {/* Report Details */}
                            <View className="mb-6">
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">Title</Text>
                                    <Text>{report.title}</Text>
                                </View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">
                                        Category
                                    </Text>
                                    <Text>{report.category}</Text>
                                </View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">
                                        Report Period
                                    </Text>
                                    <Text>
                                        {formatDate(report.start_date)} -{' '}
                                        {formatDate(report.end_date)}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">
                                        Created Date
                                    </Text>
                                    <Text>{formatDate(report.created_at)}</Text>
                                </View>
                            </View>

                            {/* Report Summary */}
                            <Text className="text-lg font-bold mb-3">
                                Financial Summary
                            </Text>

                            <View className="bg-gray-50 rounded-lg p-4 mb-4">
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">
                                        Total Expenditure
                                    </Text>
                                    <Text className="font-semibold">
                                        ₱{report.grand_total_expenditure}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">
                                        Tax Deductions
                                    </Text>
                                    <Text className="font-semibold text-green-600">
                                        ₱{report.total_tax_deductions}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between pt-2 mt-2 border-t border-gray-200">
                                    <Text className="font-semibold">
                                        Net Expenditure
                                    </Text>
                                    <Text className="font-bold">
                                        ₱
                                        {(
                                            parseFloat(
                                                report.grand_total_expenditure
                                            ) -
                                            parseFloat(
                                                report.total_tax_deductions
                                            )
                                        ).toFixed(2)}
                                    </Text>
                                </View>
                            </View>

                            {/* Export Report Button */}
                            <TouchableOpacity className="bg-primary py-4 rounded-xl mt-4">
                                <Text className="text-white text-center font-semibold">
                                    Export Report
                                </Text>
                            </TouchableOpacity>
                        </ScrollableLayout>
                    )}
                </View>
            </View>
        </Modal>
    );
};
