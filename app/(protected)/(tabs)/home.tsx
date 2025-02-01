import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { ScrollableLayout } from '@/components/ScrollableLayout';
import Header from '@/components/Header';

// Mock data with more items
const receipts = [
    {
        id: 1,
        name: 'Alicia Keys',
        location: 'Olinda, Brazil',
    },
    {
        id: 2,
        name: 'Michael Jackson',
        location: 'Recife, Brazil',
    },
    {
        id: 3,
        name: 'Maxell Milay',
        location: 'Racist, Brazil',
    },
    {
        id: 4,
        name: 'John Doe',
        location: 'Salvador, Brazil',
    },
    {
        id: 5,
        name: 'Jane Smith',
        location: 'Rio, Brazil',
    },
    {
        id: 6,
        name: 'Bob Wilson h',
        location: 'Manaus, Brazil',
    },
];

const document = [
    {
        id: 1,
        date: 'Mar 05',
    },
    {
        id: 2,
        date: 'Aug 26',
    },
    {
        id: 3,
        date: 'Nov 8',
    },
    {
        id: 4,
        date: 'Dec 12',
    },
];

const HomeScreen = () => {
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
                <TouchableOpacity className="mt-4 w-full border border-primary rounded-full p-4 items-center">
                    <Text className="text-primary font-semibold text-lg">
                        Scan Now
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Receipts Section */}
            <View className="mt-8">
                <View className="flex-row justify-between items-center">
                    <Text className="text-xl font-bold">Your Receipts</Text>
                    <Link href="/(protected)/(tabs)/receipts" asChild>
                        <TouchableOpacity>
                            <Text className="text-primary">See more</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
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

            <FlatList
                data={document}
                renderItem={({ item }) => (
                    <TouchableOpacity>
                        <View className="w-80 h-48 bg-gray-50 rounded-xl items-center justify-center">
                            <View className="bg-primary/20 p-3 rounded-full">
                                <FontAwesome6
                                    name="camera"
                                    size={24}
                                    color="#4CD4E2"
                                />
                            </View>
                            <Text className="mt-2 text-primary font-medium">
                                {item.date}
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
        </View>
    );

    const renderReceiptItem = ({ item }: { item: any }) => (
        <TouchableOpacity className="flex-row items-center bg-gray-50 p-4 rounded-xl mb-4">
            <View className="w-12 h-12 bg-gray-200 rounded-lg items-center justify-center">
                <FontAwesome6 name="image" size={24} color="#A0A0A0" />
            </View>
            <View className="ml-4 flex-1">
                <Text className="font-semibold text-lg">{item.name}</Text>
                <Text className="text-gray-500">{item.location}</Text>
            </View>
            <FontAwesome6 name="chevron-right" size={20} color="#A0A0A0" />
        </TouchableOpacity>
    );

    return (
        <ScrollableLayout>
            <FlatList
                data={receipts}
                renderItem={renderReceiptItem}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                scrollEnabled={true}
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
            />
        </ScrollableLayout>
    );
};

export default HomeScreen;
