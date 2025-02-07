import { User } from '@/interfaces';

export interface Session {
    token: string;
    email: string;
    user?: User;
}

export interface AuthState {
    session: Session | null;
    isLoading: boolean;
    errors?: string[];
}

export interface AuthAction {
    type: string;
    payload?: any;
}

export interface RegisterData {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface LoginData {
    username: string;
    password: string;
}
