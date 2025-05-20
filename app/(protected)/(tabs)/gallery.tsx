import { View, Text, TouchableOpacity, ActivityIndicator, Image, Modal, Share } from 'react-native';
import { ScrollableLayout } from '@/components/ScrollableLayout';
import { FontAwesome6 } from '@expo/vector-icons';
import Header from '@/components/Header';
import { FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAuthHooks';
import { fetchImages } from '@/contexts/actions/galleryActions';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { formatDate } from '@/utils/formatDate';

// Define the type for gallery image items
interface GalleryImage {
    id: number;
    title: string;
    image_url: string;
    created_at: string;
    updated_at: string;
    user: number;
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
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const dispatch = useAppDispatch();
    const images = useSelector((state: any) => state.gallery?.images);
    const isLoading = useSelector((state: any) => state.gallery?.isLoading);
    const error = useSelector((state: any) => state.gallery?.error);
    console.log(images, 'images');

    useEffect(() => {
        dispatch(fetchImages());
    }, [dispatch]);

    const handleDownload = async (imageUrl: string) => {
        try {
            await Share.share({
                url: imageUrl,
                message: 'Check out this image from my gallery!'
            });
        } catch (error) {
            console.error('Error sharing image:', error);
        }
    };

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

    const ImageModal = () => (
        <Modal
            visible={!!selectedImage}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setSelectedImage(null)}
        >
            <View className="flex-1 bg-black/90 justify-center items-center">
                <TouchableOpacity 
                    className="absolute top-12 right-4 z-10"
                    onPress={() => setSelectedImage(null)}
                >
                    <FontAwesome6 name="xmark" size={24} color="white" />
                </TouchableOpacity>
                
                {selectedImage && (
                    <>
                        <Image 
                            source={{ uri: selectedImage.image_url }}
                            className="w-[90%] h-2/3 rounded-xl"
                            resizeMode="contain"
                        />
                        <View className="absolute bottom-12 w-full px-4">
                            <View className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                                <Text className="text-white text-xl font-semibold mb-2">
                                    {selectedImage.title}
                                </Text>
                                <Text className="text-white/80 mb-4">
                                    Created: {formatDate(selectedImage.created_at)}
                                </Text>
                                <TouchableOpacity 
                                    className="bg-primary py-3 rounded-lg"
                                    onPress={() => handleDownload(selectedImage.image_url)}
                                >
                                    <Text className="text-white text-center font-semibold">
                                        Download Image
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                )}
            </View>
        </Modal>
    );

    const renderGridItem = ({ item }: { item: GalleryImage }) => (
        <View className="flex-1 mb-4">
            <View
                key={item.id}
                className="bg-gray-50 rounded-xl overflow-hidden"
            >
                <TouchableOpacity onPress={() => setSelectedImage(item)}>
                    <View className="h-48 bg-gray-200 items-center justify-center">
                        <Image 
                            source={{ uri: item.image_url }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </View>
                </TouchableOpacity>
                <View className="p-4">
                    <Text className="text-lg font-semibold">{item.title}</Text>
                    <Text className="text-gray-500 mb-3">Created: {formatDate(item.created_at)}</Text>
                    <TouchableOpacity 
                        className="bg-white py-3 rounded-lg border border-primary"
                        onPress={() => setSelectedImage(item)}
                    >
                        <Text className="text-primary text-center font-medium">
                            View
                        </Text>
                    </TouchableOpacity>
                </View>
                <View className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full">
                    <Text className="text-sm text-primary font-medium">
                        {formatDate(item.updated_at)}
                    </Text>
                </View>
            </View>
        </View>
    );

    const renderListItem = ({ item }: { item: GalleryImage }) => (
        <TouchableOpacity 
            className="flex-row h-24 bg-gray-50 rounded-xl overflow-hidden mb-4"
            onPress={() => setSelectedImage(item)}
        >
            <View className="w-24 h-full bg-gray-200 items-center justify-center">
                <Image 
                    source={{ uri: item.image_url }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
            </View>
            <View className="flex-1 p-4 justify-center">
                <Text className="text-lg font-semibold">{item.title}</Text>
                <Text className="text-gray-500">Created: {formatDate(item.created_at)}</Text>
                <Text className="text-primary text-sm mt-1">Updated: {formatDate(item.updated_at)}</Text>
            </View>
            <View className="justify-center px-4">
                <FontAwesome6 name="chevron-right" size={16} color="#6C757D" />
            </View>
        </TouchableOpacity>
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
            {images && images?.objects?.length > 0 ? <ViewToggle /> : <Text className="text-2xl font-bold text-center">Images</Text>} 
            {images?.length === 0 || !images ? (
                <EmptyGalleryState />
            ) : (
                <View className="flex-row flex-wrap gap-4">
                    <FlatList
                        key={isGridView ? 'grid' : 'list'}
                        data={images.objects}
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
            <ImageModal />
        </ScrollableLayout>
    );
};

export default GalleryScreen;
