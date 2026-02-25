import { createSignal } from 'solid-js';
import type { User } from '../../domain/entities/user.entity';

const [user, setUser] = createSignal<User | null>(null);
const [isAuthenticated, setIsAuthenticated] = createSignal<boolean>(false);
const [loading, setLoading] = createSignal<boolean>(true);

export const authStore = {
    user,
    isAuthenticated,
    loading,
    setAuth: (userData: User | null, authStatus: boolean) => {
        setUser(userData);
        setIsAuthenticated(authStatus);
        setLoading(false);
    },
    logout: () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
    }
};
