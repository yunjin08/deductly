import { View, Text } from 'react-native';
import { listUsers } from '@/services/user';
import { useEffect, useState } from 'react';
import { ScrollableLayout } from '@/components/ScrollableLayout';

const GalleryScreen = () => {
    const [users, setUsers] = useState([] as string[]);

    useEffect(() => {
        listUsers().then((requestedUsers) => {
            setUsers(requestedUsers);
        });
    }, []);

    return (
        <ScrollableLayout>
            <View>
                {users.map((user) => {
                    return <Text>hello world</Text>;
                })}
            </View>
        </ScrollableLayout>
    );
};

export default GalleryScreen;
