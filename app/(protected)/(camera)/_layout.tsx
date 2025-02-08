import { Stack } from 'expo-router';

export default function CameraLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'fade',
                headerTitle: 'Camera',
                presentation: 'fullScreenModal',
                contentStyle: {
                    backgroundColor: 'transparent',
                },
            }}
        />
    );
}
