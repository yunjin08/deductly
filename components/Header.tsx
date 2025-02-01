import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { usePathname } from 'expo-router';

const Header = () => {
    const pathname = usePathname();
    const showHomeButton = pathname !== '/home';

    return (
        <View
            className={`flex-row py-4 px-6 items-center ${
                showHomeButton ? 'justify-between' : 'justify-end'
            }`}
        >
            {showHomeButton && (
                <Link href="/(protected)/(tabs)/home" asChild>
                    <TouchableOpacity>
                        <View className="flex-row items-center">
                            <FontAwesome6
                                name="chevron-left"
                                size={20}
                                color="#1fddee"
                                className="mr-2"
                                solid
                            />
                            <View className="bg-[#1fddee] px-4 py-2 rounded-full">
                                <Text className="text-white font-semibold text-base">
                                    Home
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Link>
            )}
            <Link href="/(protected)/profile" asChild>
                <FontAwesome6
                    name="circle-user"
                    size={32}
                    color="#1fddee"
                    solid
                />
            </Link>
        </View>
    );
};

export default Header;
