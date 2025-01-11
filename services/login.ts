import axios from 'axios';

export const login = async (username: string, password: string) => {
    const token = await axios.post('/authenticate/', {
        username,
        password,
    });

    console.log('LOGIN CHECK', token);

    return token;
};
