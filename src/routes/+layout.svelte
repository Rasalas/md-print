<script>
	import { onMount } from 'svelte';
	import '../app.css';

	let { children } = $props();

	onMount(() => {
		if (!import.meta.env.DEV || !('serviceWorker' in navigator)) return;
		if (!['localhost', '127.0.0.1', '::1', '[::1]'].includes(window.location.hostname)) return;

		navigator.serviceWorker
			.getRegistrations()
			.then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
			.catch(() => {});

		if ('caches' in window) {
			caches
				.keys()
				.then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
				.catch(() => {});
		}
	});
</script>

{@render children()}
