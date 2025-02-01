import { Stack } from 'expo-router';
import axios from 'axios';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    StyleSheet,
} from 'react-native';
import { SessionProvider } from '@/contexts/AuthContext';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/contexts/store';
import '../global.css';

axios.defaults.baseURL = process.env.EXPO_PUBLIC_LOCAL_AREA_BASE_URL;

const RootLayout = () => {
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <TouchableWithoutFeedback onPress={dismissKeyboard}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.container}
                    >
                        <SessionProvider>
                            <Stack>
                                {/* Public Routes */}
                                <Stack.Screen
                                    name="index"
                                    options={{
                                        headerTitle: 'Welcome',
                                        headerShown: false,
                                    }}
                                />
                                <Stack.Screen
                                    name="sign-in"
                                    options={{
                                        headerTitle: 'Sign In',
                                        headerShown: false,
                                    }}
                                />
                                <Stack.Screen
                                    name="sign-up"
                                    options={{ headerTitle: 'Sign Up' }}
                                />
                                <Stack.Screen
                                    name="reset-password"
                                    options={{ headerTitle: 'Reset Password' }}
                                />

                                {/* Protected Routes */}

                                <Stack.Screen
                                    name="(protected)"
                                    options={{ headerShown: false }}
                                />
                            </Stack>
                        </SessionProvider>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </PersistGate>
        </Provider>
    );
};

export default RootLayout;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
