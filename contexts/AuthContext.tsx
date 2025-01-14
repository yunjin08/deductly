import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from '@/hooks/useStorageState';

type AuthContextType = {
    saveLoginData: (data: { token: string; email: string }) => void;
    resetLoginData: () => void;
    session?: { token: string; email: string } | null;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    saveLoginData: () => null,
    resetLoginData: () => null,
    session: null,
    isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
    const value = useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error(
                'useSession must be wrapped in a <SessionProvider />'
            );
        }
    }
    return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState<{
        token: string;
        email: string;
    }>('session');

    return (
        <AuthContext.Provider
            value={{
                saveLoginData: (data) => {
                    setSession(data);
                },
                resetLoginData: () => {
                    setSession(null);
                },
                session,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
