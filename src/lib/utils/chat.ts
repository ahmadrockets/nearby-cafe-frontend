import {  PUBLIC_API_URL } from '$env/static/public';

export async function fetchAgent(message: string, latitude: string, longitude: string): Promise<any> {
    const url = `${PUBLIC_API_URL}/chat/agent`
    const token =  localStorage.getItem('auth_token') || "";

    const reqHeader = new Headers();
    reqHeader.append("Content-Type", "application/json");
    reqHeader.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
        "message": message,
        "lat": Number(latitude),
        "lng": Number(longitude),
        "current_date": new Date().toLocaleString('id-ID')
    });

    const requestOptions = {
        method: "POST",
        headers: reqHeader,
        body: raw,
    };
    const res = await fetch(url.toString(), requestOptions);

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Fetch agent error: ${res.status} - ${errorText}`);
    }

    const json = await res.json();
    return json;
}