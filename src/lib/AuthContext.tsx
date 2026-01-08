import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { account } from './appwrite';
import type { Models, OAuthProvider } from 'appwrite';

interface AuthContextType {
    user: Models.User<Models.Preferences> | null;
    loading: boolean;
    jwt: string | null;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [loading, setLoading] = useState(true);
    const [jwt, setJwt] = useState<string | null>(null);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const currentUser = await account.get();
            setUser(currentUser);
            const jwtResponse = await account.createJWT();
            setJwt(jwtResponse.jwt);
            console.log("jwt", jwtResponse.jwt);
        } catch (error) {
            setUser(null);
            setJwt(null);
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = async () => {
        try {
            account.createOAuth2Session({
                provider: 'google' as OAuthProvider,
                success: `${window.location.origin}/`,
                failure: `${window.location.origin}/`
            });
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const logout = async () => {
        try {
            await account.deleteSession({ sessionId: 'current' });
            setUser(null);
            setJwt(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, jwt, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
