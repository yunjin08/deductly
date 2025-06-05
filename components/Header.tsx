import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { usePathname } from 'expo-router';

const Header = () => {
    const pathname = usePathname();
    const [isHome, setIsHome] = useState(true);
    useEffect(() => {
        const isHome =
            pathname === '/home' || pathname === '/(protected)/(tabs)/home';
        setIsHome(isHome);
    }, [pathname]);

    return (
        <View
            className={`flex-row py-4 px-2 items-center ${
                isHome ? 'justify-end' : 'justify-between'
            } relative`}
        >
            {!isHome && (
                <Link href="/(protected)/(tabs)/home" asChild>
                    <TouchableOpacity>
                        <View className="flex-row items-center">
                            <FontAwesome6
                                name="chevron-left"
                                size={16}
                                color="#1fddee"
                                className="mr-2"
                                solid
                            />
                            <View>
                                <Text className="text-primary font-semibold text-base">
                                    Home
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Link>
            )}
            <Link href="/(protected)/profile" asChild>
                <TouchableOpacity>
                    <Image
                        source={require('@/assets/images/logo.png')}
                        style={{ width: 32, height: 32 }} 
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </Link>
        </View>
    );
};

export default Header;
