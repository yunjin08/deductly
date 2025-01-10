import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleSignInWithGoogle } from '@/services/sso/google';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const [jwtToken, setJwtToken] = useState('No Token');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    });

    useEffect(() => {
        if (response) {
            handleSignInWithGoogle(response).then((jwtToken) => {
                setJwtToken(jwtToken);
            });
        }
    }, [response]);

    const resetJWT = async () => {
        await AsyncStorage.removeItem('@jwt');
        setJwtToken('No Token');
    };

    return (
        <View style={styles.container}>
            <Text>DEDUCTLY</Text>
            <Text>JWT Token</Text>
            <Text style={styles.tokenText}>{jwtToken}</Text>
            <Button title="Sign in with Google" onPress={() => promptAsync()} />
            <Button title="Delete Local Storage" onPress={() => resetJWT()} />
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
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
    },
});
