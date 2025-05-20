import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { Link, router } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { ScrollableLayout } from '@/components/ScrollableLayout';
import Header from '@/components/Header';
import { useAppDispatch } from '@/hooks/useAuthHooks';
import { useSelector } from 'react-redux';
import { fetchReceipts } from '@/contexts/actions/receiptsActions';
import { useEffect, useState } from 'react';
import { fetchDocuments } from '@/contexts/actions/documentsActions';
import { formatDate } from '@/utils/formatDate';

const EmptyReceiptsState = () => (
    <View className="items-center justify-center py-8">
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
    <View className="items-center justify-center py-8">
        <View className="bg-primary/10 p-4 rounded-full mb-4">
            <FontAwesome6 name="file-pdf" size={32} color="#1fddee" />
        </View>
        <Text className="text-xl font-semibold text-gray-800 mb-2">
            No Documents Yet
        </Text>
        <Text className="text-gray-500 text-center px-8">
            Upload your documents to keep them organized and accessible
        </Text>
        <TouchableOpacity
            onPress={() => router.push('/(protected)/(tabs)/documents')}
            className="mt-4 border border-primary rounded-full px-6 py-2"
        >
            <Text className="text-primary font-semibold">
                Upload Your First Document
            </Text>
        </TouchableOpacity>
    </View>
);

const HomeScreen = () => {
    const dispatch = useAppDispatch();
    const receipts = useSelector((state: any) => state.receipts.receipts);
    const documents = useSelector((state: any) => state.documents.documents);
    const [isLoading, setIsLoading] = useState(true);

    console.log(receipts.objects);

    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([
                    dispatch(fetchReceipts()),
                    dispatch(fetchDocuments()),
                ]);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [dispatch]);

    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                }}
            >
                <ActivityIndicator size="large" color="#1fddee" />
            </View>
        );
    }

    const renderReceiptsSection = () => {
        const recentReceipts = receipts?.objects?.slice(0, 5) || [];

        return (
            <View className="mt-8">
                <View className="flex-row justify-between mb-2 items-center">
                    <Text className="text-xl font-bold">Your Receipts</Text>
                    <Link href="/(protected)/(tabs)/receipts" asChild>
                        <TouchableOpacity>
                            {receipts?.objects?.length > 5 && (
                                <Text className="text-primary">
                                    See all {receipts?.objects?.length || 0}{' '}
                                    receipts
                                </Text>
                            )}
                        </TouchableOpacity>
                    </Link>
                </View>
                {!receipts?.objects || receipts.objects.length === 0 ? (
                    <EmptyReceiptsState />
                ) : (
                    <FlatList
                        data={recentReceipts}
                        renderItem={renderReceiptItem}
                        keyExtractor={(item) => item.id.toString()}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        );
    };

    const renderHeader = () => (
        <>
            <Header />
            {/* Scan Section */}
            <View className="mt-4">
                <Image
                    source={require('@/assets/images/receipt-sample.png')}
                    className="w-full h-48 rounded-lg"
                    resizeMode="cover"
                />
                <View className="mt-4">
                    <Text className="text-2xl font-bold">
                        Scan your Receipts
                    </Text>
                    <Text className="text-gray-500 mt-1">
                        Deduct your taxes
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => router.push('/(protected)/(camera)/camera')}
                    className="mt-4 w-full border border-primary rounded-full p-3 items-center"
                >
                    <Text className="text-primary font-semibold text-md">
                        Scan Now
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Receipts Section */}
            {renderReceiptsSection()}
        </>
    );

    const renderFooter = () => (
        <View className="mt-8 mb-8">
            <View className="flex-row justify-between items-center">
                <Text className="text-xl font-bold">Documents</Text>
                <Link href="/(protected)/(tabs)/documents" asChild>
                    <TouchableOpacity>
                        <Text className="text-primary">See more</Text>
                    </TouchableOpacity>
                </Link>
            </View>

            {!documents?.objects || documents.objects.length === 0 ? (
                <EmptyDocumentsState />
            ) : (
                <FlatList
                    data={documents?.objects || []}
                    renderItem={({ item }) => (
                        <TouchableOpacity>
                            <View className="w-80 h-48 bg-gray-50 rounded-xl items-center justify-center">
                                <View className="bg-primary/20 p-3 rounded-full">
                                    <FontAwesome6
                                        name="file-pdf"
                                        size={24}
                                        color="#4CD4E2"
                                    />
                                </View>
                                <Text className="mt-2 text-primary font-medium">
                                    {item.title}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View className="w-2" />}
                    contentContainerStyle={{ gap: 8 }}
                    className="mt-4"
                />
            )}
        </View>
    );

    const renderReceiptItem = ({ item }: { item: any }) => (
        <TouchableOpacity className="flex-row  h-24 items-center bg-gray-50 rounded-xl mb-4">
            <View className="w-24 h-full bg-gray-200 rounded-lg items-center justify-center">
                <FontAwesome6 name="image" size={24} color="#A0A0A0" />
            </View>
            <View className="ml-2 p-4  flex-1">
                <Text className="font-semibold text-sm">{item.title}</Text>
                <Text className="text-xs">Category: {item.category}</Text>
                <Text className=" text-xs">
                    Total Expenditure: P{item.total_expediture}
                </Text>

                <Text className="text-xs text-gray-500">
                    {formatDate(item.created_at)}
                </Text>
            </View>
            <FontAwesome6
                className="mr-4"
                name="chevron-right"
                size={10}
                color="#A0A0A0"
            />
        </TouchableOpacity>
    );

    return (
        <ScrollableLayout>
            <FlatList
                data={receipts?.objects || []}
                renderItem={renderReceiptItem}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                scrollEnabled={false}
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
            />
        </ScrollableLayout>
    );
};

export default HomeScreen;
