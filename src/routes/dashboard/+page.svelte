<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import { fetchLocation } from '$lib/utils/location';

  authStore.init();

  let currentLocation = $state('');
  let latitude = '';
  let longitude = '';

  async function initLocation() {
    try {
      [currentLocation, latitude, longitude] = await fetchLocation()
    } catch (error) {
      error = 'Failed to fetch data';
    }
  }

  onMount(() => {
    if (!$authStore.isAuthenticated) {
      goto('/');
    }
    initLocation();
  });

  function handleLogout(){
    authStore.logout();
    goto('/');
  }
</script>
<svelte:head>
  <title>Dashboard - Nearby Cafe</title>
</svelte:head>
<div class="bg-white">
  <header class="absolute inset-x-0 top-0 z-50">
    <nav class="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
      <div class="flex lg:flex-1">
        <a href="#" onclick={() => goto('/')} class="-m-1.5 p-1.5">
          <span class="sr-only">Nearby Cafe</span>
          <h1 class="text-5xl">☕</h1>
        </a>
      </div>
      <div class="hidden lg:flex lg:gap-x-12">
        <!-- <a href="#" on:click={() => goto('/dashboard')}  class="text-sm/6 font-semibold text-gray-900">Home</a>
        <a href="#" class="text-sm/6 font-semibold text-gray-900">Profile</a>
        <a href="#" class="text-sm/6 font-semibold text-gray-900">About</a> -->
      </div>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end">
        <a href="#" onclick={()=> handleLogout()} class="text-sm/6 font-semibold text-gray-900">Log out <span aria-hidden="true">&rarr;</span></a>
      </div>
    </nav>
  </header>

  <div class="relative isolate px-6 pt-14 lg:px-8">
    <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
      <div class="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
    </div>
    <div class="mx-auto max-w-2xl py-24 sm:py-48 lg:py-40">
      <div class="text-center">
        <h1 class="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">Nearby Cafe</h1>
        <p class="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">Now You're in {currentLocation}.</p>
      </div>
      <div class="mt-10 flex items-center justify-center gap-x-6">
          {#if currentLocation==''}
          <a href="#" onclick={initLocation} class="gap-2 inline-flex justify-center rounded-full text-sm/6 font-semibold text-gray-950 ring-1 ring-gray-950/10 hover:ring-gray-950/20 px-4 py-2">Get Your Current Location <svg fill="currentColor" aria-hidden="true" viewBox="0 0 10 10" class="-mr-0.5 w-2.5 fill-gray-600"><path d="M4.85355 0.146423L9.70711 4.99998L4.85355 9.85353L4.14645 9.14642L7.79289 5.49998H0V4.49998H7.79289L4.14645 0.85353L4.85355 0.146423Z"></path></svg></a>
          {/if}
          <a href="#" onclick={()=>goto('/maps')} class="gap-2 inline-flex justify-center rounded-full text-sm/6 font-semibold text-gray-950 ring-1 ring-gray-950/10 hover:ring-gray-950/20 px-4 py-2">Get Nearby Cafe <svg fill="currentColor" aria-hidden="true" viewBox="0 0 10 10" class="-mr-0.5 w-2.5 fill-gray-600"><path d="M4.85355 0.146423L9.70711 4.99998L4.85355 9.85353L4.14645 9.14642L7.79289 5.49998H0V4.49998H7.79289L4.14645 0.85353L4.85355 0.146423Z"></path></svg></a>
      </div>
    </div>
    <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
      <div class="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
    </div>
  </div>
</div>