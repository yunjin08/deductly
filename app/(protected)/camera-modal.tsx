import { useLocalSearchParams, router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import GoBackRoute from '@/components/GoBackRoute';
import { FontAwesome6 } from '@expo/vector-icons';

const CameraModalScreen = () => {
    const { pictureUri } = useLocalSearchParams();

    console.log('inside modal', pictureUri);

    // TODO: Add logic to upload image to database S3
    const handleConfirm = () => {
        console.log('confirm');
        router.push('/(protected)/(tabs)/home');
    };

    return (
        <View style={styles.container}>
            <GoBackRoute />
            <Image
                source={{ uri: pictureUri as string }}
                style={styles.image}
                contentFit="cover"
            />
            <TouchableOpacity
                className="absolute bottom-20 self-center z-10"
                onPress={handleConfirm}
            >
                <View className="bg-primary rounded-full size-20 flex items-center justify-center">
                    <FontAwesome6 name="check" size={30} color="white" solid />
                </View>
            </TouchableOpacity>
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
