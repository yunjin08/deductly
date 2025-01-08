import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OAUTH_BASE_URL } from '@/constants/BaseUrl';
import { OAUTH_SUCCESS_MARKER } from '@/constants/Auth';

export async function handleSignInWithGoogle(response: any) {
    const user = await AsyncStorage.getItem('@user');
    if (!user) {
        if (response?.type === OAUTH_SUCCESS_MARKER) {
            const userInfo = await getUserInfo(
                response.authentication?.accessToken
            );
            return userInfo;
        }
    } else {
        return user;
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
        await AsyncStorage.setItem('@user', JSON.stringify(user));
        return user;
    } catch (error) {
        console.error(error);
    }
};
