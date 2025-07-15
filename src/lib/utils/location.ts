import { PUBLIC_DEFAULT_LATITUDE, PUBLIC_DEFAULT_LONGITUDE } from '$env/static/public';
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