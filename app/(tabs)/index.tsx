import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleSignInWithGoogle } from '@/services/sso/google';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const [userInfo, setUserInfo] = useState(null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    });

    useEffect(() => {
        if (response) {
            handleSignInWithGoogle(response).then((user) => {
                setUserInfo(user);
            });
        }
    }, [response]);

    return (
        <View style={styles.container}>
            <Text>{JSON.stringify(userInfo, null, 2)}</Text>
            <Text>Deductly</Text>
            <Button title="Sign in with Google" onPress={() => promptAsync()} />
            <Button
                title="Delete Local Storage"
                onPress={() => AsyncStorage.removeItem('@user')}
            />
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
});
