import { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Pressable,
    FlatList,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { ScrollableLayout } from './ScrollableLayout';
import Header from '@/components/Header';
import { Receipt, Document } from '@/interfaces';
import { ReceiptDetailsModal } from './ReceiptDetailsModal';
import { DocumentDetailsModal } from './DocumentDetailsModal';
import { ReportDetailsModal } from './ReportDetailsModal';

// Custom interface that extends Receipt for our specific use case
interface ReceiptDetails {
    id: string;
    title: string;
    user_id?: string;
    category: string;
    items?: any[];
    total_expenditure: string;
    created_at: string;
    updated_at: string;
    payment_method: string;
    discount: string;
    value_added_tax: string;
}

// Custom interface for Document
interface DocumentDetails {
    id: string;
    document_id?: string; // In case the API uses document_id
    title: string;
    document_url: string;
    type: string;
    created_at: string;
    updated_at: string;
}

// Custom interface for Report
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

// Union type for items that can be displayed
type ItemDetails = ReceiptDetails | DocumentDetails | ReportDetails;

interface DataPreviewProps {
    data: ItemDetails[];
    title: string;
    selectionTitle: string;
    itemType: 'receipt' | 'document' | 'report';
    onGenerateDocument?: () => void;
    generateButtonText?: string;
}

export const DataPreview = ({
    data,
    title,
    selectionTitle,
    itemType,
    onGenerateDocument,
    generateButtonText = 'Generate Tax Document',
}: DataPreviewProps) => {
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [receiptModalVisible, setReceiptModalVisible] = useState(false);
    const [documentModalVisible, setDocumentModalVisible] = useState(false);
    const [reportModalVisible, setReportModalVisible] = useState(false);
    const [selectedReceipt, setSelectedReceipt] =
        useState<ReceiptDetails | null>(null);
    const [selectedDocument, setSelectedDocument] =
        useState<DocumentDetails | null>(null);
    const [selectedReport, setSelectedReport] = useState<ReportDetails | null>(
        null
    );

    const handleLongPress = (id: number) => {
        setIsSelectionMode(true);
        setSelectedItems([id]);
    };

    const handlePress = (id: number, item: ItemDetails) => {
        if (isSelectionMode) {
            if (selectedItems.includes(id)) {
                const newSelected = selectedItems.filter((item) => item !== id);
                setSelectedItems(newSelected);
                if (newSelected.length === 0) {
                    setIsSelectionMode(false);
                }
            } else {
                setSelectedItems([...selectedItems, id]);
            }
        } else {
            // Show modal with details based on item type
            if (itemType === 'receipt') {
                setSelectedReceipt(item as ReceiptDetails);
                setReceiptModalVisible(true);
            } else if (itemType === 'document') {
                setSelectedDocument(item as DocumentDetails);
                setDocumentModalVisible(true);
            } else if (itemType === 'report') {
                setSelectedReport(item as ReportDetails);
                setReportModalVisible(true);
            }
        }
    };

    const handleDelete = () => {
        // Implement delete functionality here
        setSelectedItems([]);
        setIsSelectionMode(false);
    };

    const renderHeader = () => (
        <>
            <Header />
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-2xl w-full text-center font-bold">
                    {isSelectionMode ? selectionTitle : title}
                </Text>
                {isSelectionMode && selectedItems.length > 0 && (
                    <TouchableOpacity
                        onPress={handleDelete}
                        className="flex-row items-center gap-2"
                    >
                        <FontAwesome6 name="trash" size={20} color="red" />
                    </TouchableOpacity>
                )}
            </View>
        </>
    );

    const renderItem = ({ item }: { item: ItemDetails }) => {
        const isSelected = selectedItems.includes(Number(item.id));

        // Different icon based on item type
        let iconName = 'receipt';
        let iconColor = '#A0A0A0';

        if (itemType === 'document') {
            iconName = 'file-pdf';
            iconColor = '#e74c3c';
        } else if (itemType === 'report') {
            iconName = 'chart-line';
            iconColor = '#3498db';
        }

        return (
            <Pressable
                onLongPress={() => handleLongPress(Number(item.id))}
                onPress={() => handlePress(Number(item.id), item)}
                className={`flex-row items-center pr-4 rounded-xl mb-2 ${
                    isSelected ? 'bg-gray-200' : 'bg-gray-50'
                }`}
            >
                <View className="w-24 h-24 bg-gray-200 rounded-lg rounded-r-none items-center justify-center mr-4">
                    <FontAwesome6 name={iconName} size={24} color={iconColor} />
                </View>
                <View className="flex-1">
                    <Text className="text-base font-medium">{item.title}</Text>
                    <Text className="text-gray-500">{item.created_at}</Text>
                </View>
                {isSelectionMode && (
                    <View
                        className={`w-6 h-6 rounded-full border-2 ${
                            isSelected
                                ? 'bg-primary border-primary'
                                : 'border-gray-300'
                        } items-center justify-center`}
                    >
                        {isSelected && (
                            <FontAwesome6
                                name="check"
                                size={12}
                                color="white"
                            />
                        )}
                    </View>
                )}
            </Pressable>
        );
    };

    return (
        <ScrollableLayout>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                ListHeaderComponent={renderHeader}
                ItemSeparatorComponent={() => <View className="h-2" />}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
            />
            {isSelectionMode && (
                <TouchableOpacity
                    onPress={onGenerateDocument}
                    className="bg-primary py-4 rounded-xl mt-4"
                >
                    <Text className="text-white text-center font-semibold">
                        {generateButtonText}
                    </Text>
                </TouchableOpacity>
            )}

            {/* Receipt Details Modal */}
            <ReceiptDetailsModal
                isVisible={receiptModalVisible}
                onClose={() => setReceiptModalVisible(false)}
                receipt={selectedReceipt}
            />

            {/* Document Details Modal */}
            <DocumentDetailsModal
                isVisible={documentModalVisible}
                onClose={() => setDocumentModalVisible(false)}
                document={selectedDocument}
            />

            {/* Report Details Modal */}
            <ReportDetailsModal
                isVisible={reportModalVisible}
                onClose={() => setReportModalVisible(false)}
                report={selectedReport}
            />
        </ScrollableLayout>
    );
};
