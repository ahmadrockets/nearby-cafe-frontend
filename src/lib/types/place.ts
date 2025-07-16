import type { LatLngExpression } from 'leaflet';

export interface ForsquarePlace {
    name : string, 
    email?: string,
    website?: string,
    latitude: number,
    longitude: number,
    location?:{
        formatted_address?:string
    },
    social_media?:{
        instagram?: string,
        twitter?:string,
    }
}

export interface NearbyPlacesResponse {
    data: ForsquarePlace[];
    message: string;
    success: boolean;
}

export interface LeafletPlace {
    latlang: LatLngExpression,
    lat?: number,
    lng?: number,
    name: string,
    email?: string,
    website?: string,
    instagram?: string,
    twitter?: string,
    location?: string
}

interface GeometryResponse {
    geometry: {
        coordinates: Array<[number, number]>
    }
}

export interface RouteApiResponse {
    features: GeometryResponse[]
}

export interface GetRouteResponse {
    data: RouteApiResponse;
    message: string;
    success: boolean;
}