import axios from 'axios';

export const listUsers = async () => {
    try {
        const response = await axios.get('/account/users/');

        const users = response.data.objects.map((user: any) => {
            return user.username;
        });

        return users;
    } catch (error) {
        throw error;
    }
};
