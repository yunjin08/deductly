import Header from '@/components/Header';
import { FontAwesome6, FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';

const TabsLayout = () => {
    return (
        <Tabs>
            <Tabs.Screen name="home" options={{ href: null }} />
            <Tabs.Screen
                name="gallery"
                options={{
                    tabBarLabel: 'Gallery',
                    tabBarIcon: () => {
                        return (
                            <TouchableOpacity>
                                <FontAwesome name="image" />
                            </TouchableOpacity>
                        );
                    },
                    header: () => <Header />,
                }}
            />
            <Tabs.Screen
                name="receipts"
                options={{
                    tabBarLabel: 'Receipts',
                    tabBarIcon: () => {
                        return (
                            <TouchableOpacity>
                                <FontAwesome6 name="receipt" />
                            </TouchableOpacity>
                        );
                    },
                    header: () => <Header />,
                }}
            />
            <Tabs.Screen
                name="camera"
                options={{
                    headerShown: false,
                    tabBarLabel: 'Camera',
                    tabBarIcon: () => {
                        return (
                            <TouchableOpacity>
                                <FontAwesome name="camera" />
                            </TouchableOpacity>
                        );
                    },
                }}
            />
            <Tabs.Screen
                name="documents"
                options={{
                    tabBarLabel: 'Documents',
                    tabBarIcon: () => {
                        return (
                            <TouchableOpacity>
                                <FontAwesome6 name="file" />
                            </TouchableOpacity>
                        );
                    },
                    header: () => <Header />,
                }}
            />
            <Tabs.Screen
                name="reports"
                options={{
                    tabBarLabel: 'Reports',
                    tabBarIcon: () => {
                        return (
                            <TouchableOpacity>
                                <FontAwesome6 name="chart-simple" />
                            </TouchableOpacity>
                        );
                    },
                    header: () => <Header />,
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;
