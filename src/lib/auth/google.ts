import { PUBLIC_API_URL } from '$env/static/public';

export const GOOGLE_OAUTH_CONFIG = {
    backendUrl: PUBLIC_API_URL
};

export function getGoogleOAuthUrl(): string {
    return `${GOOGLE_OAUTH_CONFIG.backendUrl}/auth/google`;
}