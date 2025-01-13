import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OAUTH_BASE_URL } from '@/constants/BaseUrl';
import { OAUTH_SUCCESS } from '@/constants/Auth';
import { AuthSessionResult } from 'expo-auth-session';

export async function handleSignInWithGoogle(response: AuthSessionResult) {
    const jwt_token = await AsyncStorage.getItem('@jwt');
    if (!jwt_token) {
        if (response.type === OAUTH_SUCCESS) {
            const tokenResponse = response.authentication;
            if (tokenResponse) {
                try {
                    if (!tokenResponse.idToken) {
                        throw Error('No Google ID Token');
                    }
                    const jwtResponse = await axios.post('/sso/google/', {
                        id_token: tokenResponse.idToken,
                    });

                    const jwtToken = jwtResponse.data.token;

                    await AsyncStorage.setItem(
                        '@jwt',
                        JSON.stringify(jwtToken)
                    );

                    const accessToken = tokenResponse.accessToken;

                    const email = await getUserInfo(accessToken);

                    await AsyncStorage.setItem('@email', email);

                    return jwtToken;
                } catch (error) {
                    console.error(error);
                }
            }
        }
    } else {
        return jwt_token;
    }
}

export const getUserInfo = async (token: any) => {
    if (!token) return;
    try {
        const response = await axios.get(OAUTH_BASE_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const user = response.data;
        return user.email;
    } catch (error) {
        console.error(error);
    }
};
