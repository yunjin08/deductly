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
                    headerTitle: 'Gallery',
                    tabBarIcon: () => {
                        return (
                            <TouchableOpacity>
                                <FontAwesome name="image" />
                            </TouchableOpacity>
                        );
                    },
                }}
            />
            <Tabs.Screen
                name="receipts"
                options={{
                    headerTitle: 'Receipts',
                    tabBarIcon: () => {
                        return (
                            <TouchableOpacity>
                                <FontAwesome6 name="receipt" />
                            </TouchableOpacity>
                        );
                    },
                }}
            />
            <Tabs.Screen
                name="camera"
                options={{
                    headerTitle: 'Camera',
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
                    headerTitle: 'Documents',
                    tabBarIcon: () => {
                        return (
                            <TouchableOpacity>
                                <FontAwesome6 name="file" />
                            </TouchableOpacity>
                        );
                    },
                }}
            />
            <Tabs.Screen
                name="reports"
                options={{
                    headerTitle: 'Reports',
                    tabBarIcon: () => {
                        return (
                            <TouchableOpacity>
                                <FontAwesome6 name="chart-simple" />
                            </TouchableOpacity>
                        );
                    },
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;
