import { Stack } from 'expo-router';
import axios from 'axios';
import { LOCALHOST } from '@/constants/BaseUrl';

axios.defaults.baseURL = LOCALHOST;

const RootLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{ headerTitle: 'Welcome', headerShown: false }}
            />
            <Stack.Screen
                name="sign-in"
                options={{ headerTitle: 'Sign In', headerShown: false }}
            />
            <Stack.Screen name="sign-up" options={{ headerTitle: 'Sign Up' }} />
            <Stack.Screen
                name="reset-password"
                options={{ headerTitle: 'Reset Password' }}
            />
            <Stack.Screen name="(protected)" options={{ headerShown: false }} />
        </Stack>
    );
};

export default RootLayout;
