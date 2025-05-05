import { View, Text, Modal, TouchableOpacity, Linking } from 'react-native';
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
        >
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white w-[90%] max-h-[80%] rounded-xl p-5">
                    {/* Modal Header */}
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-xl font-bold">
                            Document Details
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <FontAwesome6 name="times" size={20} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {document && (
                        <ScrollableLayout>
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
                                    <Text>{document.title}</Text>
                                </View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">Type</Text>
                                    <Text>{document.type}</Text>
                                </View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">
                                        Created Date
                                    </Text>
                                    <Text>
                                        {formatDate(document.created_at)}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-500">
                                        Updated Date
                                    </Text>
                                    <Text>
                                        {formatDate(document.updated_at)}
                                    </Text>
                                </View>
                            </View>

                            {/* View Document Button */}
                            <TouchableOpacity
                                onPress={() =>
                                    openDocument(document.document_url)
                                }
                                className="bg-primary py-4 rounded-xl mt-4"
                            >
                                <Text className="text-white text-center font-semibold">
                                    View Document
                                </Text>
                            </TouchableOpacity>
                        </ScrollableLayout>
                    )}
                </View>
            </View>
        </Modal>
    );
};
