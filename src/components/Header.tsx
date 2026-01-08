import { useAuth } from '@/lib/AuthContext';
import { useTheme } from '@/lib/useTheme';
import { Button } from '@/components/ui/button';
import { LogOut, Moon, Sun } from 'lucide-react';

export function Header() {
    const { user, loading, loginWithGoogle, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    if (loading) {
        return (
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="h-10 w-10"></div>
                    <div className="h-10 w-32 bg-muted animate-pulse rounded-md"></div>
                </div>
            </header>
        );
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="h-10 w-10 rounded-full"
                    aria-label="Toggle dark mode"
                >
                    {theme === 'dark' ? (
                        <Sun className="h-5 w-5" />
                    ) : (
                        <Moon className="h-5 w-5" />
                    )}
                </Button>

                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <span className="text-sm text-muted-foreground ">
                                {user.email}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={logout}
                                className="gap-2 cursor-pointer"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Sign out</span>
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="default"
                            size="sm"
                            onClick={loginWithGoogle}
                            className="gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 cursor-pointer"
                        >
                            <img src="/google.png" alt="Google" className="h-4 w-4" />
                            <span>Sign in with Google</span>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
