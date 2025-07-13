import { jwtDecode } from 'jwt-decode';
import type { JWTPayload, User } from "$lib/types/auth";

export function decodeToken(token: string): User | null {
    try {
        const decoded = jwtDecode<JWTPayload>(token);

        if (!decoded?.id || !decoded?.email || !decoded?.name) {
            console.warn('Invalid token payload:', decoded);
            return null;
        }

        return {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            picture: decoded.picture ?? ''
        };
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}

export function isTokenExpired(token: string): boolean {
    try {
        const decoded = jwtDecode<JWTPayload>(token);
        if (!decoded || !decoded.exp) {
            return true;
        }
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (error) {
        console.log('Error checking token expiration ', error);
        return true;
    }
}

export function getAuthHeader(token: string): {Authorization: string} {
    return {
        Authorization: `Bearer ${token}`
    };
}

export async function makeAuthenticatedRequest(
    url: string,
    token: string,
    options: RequestInit = {}
): Promise<Response> {
    const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeader(token),
        ...options.headers
    };

    return fetch(url, {
        ... options,
        headers,
    })
}