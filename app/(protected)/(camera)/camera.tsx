import { Text, View, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useCameraPermissions, CameraView } from 'expo-camera';
import { CAMERA_FACE_DIRECTION } from '@/constants/Camera';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { useEffect, useState, useRef } from 'react';
import { Link, router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import GoBackRoute from '@/components/GoBackRoute';

const CameraScreen = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [lastImage, setLastImage] = useState<string | null>(null);
    const cameraRef = useRef<CameraView>(null);

    // Function to get the last image
    const getLastImage = async () => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status === 'granted') {
                const { assets } = await MediaLibrary.getAssetsAsync({
                    first: 1,
                    mediaType: 'photo',
                    sortBy: ['creationTime'],
                });

                if (assets.length > 0) {
                    setLastImage(assets[0].uri);
                }
            }
        } catch (error) {
            console.error('Failed to get last image:', error);
        }
    };

    useEffect(() => {
        getLastImage();
    }, []);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    // Add gallery picker function
    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                quality: 0.8,
                base64: true,
                exif: true,
            });

            if (!result.canceled && result.assets[0]) {
                // Save the picked image to app's permanent storage
                const receiptsDir = `${FileSystem.documentDirectory}receipts/`;
                const dirInfo = await FileSystem.getInfoAsync(receiptsDir);
                if (!dirInfo.exists) {
                    await FileSystem.makeDirectoryAsync(receiptsDir, { intermediates: true });
                }

                const filename = `receipt_${Date.now()}.jpg`;
                const newUri = `${receiptsDir}${filename}`;

                await FileSystem.copyAsync({
                    from: result.assets[0].uri,
                    to: newUri
                });

                router.push(`/camera-modal?pictureUri=${newUri}`);
            }
        } catch (error) {
            console.error('Failed to pick image:', error);
        }
    };

    const capture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    base64: true,
                    exif: true,
                });

                if (photo && photo.uri) {
                    // Save the captured image to app's permanent storage
                    const receiptsDir = `${FileSystem.documentDirectory}receipts/`;
                    const dirInfo = await FileSystem.getInfoAsync(receiptsDir);
                    if (!dirInfo.exists) {
                        await FileSystem.makeDirectoryAsync(receiptsDir, { intermediates: true });
                    }

                    const filename = `receipt_${Date.now()}.jpg`;
                    const newUri = `${receiptsDir}${filename}`;

                    await FileSystem.copyAsync({
                        from: photo.uri,
                        to: newUri
                    });

                    router.back();
                    router.push(`/camera-modal?pictureUri=${newUri}`);
                }

                return photo;
            } catch (error) {
                console.error('Failed to take picture:', error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing={CAMERA_FACE_DIRECTION}
            >
                <GoBackRoute />

                {/* Bottom controls container */}
                <View style={styles.controlsContainer}>
                    <TouchableOpacity
                        onPress={pickImage}
                        style={styles.galleryButton}
                    >
                        {lastImage ? (
                            <Image
                                source={{ uri: lastImage }}
                                style={styles.lastImage}
                            />
                        ) : (
                            <FontAwesome name="image" size={24} color="white" />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={capture}
                        style={styles.captureButton}
                    >
                        <FontAwesome name="camera" size={30} color="white" />
                    </TouchableOpacity>

                    {/* Empty View for spacing balance */}
                    <View style={styles.spacer} />
                </View>
            </CameraView>
        </View>
    );
};

export default CameraScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },

    message: {
        textAlign: 'center',
        paddingBottom: 10,
        color: 'white',
    },

    camera: {
        flex: 1,
    },

    buttonContainer: {
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    controlsContainer: {
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 100,
    },

    spacer: {
        width: 40,
    },

    button: {
        padding: 24,
        borderRadius: 50,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    lastImage: {
        width: '100%',
        height: '100%',
    },

    captureButton: {
        padding: 24,
        backgroundColor: '#1fddee',
        borderRadius: 50,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    galleryButton: {
        backgroundColor: '#6C757D',
        width: 40,
        height: 40,
        borderWidth: 2,
        borderColor: '#1fddee',
        borderRadius: 4,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
