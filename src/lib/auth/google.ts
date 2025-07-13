import { dev } from '$app/environment';

export const GOOGLE_OAUTH_CONFIG = {
    backendUrl: dev
        ? 'http://localhost:3000'
        : 'http://backend.com',

    frontendUrl: dev
        ? 'http://localhost:5173'
        : 'https://yourapp.com'
};

export function getGoogleOAuthUrl(): string {
    return `${GOOGLE_OAUTH_CONFIG.backendUrl}/auth/google`;
}