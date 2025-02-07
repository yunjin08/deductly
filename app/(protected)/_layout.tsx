import { Stack } from 'expo-router';
import { AuthAwareLayout } from '@/components/AuthAwareLayout';
import { useAppSelector } from '@/hooks/useAuthHooks';
import { useEffect } from 'react';
import { router } from 'expo-router';

const ProtectedLayout = () => {
    const { session } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!session) {
            router.replace('/sign-in');
        }
    }, [session]);

    if (!session) {
        return null;
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
