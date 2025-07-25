<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import { getGoogleOAuthUrl } from '$lib/auth/google';

  authStore.init();

  onMount(() => {
    if ($authStore.isAuthenticated) {
      goto('/dashboard');
    }
  });

  function handleGoogleLogin() {
    authStore.setLoading(true);
    // Redirect to backend OAuth endpoint
    // Backend will handle Google OAuth and redirect back with token
    window.location.href = getGoogleOAuthUrl();
  }
</script>

<svelte:head>
  <title>Login - Nearby Cafe</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Use your Google account to access Nearby Cafe
      </p>
    </div>
    
    <div class="mt-8 space-y-6">
      <div class="bg-white py-8 px-6 shadow-sm rounded-lg border">
        <div class="space-y-6">
          <button
            on:click={handleGoogleLogin}
            disabled={$authStore.loading}
            class="cursor-pointer group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-red-500" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </span>
            {#if $authStore.loading}
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            {:else}
              Continue with Google
            {/if}
          </button>
        </div>
      </div>
      
      <div class="text-center">
        <p class="text-sm text-gray-600">
          By signing in, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </div>
  </div>
</div>