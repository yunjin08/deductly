import { Tabs } from 'expo-router';

const TabsLayout = () => {
    return (
        <Tabs>
            <Tabs.Screen name="home" options={{ href: null }} />

            <Tabs.Screen name="gallery" options={{ headerTitle: 'Gallery' }} />
            <Tabs.Screen
                name="receipts"
                options={{ headerTitle: 'Receipts' }}
            />
            <Tabs.Screen
                name="documents"
                options={{ headerTitle: 'Documents' }}
            />
            <Tabs.Screen name="reports" options={{ headerTitle: 'Reports' }} />
        </Tabs>
    );
};

export default TabsLayout;
