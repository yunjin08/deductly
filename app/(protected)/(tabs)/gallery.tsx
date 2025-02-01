import { View, Text, TouchableOpacity, Image } from 'react-native';
import { ScrollableLayout } from '@/components/ScrollableLayout';
import { FontAwesome6 } from '@expo/vector-icons';
import Header from '@/components/Header';
import { FlatList } from 'react-native';
import { useState } from 'react';
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
    const [isGridView, setIsGridView] = useState(true);

    const ViewToggle = () => (
        <View className="flex-row gap-2 mb-4">
            <TouchableOpacity
                onPress={() => setIsGridView(true)}
                className={`flex-row items-center gap-2 px-3 py-2 rounded-lg ${
                    isGridView ? 'border-b-2 border-primary' : ''
                }`}
            >
                <FontAwesome6
                    name="table-cells-large"
                    size={16}
                    color="#6C757D"
                />
                <Text className="text-gray-600 text-sm font-medium">Grid</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => setIsGridView(false)}
                className={`flex-row items-center gap-2 px-3 py-2 rounded-lg ${
                    !isGridView ? 'border-b-2 border-primary' : ''
                }`}
            >
                <FontAwesome6 name="list" size={16} color="#6C757D" />
                <Text className="text-gray-600 text-sm font-medium">List</Text>
            </TouchableOpacity>
        </View>
    );

    const renderGridItem = ({ item }) => (
        <View className="flex-1 mb-4">
            <View
                key={item.id}
                className="bg-gray-50 rounded-xl overflow-hidden"
            >
                <View className="h-48 bg-gray-200 items-center justify-center">
                    <FontAwesome6 name="image" size={40} color="#A0A0A0" />
                </View>
                <View className="p-4">
                    <Text className="text-lg font-semibold">Image Item</Text>
                    <Text className="text-gray-500 mb-3">{item.location}</Text>
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
    );

    const renderListItem = ({ item }) => (
        <View className="flex-row bg-gray-50 rounded-xl overflow-hidden mb-4">
            <View className="w-24 h-24 bg-gray-200 items-center justify-center">
                <FontAwesome6 name="image" size={24} color="#A0A0A0" />
            </View>
            <View className="flex-1 p-4 justify-center">
                <Text className="text-lg font-semibold">Image Item</Text>
                <Text className="text-gray-500">{item.location}</Text>
                <Text className="text-primary text-sm mt-1">{item.date}</Text>
            </View>
            <TouchableOpacity className="justify-center px-4">
                <FontAwesome6 name="chevron-right" size={16} color="#6C757D" />
            </TouchableOpacity>
        </View>
    );

    return (
        <ScrollableLayout>
            <FlatList
                data={scannedImages}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <>
                        <Header />
                        <ViewToggle />
                    </>
                }
                renderItem={isGridView ? renderGridItem : renderListItem}
            />
        </ScrollableLayout>
    );
};

export default GalleryScreen;
