import { useState, useEffect } from 'react';
import { account } from './appwrite';
import type { Models, OAuthProvider } from 'appwrite';

export function useAuth() {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const currentUser = await account.get();
            setUser(currentUser);
        } catch (error) {
            setUser(null);
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
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return {
        user,
        loading,
        loginWithGoogle,
        logout,
    };
}
