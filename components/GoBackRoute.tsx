import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { TouchableOpacity } from 'react-native';

// Parent Container should be relative

export default function GoBackRoute() {
    return (
        <TouchableOpacity
            className="absolute top-16 left-8 z-50"
            onPress={() => router.back()}
        >
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
                        Back
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
