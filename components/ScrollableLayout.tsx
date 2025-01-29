import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ScrollableLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return <SafeAreaView className="flex-1 px-6">{children}</SafeAreaView>;
};
