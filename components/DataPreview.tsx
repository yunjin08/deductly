import { useState, useEffect } from 'react';
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
import { ReceiptDetailsModal } from './ReceiptDetailsModal';
import { DocumentDetailsModal } from './DocumentDetailsModal';
import { ReportDetailsModal } from './ReportDetailsModal';
import { ReportGraph } from './ReportGraph';
import { formatDate } from '@/utils/formatDate';
import { router } from 'expo-router';

// Custom interface that extends Receipt for our specific use case
interface ReceiptDetails {
    id: string;
    title: string;
    user_id?: string;
    category: string;
    items?: any[];
    total_expediture: string;
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

type TimePeriod = 'weekly' | 'monthly' | 'yearly';
type SortOrder = 'latest' | 'oldest';

const EmptyReceiptsState = () => (
    <View className="flex-1 items-center justify-center">
        <View className="bg-primary/10 p-4 rounded-full mb-4">
            <FontAwesome6 name="receipt" size={32} color="#1fddee" />
        </View>
        <Text className="text-xl font-semibold text-gray-800 mb-2">
            No Receipts Yet
        </Text>
        <Text className="text-gray-500 text-center px-8">
            Start scanning your receipts to keep track of your expenses
        </Text>
        <TouchableOpacity
            onPress={() => router.push('/(protected)/(camera)/camera')}
            className="mt-4 border border-primary rounded-full px-6 py-2"
        >
            <Text className="text-primary font-semibold">
                Scan Your First Receipt
            </Text>
        </TouchableOpacity>
    </View>
);

const EmptyDocumentsState = () => (
    <View className="flex-1 items-center justify-center">
        <View className="bg-primary/10 p-4 rounded-full mb-4">
            <FontAwesome6 name="file-pdf" size={32} color="#1fddee" />
        </View>
        <Text className="text-xl font-semibold text-gray-800 mb-2">
            No Documents Yet
        </Text>
        <Text className="text-gray-500 text-center px-8">
            Start scanning your receipts to generate tax documents
        </Text>
        <TouchableOpacity
            onPress={() => router.push('/(protected)/(camera)/camera')}
            className="mt-4 border border-primary rounded-full px-6 py-2"
        >
            <Text className="text-primary font-semibold">
                Scan Receipts to Generate Documents
            </Text>
        </TouchableOpacity>
    </View>
);

const EmptyReportsState = () => (
    <View className="flex-1 items-center justify-center">
        <View className="bg-primary/10 p-4 rounded-full mb-4">
            <FontAwesome6 name="chart-line" size={32} color="#1fddee" />
        </View>
        <Text className="text-xl font-semibold text-gray-800 mb-2">
            No Reports Yet
        </Text>
        <Text className="text-gray-500 text-center px-8">
            Start scanning your receipts to generate tax reports
        </Text>
        <TouchableOpacity
            onPress={() => router.push('/(protected)/(camera)/camera')}
            className="mt-4 border border-primary rounded-full px-6 py-2"
        >
            <Text className="text-primary font-semibold">
                Scan Receipts to Generate Reports
            </Text>
        </TouchableOpacity>
    </View>
);

export const DataPreview = ({
    data,
    title,
    selectionTitle,
    itemType,
    onGenerateDocument,
    generateButtonText = 'Generate Tax Document',
}: DataPreviewProps) => {
    // Debug log to check incoming data
    // console.log(`DataPreview received ${data.length} ${itemType} items:`, data);

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
    const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('monthly');
    const [sortOrder, setSortOrder] = useState<SortOrder>('latest');
    const [filteredData, setFilteredData] = useState(data);

    useEffect(() => {
        let processedData = [...(data || [])];

        if (itemType === 'report') {
            processedData = processedData.filter((item: any) => {
                return item?.category?.toLowerCase() === selectedPeriod;
            });
        }

        // Sort by created_at date
        processedData.sort((a: any, b: any) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
        });

        setFilteredData(processedData);
    }, [selectedPeriod, sortOrder, data, itemType]);

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
            console.log('Item clicked:', item); // Debug log

            // Make sure the item is an object with an id before proceeding
            if (!item || typeof item !== 'object' || !item.id) {
                console.error('Invalid item clicked:', item);
                return;
            }

            if (itemType === 'receipt') {
                console.log('Setting receipt:', item); // Debug log
                setSelectedReceipt(item as ReceiptDetails);
                setReceiptModalVisible(true);
            } else if (itemType === 'document') {
                console.log('Setting document:', item); // Debug log
                setSelectedDocument(item as DocumentDetails);
                setDocumentModalVisible(true);
            } else if (itemType === 'report') {
                console.log('Setting report:', item); // Debug log
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

    const TimePeriodButton = ({
        period,
        label,
        className = '',
    }: {
        period: TimePeriod;
        label: string;
        className?: string;
    }) => (
        <TouchableOpacity
            onPress={() => setSelectedPeriod(period)}
            className={`px-4 py-2 ${
                selectedPeriod === period ? 'bg-primary' : 'bg-gray-200'
            } ${className}`}
        >
            <Text
                className={`font-medium ${
                    selectedPeriod === period ? 'text-white' : 'text-gray-700'
                }`}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );

    const SortButton = ({
        order,
        label,
        className = '',
    }: {
        order: SortOrder;
        label: string;
        className?: string;
    }) => (
        <TouchableOpacity
            onPress={() => setSortOrder(order)}
            className={`px-4 py-2 ${
                sortOrder === order ? 'bg-primary' : 'bg-gray-200'
            } ${className}`}
        >
            <Text
                className={`font-medium ${
                    sortOrder === order ? 'text-white' : 'text-gray-700'
                }`}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );

    const renderHeader = () => (
        <>
            <Header />
            <View className="flex-row justify-between items-center mb-4">
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
            {itemType === 'report' && (
                <>
                    {data && data.length > 0 && (
                        <ReportGraph
                            reports={data?.filter(
                                (item): item is ReportDetails =>
                                    'start_date' in item &&
                                    'end_date' in item &&
                                    'grand_total_expenditure' in item &&
                                    'total_tax_deductions' in item
                            )}
                        />
                    )}
                    {data && data.length > 0 && (
                        <View className="flex-row justify-center space-x-2 mb-4">
                            <TimePeriodButton
                                period="weekly"
                                label="Weekly"
                                className="rounded-l-lg"
                            />
                            <TimePeriodButton period="monthly" label="Monthly" />
                            <TimePeriodButton
                                period="yearly"
                                label="Yearly"
                                className="rounded-r-lg"
                            />
                        </View>
                    )}
                </>
            )}
            {(itemType === 'document' || itemType === 'receipt') &&
                data &&
                data.length > 0 && (
                    <View className="flex-row justify-center space-x-2 mb-4">
                        <SortButton
                            order="latest"
                        label="Latest"
                        className="rounded-l-lg"
                    />
                    <SortButton
                        order="oldest"
                        label="Oldest"
                        className="rounded-r-lg"
                    />
                </View>
            )}
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
                    <Text className="text-gray-500">
                        {formatDate(item.created_at)}
                    </Text>
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

    const renderEmptyState = () => {
        if (!data || data.length === 0) {
            return (
                <View className="h-[75%]">
                    {itemType === 'receipt' && <EmptyReceiptsState />}
                    {itemType === 'document' && <EmptyDocumentsState />}
                    {itemType === 'report' && <EmptyReportsState />}
                </View>
            );
        }
        return null;
    };

    return (
        <ScrollableLayout>
            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmptyState}
                ItemSeparatorComponent={() => <View className="h-2" />}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
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
