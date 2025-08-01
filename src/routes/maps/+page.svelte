<script lang="ts">
	import { onMount } from 'svelte';
  	import { goto } from '$app/navigation';
	import { marker, type LatLngExpression } from 'leaflet';
	import Leaflet from '$lib/components/Leaflet.svelte';
	import Marker from '$lib/components/Marker.svelte';
	import Popup from '$lib/components/Popup.svelte';
	import Polyline from '$lib/components/Polyline.svelte';
	import { fetchLocation, getNearbyPlaces, fetchRoute , processingLeafletPlace} from '$lib/utils/location';
	import { fetchAgent } from "$lib/utils/chat";
	import type {LeafletPlace} from '$lib/types/place';
  	import { authStore } from '$lib/stores/auth';
	import { PUBLIC_DEFAULT_LATITUDE, PUBLIC_DEFAULT_LONGITUDE } from '$env/static/public';

	authStore.init();

	let mapZoom 		= $state(15)
	let currentLocation = $state('');
	let message 		= $state('');
	let loadingchat 	= $state(false);
	let chatHistory: { sender: 'user' | 'bot'; text: string }[] = $state([]);
	let initLatitude 	= $state(PUBLIC_DEFAULT_LATITUDE);
	let initLongtude 	= $state(PUBLIC_DEFAULT_LONGITUDE);
	let initialView: LatLngExpression = $state([Number(initLatitude), Number(initLongtude)]);
	let markerLocations: LeafletPlace[] 		= $state([]);
	let markerRouteStart: LeafletPlace[] 		= $state([]);
	let markerRouteEnd: LeafletPlace[] 			= $state([]);
	let markerCurrentLocation: LeafletPlace[] 	= $state([{latlang: [Number(initLatitude), Number(initLongtude)], name: 'Current Location'}]);
	let routeCoords: [number, number][] 		= $state([]);

	async function initLocation() {
		try {
			[currentLocation, initLatitude, initLongtude] = await fetchLocation();
			chatHistory.push({ sender: 'bot', text: `Now you're in ${currentLocation}. What I can help you?` });
		} catch (error) {
			error = 'Failed to fetch data';
		}
	}

	async function initPlaces(){
		console.log('run initPlaces')
		try {
			markerLocations = await getNearbyPlaces(initLatitude, initLongtude);
			mapZoom = 13;
		} catch (error) {
			error = 'Failed to fetch places';
		}
	}


	async function handleRoutes(destination: [number, number]){
		try {
			routeCoords 	= [];
			const routes 	= await fetchRoute([Number(initLongtude), Number(initLatitude)], destination);
			routeCoords 	= routes.map(
				([lng, lat]) => [lat, lng]
			);
			initialView 	= [Number(destination[1]), Number(destination[0])];
			mapZoom 		= 14;
		} catch (error) {
			error = 'Failed to fetch places';
		}
	}

	async function handleChat(){
		try {
			loadingchat = true;
			chatHistory.push({ sender: 'user', text: message });
			let messageFetch = message;
			message = '';

			// fetch agent
			const agentRes = await fetchAgent(messageFetch, initLatitude, initLongtude);
			chatHistory.push({sender:'bot', text: agentRes.data.answer});

			loadingchat = false;
			// handle agent
			handleAgent(agentRes);

		} catch (error) {
			error = 'Failed to fetch places';
		}
	}

	async function handleAgent(input: any){
		// reset data
		const agentCommand = ['change_current_location', 'get_direction', 'nearby_cafe_current_location', 'nearby_cafe'];
		if (agentCommand.includes(input.data.intent)) {
			mapZoom = 14;
			initLatitude 		= input.data.center_coordinates?.lat;
			initLongtude 		= input.data.center_coordinates?.lng;
			initialView 		= [Number(input.data.center_coordinates.lat), Number(input.data.center_coordinates.lng)];
			routeCoords 		= [];
			markerRouteStart 	= [];
			markerRouteEnd 		= [];
			routeCoords 		= [];
			markerCurrentLocation = [];	
		}
		switch (input.data.intent) {
			case "change_current_location":
				markerCurrentLocation = [
					{ latlang: [Number(input.data.center_coordinates.lat), Number(input.data.center_coordinates.lng)], name: input.data.details.display_name }
				];
				break;
			case "get_direction":
				markerRouteStart = [
					{ latlang: [Number(input.data.start_coordinates.lat), Number(input.data.start_coordinates.lng)], name: input.data.entities.start }
				];
				markerRouteEnd = [
					{ latlang: [Number(input.data.end_coordinates.lat), Number(input.data.end_coordinates.lng)], name: input.data.entities.end }
				];
				routeCoords = input.data.details.features[0].geometry.coordinates.map(
					([lng, lat]: [number, number]) => [lat, lng]
				);
				break;
			case "nearby_cafe_current_location":
				markerLocations = [];
				markerCurrentLocation = [
					{ latlang: [Number(input.data.center_coordinates.lat), Number(input.data.center_coordinates.lng)], name: input.data.details.display_name }
				];
				const nearbyPlaceRes = await processingLeafletPlace(input.data.details)
				markerLocations = nearbyPlaceRes;
				break;
			case "nearby_cafe":
				markerLocations = [];
				markerCurrentLocation = [
					{ latlang: [Number(input.data.center_coordinates.lat), Number(input.data.center_coordinates.lng)], name: input.data.details.display_name }
				];
				const nearbyCafeRes = await processingLeafletPlace(input.data.details)
				markerLocations = nearbyCafeRes;
				break;
		
			default:
				break;
		}
	}

	onMount(() => {
		if (!$authStore.isAuthenticated) {
			goto('/');
		}
		initLocation();
		// initPlaces();
	});
</script>
<svelte:head>
  <title>Maps - Nearby Cafe</title>
</svelte:head>

<div class="flex h-screen w-screen bg-white">
    <div class="w-1/2 flex flex-col border-r border-gray-200">
        <div class="h-12 flex items-center justify-between px-4 border-b bg-white">
            <a href="#" onclick={()=> goto('/dashboard')} class="text-sm/6 font-semibold text-gray-900"><span aria-hidden="true">&larr;</span> Back</a>
            <h2 class="text-sm/6 font-semibold text-gray-900" onclick={()=>initPlaces()}>CHAT</h2>
            <div class="w-10"></div>
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
			{#each chatHistory as chat}
				<div class="{chat.sender === 'user' ? 'bg-gray-100 rounded-xl text-secondary-foreground p-3 w-max ml-auto' : 'p-3'}">{chat.text}</div> 
			{/each}
			{#if loadingchat }
			<div class="p-3">...</div> 
			{/if}
        </div>

        <form class="p-4 border-t flex gap-2 bg-white ">
            <input
			bind:value={message}
            type="text"
            placeholder="Ketik pesan..."
            class="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
            />
            <button onclick={handleChat}  type="submit" class="gap-2 inline-flex justify-center rounded-full text-sm/6 font-semibold text-gray-950 ring-1 ring-gray-950/10 hover:ring-gray-950/20 px-4 py-2">Send</button>
        </form>
    </div>

  <div class="w-1/2 bg-white p-4 overflow-auto">
	<Leaflet view={initialView} zoom={mapZoom}>
		{#if routeCoords.length > 0}
		<Polyline positions={routeCoords} color="red" weight={6} />
		{/if}

		{#each markerCurrentLocation as rowCurrentLocation}
			<Marker latLng={rowCurrentLocation.latlang} width={40} height={40}>
				<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 64 64">
					<circle cx="32" cy="32" r="8" fill="#ff0000" />
					<circle cx="32" cy="32" r="16" fill="none" stroke="#ff0000" stroke-width="3" stroke-opacity="0.5" />
				</svg>

				<Popup>
					{rowCurrentLocation.name}
				</Popup>
			</Marker>
		{/each}

		{#each markerRouteStart as markerStart}
			<Marker latLng={markerStart.latlang} width={40} height={40}>
				<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 64 64">
					<circle cx="32" cy="32" r="8" fill="#ff0000" />
					<circle cx="32" cy="32" r="16" fill="none" stroke="#ff0000" stroke-width="3" stroke-opacity="0.5" />
				</svg>

				<Popup>
					{markerStart.name}
				</Popup>
			</Marker>
		{/each}

		{#each markerRouteEnd as markerEnd}
			<Marker latLng={markerEnd.latlang} width={40} height={40}>
				<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 64 64">
					<circle cx="32" cy="32" r="8" fill="#ff0000" />
					<circle cx="32" cy="32" r="16" fill="none" stroke="#ff0000" stroke-width="3" stroke-opacity="0.5" />
				</svg>

				<Popup>
					{markerEnd.name}
				</Popup>
			</Marker>
		{/each}

		{#each markerLocations as rowdata}
			<Marker latLng={rowdata.latlang} width={40} height={40}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="48" height="48">
					<g fill="none" stroke="brown" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path fill="#f3e5ab" stroke="brown" d="M32 2C19 2 10 12 10 24c0 11.7 12 26 22 36 10-10 22-24.3 22-36C54 12 45 2 32 2z"/>
						<rect x="24" y="22" width="16" height="14" rx="2" ry="2" fill="white" stroke="brown"/>
						<path d="M40 24c4 0 4 8 0 8" fill="none"/>
						<path d="M28 18c0-2 2-2 2-4s-2-2-2-4" />
						<path d="M34 18c0-2 2-2 2-4s-2-2-2-4" />
					</g>
				</svg>
				<Popup>
					<b>Name</b>: {rowdata.name}<br>
					<b>Address</b>: {rowdata.location}<br>
					<b>Website</b>: {rowdata.website}<br>
					<b>Instagram</b>: {rowdata.instagram}<br>
					<b>Twitter</b>: {rowdata.twitter}<br>
					<b>Latitude</b>: {rowdata.lat}<br>
					<b>Longitude</b>: {rowdata.lng}<br>
					<a href="" onclick={()=>handleRoutes([Number(rowdata.lng), Number(rowdata.lat)])}>Direction ->></a>
				</Popup>
			</Marker>
		{/each}
	</Leaflet>
  </div>
</div>