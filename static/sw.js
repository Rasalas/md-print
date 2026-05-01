// Cleanup for stale service-worker registrations from older local builds.
self.addEventListener('install', () => {
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(self.registration.unregister());
});
