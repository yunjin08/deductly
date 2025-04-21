import React from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { Image } from 'expo-image';
import GoBackRoute from '@/components/GoBackRoute';
import { FontAwesome6 } from '@expo/vector-icons';
import { useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { cameraService } from '@/services/api/camera';

const CameraModalScreen = () => {
    const { pictureUri } = useLocalSearchParams();
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Function to convert image URI to base64
    const getBase64FromUri = async (uri: string) => {
        try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            return base64;
        } catch (error) {
            console.error('Error converting image to base64:', error);
            throw error;
        }
    };

    const handleAnalyze = async () => {
        try {
            setIsAnalyzing(true);
            const base64Image = await getBase64FromUri(pictureUri as string);
            
            console.log('Processing receipt...');
            const response = await cameraService.processReceipt(base64Image);

            console.log('Receipt analysis:', response);
            
            if (response.success) {
                router.push({
                    pathname: '/(protected)/(tabs)/home',
                    params: { receipt_data: JSON.stringify(response.data) }
                });
            }
        } catch (error: any) {
            console.error('Error analyzing receipt:', error.response?.data || error.message);
            Alert.alert(
                'Error',
                'Failed to analyze receipt. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsAnalyzing(false);
        }
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
                {isAnalyzing ? (
                    <ActivityIndicator size="large" color="#fff" />
                ) : (
                    <>
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
                    </>
                )}
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
