import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const listUsers = async () => {
    try {
        // Retrieve JWT token and email from AsyncStorage
        const jwt_token = await AsyncStorage.getItem('@jwt');
        const email = await AsyncStorage.getItem('@email');

        // Ensure the values exist before making the request
        if (!jwt_token || !email) {
            throw new Error('JWT token or email is missing.');
        }

        // Make the API call with the headers
        const response = await axios.get('/users/', {
            headers: {
                Authorization: `Bearer ${jwt_token}`,
                'X-User-Email': email,
            },
        });

        const users = response.data.objects.map((user: any) => {
            return user.username;
        });

        // Return the response data
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; // Re-throw the error to handle it where the function is called
    }
};
