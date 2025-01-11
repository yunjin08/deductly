import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (username: string, password: string) => {
    const response = await axios.post('/authenticate/', {
        username,
        password,
    });

    const data = response.data;
    const jwtToken = data['token'];
    const email = data['email'];

    await AsyncStorage.setItem('@jwt', JSON.stringify(jwtToken));
    await AsyncStorage.setItem('@email', email);

    return jwtToken;
};

export const register = async (registrationData: any) => {
    const { username, email, password, firstName, lastName } = registrationData;

    const response = await axios.post('/registration/', {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
    });

    const data = response.data;
    const registeredUsername = data['username'];

    return registeredUsername;
};
