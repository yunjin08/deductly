import { Stack } from 'expo-router';

const ProtectedLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    );
};

export default ProtectedLayout;
