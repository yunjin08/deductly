import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ScrollableLayout } from '@/components/ScrollableLayout';
import { FontAwesome6 } from '@expo/vector-icons';
import Header from '@/components/Header';
import { FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAuthHooks';
import { fetchImages } from '@/contexts/actions/galleryActions';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';

// Define the type for gallery image items
interface GalleryImage {
    id: string | number;
    date?: string;
    location?: string;
}

const EmptyGalleryState = () => (
    <View className="items-center h-[90%] justify-center py-8">
        <View className="bg-primary/10 p-4 rounded-full mb-4">
            <FontAwesome6 name="image" size={32} color="#1fddee" />
        </View>
        <Text className="text-xl font-semibold text-gray-800 mb-2">
            No Images Yet
        </Text>
        <Text className="text-gray-500 text-center px-8">
            Start capturing or uploading images to build your gallery
        </Text>
        <TouchableOpacity
            onPress={() => router.push('/(protected)/(camera)/camera')}
            className="mt-4 border border-primary rounded-full px-6 py-2"
        >
            <Text className="text-primary font-semibold">
                Take Your First Photo
            </Text>
        </TouchableOpacity>
    </View>
);

const GalleryScreen = () => {
    const [isGridView, setIsGridView] = useState(true);
    const dispatch = useAppDispatch();
    const images = useSelector((state: any) => state.gallery?.images);
    const isLoading = useSelector((state: any) => state.gallery?.isLoading);
    const error = useSelector((state: any) => state.gallery?.error);

    useEffect(() => {
        dispatch(fetchImages());
    }, [dispatch]);

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

    const renderGridItem = ({ item }: { item: GalleryImage }) => (
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

    const renderListItem = ({ item }: { item: GalleryImage }) => (
        <View className="flex-row h-24 bg-gray-50 rounded-xl overflow-hidden mb-4">
            <View className="w-24 h-full bg-gray-200 items-center justify-center">
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

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#1fddee" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 items-center justify-center p-4">
                <Text className="text-red-500 text-center mb-4">{error}</Text>
                <Text className="text-gray-500 text-center">
                    Please try again later or contact support if the problem
                    persists.
                </Text>
            </View>
        );
    }

    return (
        <ScrollableLayout>
            <Header />
            {images && images.length > 0 ? <ViewToggle /> : <Text className="text-2xl font-bold text-center">Images</Text>} 
            {images?.length === 0 || !images ? (
                <EmptyGalleryState />
            ) : (
                <View className="flex-row flex-wrap gap-4">
                    <FlatList
                        key={isGridView ? 'grid' : 'list'}
                        data={images}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={isGridView ? 2 : 1}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                        columnWrapperStyle={
                            isGridView
                                ? {
                                      gap: 16,
                                  }
                                : undefined
                        }
                        renderItem={
                            isGridView ? renderGridItem : renderListItem
                        }
                    />
                </View>
            )}
        </ScrollableLayout>
    );
};

export default GalleryScreen;
