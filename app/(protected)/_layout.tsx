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
            </Stack>
        </AuthAwareLayout>
    );
};

export default ProtectedLayout;
