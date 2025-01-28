import { View, Text } from 'react-native';
import { listUsers } from '@/services/user';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const GalleryScreen = () => {
    const [users, setUsers] = useState([] as string[]);

    useEffect(() => {
        listUsers().then((requestedUsers) => {
            setUsers(requestedUsers);
        });
    }, []);

    return (
        <SafeAreaView className="flex-1">
            <View>
                {users.map((user) => {
                    return <Text>hello world</Text>;
                })}
            </View>
        </SafeAreaView>
    );
};

export default GalleryScreen;
