import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OAUTH_BASE_URL } from '@/constants/BaseUrl';
import { OAUTH_SUCCESS } from '@/constants/Auth';
import { AuthSessionResult } from 'expo-auth-session';

export async function handleSignInWithGoogle(response: AuthSessionResult) {
    const user = await AsyncStorage.getItem('@jwt');
    if (!user) {
        if (response.type === OAUTH_SUCCESS) {
            const tokenResponse = response.authentication;
            if (tokenResponse) {
                const jwtResponse = await axios.post('/sso/google/', {
                    id_token: tokenResponse.idToken,
                });

                const jwtToken = jwtResponse.data.token;

                await AsyncStorage.setItem('@jwt', JSON.stringify(jwtToken));

                return jwtToken;
            }
        }
    } else {
        return user;
    }
}
