import React from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import GoBackRoute from '@/components/GoBackRoute';
import { FontAwesome6 } from '@expo/vector-icons';

const CameraModalScreen = () => {
    const { pictureUri } = useLocalSearchParams();

    const handleAnalyze = () => {
        router.push({
            pathname: '/(protected)/(camera)/analyze-receipt',
            params: { pictureUri }
        });
    };

    return (
        <View style={styles.container}>
            <GoBackRoute />
            <Image
                source={{ uri: pictureUri as string }}
                style={styles.image}
                contentFit="cover"
            />
            <View className="absolute bottom-20 flex-row justify-center space-x-4 w-full">
                <TouchableOpacity
                    className="bg-primary rounded-full size-20 flex items-center justify-center"
                    onPress={handleAnalyze}
                >
                    <FontAwesome6 name="receipt" size={30} color="white" solid />
                </TouchableOpacity>
                <TouchableOpacity
                    className="bg-primary rounded-full size-20 flex items-center justify-center"
                    onPress={() => router.push('/(protected)/(tabs)/home')}
                >
                    <FontAwesome6 name="check" size={30} color="white" solid />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CameraModalScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        flex: 1,
    },
});
