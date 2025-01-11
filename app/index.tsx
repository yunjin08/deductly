import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import WelcomeBackground from '@/assets/images/welcome-background.png';
import { Link } from 'expo-router';

const WelcomeScreen = () => {
    return (
        <View style={styles.screenContainer}>
            <Image
                style={styles.image}
                source={WelcomeBackground}
                contentFit="cover"
                transition={1000}
            />
            <View style={styles.contentContainer}>
                <Text style={styles.headerText}>
                    Streamline Tax Deduction Processes
                </Text>
                <Text style={styles.subHeaderText}>
                    Automating data collection, categorization, and compliance
                    to ensure accuracy and save time.
                </Text>
                <Link href="/sign-in" asChild>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },

    image: {
        width: '100%',
        height: '55%',
    },

    contentContainer: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        gap: 30,
        paddingHorizontal: 25,
        paddingTop: 40,
    },

    headerText: {
        fontSize: 25,
        fontWeight: 'bold',
    },

    subHeaderText: {
        fontSize: 12,
        color: 'grey',
    },

    button: {
        width: '100%',
        backgroundColor: '#1fddee',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },

    buttonText: {
        color: 'white',
    },
});
