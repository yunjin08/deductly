import { Stack } from 'expo-router';
import { AuthAwareLayout } from '@/components/AuthAwareLayout';
import { useAppSelector } from '@/hooks/useAuthHooks';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

const ProtectedLayout = () => {
    const { session } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!session) {
            router.replace('/sign-in');
        }
    }, [session]);

    if (!session) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#1fddee" />
            </View>
        );
    }

    return (
        <AuthAwareLayout>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="profile"
                    options={{
                        headerBackTitle: 'Back',
                        headerTitle: 'Profile',
                    }}
                />
                <Stack.Screen
                    name="camera-modal"
                    options={{
                        animation: 'fade_from_bottom',
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="(camera)"
                    options={{ headerShown: false }}
                />
            </Stack>
        </AuthAwareLayout>
    );
};

export default ProtectedLayout;
