import { api } from '../baseApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (username: string, password: string) => {
    try {
        const response = await api.post('/account/authenticate/', {
            username,
            password,
        });

        const data = response.data;
        const jwtToken = data['token'];
        const user = data['user'];

        // Store token in AsyncStorage
        await AsyncStorage.setItem('auth_token', jwtToken);

        return {
            token: jwtToken,
            user: user,
        };
    } catch (error) {
        console.log('error inside catch', error);
        throw error;
    }
};

export const register = async (registrationData: any) => {
    const { username, email, password, firstName, lastName } = registrationData;
    try {
        const response = await api.post('/account/registration/', {
            username,
            email,
            password,
            first_name: firstName,
            last_name: lastName,
        });

        const data = response.data;
        const registeredUsername = data['username'];

        return registeredUsername;
    } catch (error) {
        throw error;
    }
};

export const logout = async () => {
    try {
        await AsyncStorage.removeItem('auth_token');
    } catch (error) {
        console.error('Error during logout:', error);
        throw error;
    }
};
