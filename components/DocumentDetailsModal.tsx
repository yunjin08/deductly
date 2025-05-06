import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Linking,
    ScrollView,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { ScrollableLayout } from './ScrollableLayout';
import { Document } from '@/interfaces';

// Custom interface that extends Document for our specific use case
interface DocumentDetails {
    id: string;
    document_id?: string; // In case the API uses document_id
    title: string;
    document_url: string;
    type: string;
    created_at: string;
    updated_at: string;
}

interface DocumentDetailsModalProps {
    isVisible: boolean;
    onClose: () => void;
    document: DocumentDetails | null;
}

export const DocumentDetailsModal = ({
    isVisible,
    onClose,
    document,
}: DocumentDetailsModalProps) => {
    console.log('DocumentDetailsModal received document:', document); // Debug log

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const openDocument = (url: string) => {
        Linking.openURL(url);
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
                            Document Details
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <FontAwesome6
                                name="times"
                                size={24}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>

                    {document ? (
                        <ScrollView className="p-4" style={{ maxHeight: 600 }}>
                            {/* Document Icon */}
                            <View className="w-full h-44 bg-gray-100 items-center justify-center mb-4 rounded-lg">
                                <FontAwesome6
                                    name="file-pdf"
                                    size={48}
                                    color="#e74c3c"
                                />
                            </View>

                            {/* Document Details */}
                            <View className="mb-6">
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">Title</Text>
                                    <Text>{document.title || 'Untitled'}</Text>
                                </View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">Type</Text>
                                    <Text>{document.type || 'N/A'}</Text>
                                </View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">
                                        Created Date
                                    </Text>
                                    <Text>
                                        {document.created_at
                                            ? formatDate(document.created_at)
                                            : 'N/A'}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">
                                        Updated Date
                                    </Text>
                                    <Text>
                                        {document.updated_at
                                            ? formatDate(document.updated_at)
                                            : 'N/A'}
                                    </Text>
                                </View>
                            </View>

                            {/* View Document Button */}
                            {document.document_url ? (
                                <TouchableOpacity
                                    onPress={() =>
                                        openDocument(document.document_url)
                                    }
                                    className="bg-primary py-4 rounded-xl mt-4 mb-6"
                                >
                                    <Text className="text-white text-center font-semibold">
                                        View Document
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <View className="bg-gray-200 py-4 rounded-xl mt-4 mb-6">
                                    <Text className="text-gray-500 text-center font-semibold">
                                        Document URL Not Available
                                    </Text>
                                </View>
                            )}
                        </ScrollView>
                    ) : (
                        <View className="items-center justify-center p-8">
                            <Text className="text-lg text-gray-500">
                                No document data available
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};
