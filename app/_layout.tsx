import { Stack } from 'expo-router';
import axios from 'axios';
import { LOCAL_AREA_HOST } from '@/constants/BaseUrl';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    StyleSheet,
} from 'react-native';

axios.defaults.baseURL = LOCAL_AREA_HOST;

const RootLayout = () => {
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <Stack>
                    <Stack.Screen
                        name="index"
                        options={{ headerTitle: 'Welcome', headerShown: false }}
                    />
                    <Stack.Screen
                        name="sign-in"
                        options={{ headerTitle: 'Sign In', headerShown: false }}
                    />
                    <Stack.Screen
                        name="sign-up"
                        options={{ headerTitle: 'Sign Up' }}
                    />
                    <Stack.Screen
                        name="reset-password"
                        options={{ headerTitle: 'Reset Password' }}
                    />
                    <Stack.Screen
                        name="(protected)"
                        options={{ headerShown: false }}
                    />
                </Stack>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

export default RootLayout;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
