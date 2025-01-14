import { Text, View, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useCameraPermissions, CameraView } from 'expo-camera';
import { CAMERA_FACE_DIRECTION } from '@/constants/Camera';
import { FontAwesome } from '@expo/vector-icons';
import { useRef } from 'react';
import { router } from 'expo-router';

const CameraScreen = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);

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
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={capture}
                        style={styles.captureButton}
                    >
                        <FontAwesome name="camera" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
};

export default CameraScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        position: 'relative',
    },

    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },

    camera: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },

    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'red',
        marginBottom: 32,
    },

    captureButton: {
        padding: 24,
        backgroundColor: '#1fddee',
        position: 'absolute',
        bottom: 0,
        borderRadius: 50,
    },
});
