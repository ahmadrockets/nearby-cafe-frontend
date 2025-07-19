import { PUBLIC_DEFAULT_LATITUDE, PUBLIC_DEFAULT_LONGITUDE, PUBLIC_API_URL } from '$env/static/public';
import type { NearbyPlacesResponse, LeafletPlace, GetRouteResponse } from "../types/place";
export function getLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
    } else {
      navigator.geolocation.getCurrentPosition(
        resolve,
        (err) => {
          let message = '';
          switch (err.code) {
            case err.PERMISSION_DENIED:
              message = "Permission denied for location access.";
              break;
            case err.POSITION_UNAVAILABLE:
              message = "Position update is unavailable. Check GPS or connection.";
              break;
            case err.TIMEOUT:
              message = "Location request timed out.";
              break;
            default:
              message = "Unknown location error.";
          }
          reject(new Error(message));
        }
      );
    }
  });
}

export async function fetchLocation(): Promise<[string, any, any]>{
    let latitude = null;
    let longitude = null;
    try {
        const position = await getLocation();
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
    } catch (err) {
        latitude = PUBLIC_DEFAULT_LATITUDE; // set default location
        longitude = PUBLIC_DEFAULT_LONGITUDE; // set default location
    }
    let currentLocation = await reverseGeocode(String(latitude), String(longitude));
    return [currentLocation, latitude, longitude];
}

export async function reverseGeocode(latitude: string, longitude: string): Promise<string> {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await res.json();
        return data.display_name;
    } catch (err) {
        return 'Failed to get address';
    }
}

export async function getNearbyPlaces(latitude: string, longitude: string): Promise<LeafletPlace[]> {
  const url = `${PUBLIC_API_URL}/places/nearby?lat=${latitude}&lng=${longitude}`
  const token =  localStorage.getItem('auth_token') || "";
  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'X-Places-Api-Version': '2025-06-17'
    }
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Places API error: ${res.status} - ${errorText}`);
  }
  const json = await res.json();
  const places = json as NearbyPlacesResponse;

  const placesRes = await processingLeafletPlace(places.data)

  return placesRes;
}

export async function fetchRoute(start: [number, number], end:[number, number]): Promise<[number, number][]>{
  const startParam = `${start[0]},${start[1]}`
  const endParam = `${end[0]},${end[1]}`
  const url = `${PUBLIC_API_URL}/places/routes?start=${startParam}&end=${endParam}`
  const token = localStorage.getItem('auth_token') || "";
  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    }
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Routes API error: ${res.status} - ${errorText}`);
  }
  const json = await res.json();
  const resdata = json as GetRouteResponse;
  const route = resdata.data.features[0].geometry.coordinates
  return route;
}

export async function processingLeafletPlace(inputData: any): Promise<LeafletPlace[]>{
  const placesRes: Array<LeafletPlace> = []
  for (let index = 0; index < inputData.length; index++) {
    const element = inputData[index];
    const plc: LeafletPlace = {
      lat: Number(element.latitude),
      lng: Number(element.longitude),
      latlang: [Number(element.latitude), Number(element.longitude)],
      name: element.name,
      email: element.email,
      website: element.website,
      instagram: element.social_media?.instagram,
      twitter: element.social_media?.twitter,
      location: element.location?.formatted_address
    };
    placesRes.push(plc);
  }

  return placesRes;
}