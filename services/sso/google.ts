import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OAUTH_BASE_URL } from '@/constants/BaseUrl';
import { OAUTH_SUCCESS } from '@/constants/Auth';
import { AuthSessionResult } from 'expo-auth-session';

export async function handleSignInWithGoogle(response: AuthSessionResult) {
    const user = await AsyncStorage.getItem('@user');
    if (!user) {
        if (response.type === OAUTH_SUCCESS) {
            const tokenResponse = response.authentication;
            if (tokenResponse) {
                await axios.post('/sso/google/', {
                    id_token: tokenResponse.idToken,
                });
                console.log('AFTER /sso/google');

                const userInfo = await getUserInfo(tokenResponse.accessToken);

                return userInfo;
            }
        }
    } else {
        return user;
    }
}

export const getUserInfo = async (token: any) => {
    if (!token) return;
    try {
        const response = await axios.get(OAUTH_BASE_URL, {
            baseURL: '',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const user = response.data;
        await AsyncStorage.setItem('@user', JSON.stringify(user));
        return user;
    } catch (error) {
        console.error(error);
    }
};
