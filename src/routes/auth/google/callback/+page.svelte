<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { authStore } from '$lib/stores/auth';
  import { decodeToken } from '$lib/auth/auth';

  let error = '';
  let loading = true;

  onMount(async () => {
    try {
      // Get the token from URL params (sent by backend)
      const token = $page.url.searchParams.get('token');
      const errorParam = $page.url.searchParams.get('error');
      
      if (errorParam) {
        error = decodeURIComponent(errorParam);
        loading = false;
        return;
      }
      
      if (!token) {
        error = 'No authentication token received';
        loading = false;
        return;
      }
      
      // Decode the JWT token to get user info
      const user = decodeToken(token);
      
      if (user) {
        // Store token and user info
        authStore.login(token, user);
        
        // Clean up URL and redirect to dashboard
        window.history.replaceState({}, '', '/auth/callback');
        goto('/dashboard');
      } else {
        error = 'Invalid authentication token';
        loading = false;
      }
    } catch (err) {
      console.error('OAuth callback error:', err);
      error = 'An error occurred during authentication';
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Authenticating... - MyApp</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center">
  <div class="max-w-md w-full text-center">
    {#if loading}
      <div class="bg-white p-8 rounded-lg shadow-sm border">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          Authenticating...
        </h2>
        <p class="text-gray-600">
          Please wait while we complete your login with Google.
        </p>
      </div>
    {:else if error}
      <div class="bg-white p-8 rounded-lg shadow-sm border">
        <div class="text-red-600 mb-4">
          <svg class="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          Authentication Failed
        </h2>
        <p class="text-gray-600 mb-6">
          {error}
        </p>
        <div class="space-y-2">
          <button
            onclick={() => goto('/login')}
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
          >
            Try Again
          </button>
          <button
            onclick={() => goto('/')}
            class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-medium"
          >
            Go Home
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>