import { View, Text } from 'react-native';
import { listUsers } from '@/services/user';
import { useEffect, useState } from 'react';

const GalleryScreen = () => {
    const [users, setUsers] = useState([] as string[]);

    useEffect(() => {
        listUsers().then((requestedUsers) => {
            setUsers(requestedUsers);
        });
    }, []);

    return (
        <View>
            {users.map((user) => {
                return <Text>{user}</Text>;
            })}
        </View>
    );
};

export default GalleryScreen;
