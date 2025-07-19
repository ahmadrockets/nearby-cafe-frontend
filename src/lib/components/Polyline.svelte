<script lang="ts">
	import { onMount, onDestroy, getContext, setContext } from 'svelte';
	import L from 'leaflet';

	export let positions: L.LatLngExpression[] = [];
	export let color: string = 'blue';
	export let weight: number = 4;

	let polyline: L.Polyline | undefined;

	const { getMap }: { getMap: () => L.Map | undefined } = getContext('map');
	const map = getMap();

	setContext('layer', {
		getLayer: () => polyline
	});

	onMount(() => {
		if (map && positions.length > 0) {
			polyline = L.polyline(positions, {
				color,
				weight
			}).addTo(map);
		}
	});

	$: if (map && polyline && positions.length > 0) {
		polyline.setLatLngs(positions);
		polyline.setStyle({ color, weight });
	}

	onDestroy(() => {
		polyline?.remove();
		polyline = undefined;
	});
</script>
