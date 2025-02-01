import { View, Text, TouchableOpacity, Image } from 'react-native';
import { ScrollableLayout } from '@/components/ScrollableLayout';
import { FontAwesome6 } from '@expo/vector-icons';
import Header from '@/components/Header';
import { FlatList } from 'react-native';
// Mock data for scanned images
const scannedImages = [
    {
        id: 1,
        date: 'MAR 05',
        location: 'Recife, Brazil',
    },
    {
        id: 2,
        date: 'MAR 05',
        location: 'Recife, Brazil',
    },
    {
        id: 3,
        date: 'MAR 05',
        location: 'Recife, Brazil',
    },
    {
        id: 4,
        date: 'MAR 05',
        location: 'Recife, Brazil',
    },
];

const GalleryScreen = () => {
    return (
        <ScrollableLayout>
            <FlatList
                data={scannedImages}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={<Header />}
                renderItem={({ item }) => (
                    <View className="flex-col gap-4">
                        <View
                            key={item.id}
                            className="bg-gray-50 rounded-xl overflow-hidden"
                        >
                            <View className="h-48 bg-gray-200 items-center justify-center">
                                <FontAwesome6
                                    name="image"
                                    size={40}
                                    color="#A0A0A0"
                                />
                            </View>
                            <View className="p-4">
                                <Text className="text-lg font-semibold">
                                    Image Item
                                </Text>
                                <Text className="text-gray-500 mb-3">
                                    {item.location}
                                </Text>
                                <TouchableOpacity className="bg-white py-3 rounded-lg border border-primary">
                                    <Text className="text-primary text-center font-medium">
                                        View
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full">
                                <Text className="text-sm text-primary font-medium">
                                    {item.date}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
            />
        </ScrollableLayout>
    );
};

export default GalleryScreen;
