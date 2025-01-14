import { useEffect, ReactNode } from 'react';
import { useSession } from '@/contexts/AuthContext';
import axios, { InternalAxiosRequestConfig } from 'axios';

interface AuthAwareLayoutProps {
    children: ReactNode;
}

export const AuthAwareLayout = ({ children }: AuthAwareLayoutProps) => {
    const { session } = useSession();
    useEffect(() => {
        const setAuthHeader = async (config: InternalAxiosRequestConfig) => {
            if (session) {
                if (session.token) {
                    config.headers.Authorization = `Bearer ${session.token}`;
                }

                if (session.email) {
                    config.headers['X-User-Email'] = session.email;
                }
            }
            return config;
        };

        const requestInterceptor = axios.interceptors.request.use(
            setAuthHeader,
            (error) => Promise.reject(error)
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
        };
    }, [session]);

    return <>{children}</>;
};
