import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleSignInWithGoogle } from '@/services/sso/google';
import { listUsers } from '@/services/user';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const [jwtToken, setJwtToken] = useState('No Token');
    const [users, setUsers] = useState([]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    });

    useEffect(() => {
        const fetchData = async () => {
            if (response) {
                try {
                    const jwtToken = await handleSignInWithGoogle(response);
                    setJwtToken(jwtToken);

                    const fetchedUsers: any = await listUsers();
                    setUsers(fetchedUsers);
                } catch (error) {
                    console.error(
                        'Error during sign-in or fetching users:',
                        error
                    );
                }
            }
        };

        fetchData();
    }, [response]);

    const resetJWT = async () => {
        await AsyncStorage.removeItem('@jwt');
        setJwtToken('No Token');
        setUsers([]);
    };

    return (
        <View style={styles.container}>
            <Text>DEDUCTLY</Text>
            <Text>JWT Token</Text>
            <Text style={styles.tokenText}>{jwtToken}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => promptAsync()}
                >
                    <Text style={styles.buttonText}>Sign in with Google</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => resetJWT()}
                >
                    <Text style={styles.buttonText}>Refresh Async Storage</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.userListHeader}>
                Test API that lists all Deductly Users
            </Text>

            {users.length === 0 ? (
                <Text style={styles.userText}> No Fetched Users</Text>
            ) : (
                users.map((user) => (
                    <Text style={styles.userText} key={user}>
                        {user}
                    </Text>
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },

    tokenText: {
        fontSize: 10,
        textAlign: 'center',
        padding: 20,
    },

    userListHeader: {
        marginTop: 20,
    },

    userText: {
        fontSize: 10,
        marginTop: 10,
    },

    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
    },

    button: {
        backgroundColor: '#1fddee',
        padding: 16,
        borderRadius: 8,
    },

    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
