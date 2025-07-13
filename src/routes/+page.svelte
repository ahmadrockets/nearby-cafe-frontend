<script>
  import { goto } from '$app/navigation';
  async function gotoLogin() {
    goto('/login');
  }
</script>
<div class="bg-white w-screen h-screen">
  <div class="relative isolate px-6 pt-14 lg:px-8">
    <div class="mx-auto max-w-2xl py-32 sm:py-32 lg:py-40">
      <div class="text-center">
        <h1 class="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">Search nearby cafe around you</h1>
        <p class="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">Find the nearest cafes—because great coffee should never be far away. ☕</p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <a href="#" on:click={gotoLogin} class="gap-2 inline-flex justify-center rounded-full text-sm/6 font-semibold text-gray-950 ring-1 ring-gray-950/10 hover:ring-gray-950/20 px-4 py-2">Get Started <svg fill="currentColor" aria-hidden="true" viewBox="0 0 10 10" class="-mr-0.5 w-2.5 fill-gray-600"><path d="M4.85355 0.146423L9.70711 4.99998L4.85355 9.85353L4.14645 9.14642L7.79289 5.49998H0V4.49998H7.79289L4.14645 0.85353L4.85355 0.146423Z"></path></svg></a>
        </div>
      </div>
    </div>
  </div>
</div>