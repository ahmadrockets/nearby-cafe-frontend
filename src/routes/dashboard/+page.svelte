<script lang="ts">
import { goto } from '$app/navigation';
</script>
<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Dashboard Page
      </h2>
        <a href="#" on:click={() => goto('/')} class="gap-2 inline-flex justify-center rounded-full text-sm/6 font-semibold text-gray-950 ring-1 ring-gray-950/10 hover:ring-gray-950/20 px-4 py-2">Go Home <svg fill="currentColor" aria-hidden="true" viewBox="0 0 10 10" class="-mr-0.5 w-2.5 fill-gray-600"><path d="M4.85355 0.146423L9.70711 4.99998L4.85355 9.85353L4.14645 9.14642L7.79289 5.49998H0V4.49998H7.79289L4.14645 0.85353L4.85355 0.146423Z"></path></svg></a>
    </div>
  </div>
</div>