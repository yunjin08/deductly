import { View, Text, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { ScrollableLayout } from './ScrollableLayout';
import { exportReportToPDF } from './ReportExport';

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
    console.log('ReportDetailsModal received report:', report); // Debug log

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const handleExportReport = async () => {
        if (!report) {
            Alert.alert('Error', 'No report data available to export');
            return;
        }

        try {
            const success = await exportReportToPDF(report);
            if (success) {
                // The exportReportToPDF function already shows success alerts
                console.log('Report exported successfully');
            }
        } catch (error) {
            console.error('Failed to export report:', error);
            Alert.alert('Export Failed', 'There was an error exporting your report');
        }
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
                            Report Details
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <FontAwesome6
                                name="times"
                                size={24}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>

                    {report ? (
                        <ScrollView className="p-4" style={{ maxHeight: 600 }}>
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
                                    <Text>{report.title || 'Untitled'}</Text>
                                </View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">
                                        Category
                                    </Text>
                                    <Text>{report.category || 'N/A'}</Text>
                                </View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">
                                        Report Period
                                    </Text>
                                    <Text>
                                        {report.start_date
                                            ? formatDate(report.start_date)
                                            : 'N/A'}{' '}
                                        -{' '}
                                        {report.end_date
                                            ? formatDate(report.end_date)
                                            : 'N/A'}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">
                                        Created Date
                                    </Text>
                                    <Text>
                                        {report.created_at
                                            ? formatDate(report.created_at)
                                            : 'N/A'}
                                    </Text>
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
                                        ₱
                                        {report.grand_total_expenditure ||
                                            '0.00'}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">
                                        Tax Deductions
                                    </Text>
                                    <Text className="font-semibold text-green-600">
                                        ₱{report.total_tax_deductions || '0.00'}
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
                                                report.grand_total_expenditure ||
                                                    '0'
                                            ) -
                                            parseFloat(
                                                report.total_tax_deductions ||
                                                    '0'
                                            )
                                        ).toFixed(2)}
                                    </Text>
                                </View>
                            </View>

                            {/* Export Report Button */}
                            <TouchableOpacity
                                onPress={handleExportReport}
                                className="bg-primary py-4 rounded-xl mt-4 mb-6"
                            >
                                <Text className="text-white text-center font-semibold">
                                    Export Report
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    ) : (
                        <View className="items-center justify-center p-8">
                            <Text className="text-lg text-gray-500">
                                No report data available
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};
