import { Text, View, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useCameraPermissions, CameraView } from 'expo-camera';
import { CAMERA_FACE_DIRECTION } from '@/constants/Camera';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { useEffect, useState, useRef } from 'react';
import { Link, router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
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
                router.push(`/camera-modal?pictureUri=${result.assets[0].uri}`);
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

                // You can handle the captured photo here
                if (photo && photo.uri) {
                    router.back();
                    router.push(`/camera-modal?pictureUri=${photo.uri}`);
                }

                // The photo object contains:
                // - uri: The local URI of the photo
                // - width: The width of the photo
                // - height: The height of the photo
                // - base64: Base64 encoded string (if base64: true)
                // - exif: EXIF data (if exif: true)

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
        paddingHorizontal: 100, // Adjust this value for desired spacing
    },

    spacer: {
        width: 40, // Match the width of gallery button
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
        width: 40, // Added fixed width
        height: 40, // Added fixed height
        borderWidth: 2,
        borderColor: '#1fddee',
        borderRadius: 4, // Half of width/height
        overflow: 'hidden', // Added to ensure image stays within bounds
        justifyContent: 'center',
        alignItems: 'center',
    },
});
