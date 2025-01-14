import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Image } from 'react-native';

const CameraModalScreen = () => {
    const { pictureUri } = useLocalSearchParams();

    console.log('inside modal', pictureUri);

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: pictureUri as string }}
                style={styles.image}
            />
        </View>
    );
};

export default CameraModalScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        padding: 24,
    },

    image: {
        width: '100%',
        height: '80%',
        resizeMode: 'cover',
    },
});
