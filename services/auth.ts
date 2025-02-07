import axios from 'axios';

export const login = async (username: string, password: string) => {
    try {
        const response = await axios.post('/authenticate/', {
            username,
            password,
        });

        const data = response.data;
        const jwtToken = data['token'];
        const email = data['email'];
        const user = data['user'];
        return {
            token: jwtToken,
            user: user,
        };
    } catch (error) {
        throw error;
    }
};

export const register = async (registrationData: any) => {
    const { username, email, password, firstName, lastName } = registrationData;
    try {
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
    } catch (error) {
        throw error;
    }
};
