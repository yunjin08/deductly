import { createApiService, api } from '@/services/api/baseApi';
import type { User } from '@/interfaces';

const endpoint = '/account/users/';

// Extend the base API service with document-specific methods
export const usersApi = {
    ...createApiService<User>(endpoint),
};
