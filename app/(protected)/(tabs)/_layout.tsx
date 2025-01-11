import { Tabs } from 'expo-router';

const TabsLayout = () => {
    return (
        <Tabs>
            <Tabs.Screen name="home" options={{ headerTitle: 'Home' }} />
        </Tabs>
    );
};

export default TabsLayout;
