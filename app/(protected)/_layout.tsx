import { Stack, Redirect } from 'expo-router';
import { AuthAwareLayout } from '@/components/AuthAwareLayout';
import { useSession } from '@/contexts/AuthContext';

const ProtectedLayout = () => {
    const { session } = useSession();

    if (!session || !session.token || !session.email) {
        return <Redirect href="/sign-in" />;
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
                        headerTitle: 'Camera',
                        presentation: 'modal',
                        animation: 'fade_from_bottom',
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
