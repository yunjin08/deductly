import { api } from '../baseApi';

export const login = async (username: string, password: string) => {
    try {
        const response = await api.post('/account/authenticate/', {
            username,
            password,
        });

        const data = response.data;
        const jwtToken = data['token'];
        const user = data['user'];

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
        const response = await api.post('/registration/', {
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
