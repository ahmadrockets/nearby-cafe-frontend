export interface User {
    id: string;
    email: string;
    name: string;
    picture?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
}

export interface GoogleOAuthResponse {
    access_token: string;
    user: User;
    expires_in: number;
}

export interface JWTPayload {
    id: string;
    email: string;
    name: string;
    picture?: string;
    iat: number;
    exp: number;
}