import React from 'react';
import { ScrollView, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ScrollableLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <SafeAreaView edges={['top']} className="flex-1 px-6">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: 20,
                }}
            >
                <TouchableWithoutFeedback>
                    <View className="flex-1">{children}</View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </SafeAreaView>
    );
};
