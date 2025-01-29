import { FlatList, ScrollView, View } from 'react-native';
import Header from './Header';
import { SafeAreaView } from 'react-native-safe-area-context';
type ScrollableLayoutProps = {
    children: React.ReactNode;
};

const ScrollableLayout = ({ children }: ScrollableLayoutProps) => {
    return (
        <SafeAreaView>
            <FlatList
                data={[]}
                renderItem={() => <View className="px-4">{children}</View>}
                ListHeaderComponent={<Header />}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

export default ScrollableLayout;
