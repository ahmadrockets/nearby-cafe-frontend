import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { AuthState, User } from '$lib/types/auth';
import { decodeToken, isTokenExpired } from '$lib/auth/auth';

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false
};

function createAuthStore() {
    const { subscribe, set, update } = writable<AuthState>(initialState);

    return {
        subscribe,
        // Initialize auth state from localStorage
        init: () => {
            if (!browser) return;

            update((state) => ({ ...state, loading: true }));

            const token = localStorage.getItem('auth_token');

            if (token && !isTokenExpired(token)) {
                const user = decodeToken(token);
                if (user) {
                    update((state) => ({
                        ...state,
                        user,
                        token,
                        isAuthenticated: true,
                        loading: false
                    }));
                    return;
                }
            }

            // Token invalid or missing
            localStorage.removeItem('auth_token');
            update((state) => ({ ...state, loading: false }));
        },

        // Login
        login: (token: string, user: User) => {
            if (browser) {
                localStorage.setItem('auth_token', token);
            }
            update((state) => ({
                ...state,
                user,
                token,
                isAuthenticated: true,
                loading: false
            }));
        },

        // Logout
        logout: () => {
            if (browser) {
                localStorage.removeItem('auth_token');
            }
            set(initialState);
        },

        // Set loading state
        setLoading: (loading: boolean) => {
            update((state) => ({ ...state, loading }));
        }
    };
}

export const authStore = createAuthStore();
