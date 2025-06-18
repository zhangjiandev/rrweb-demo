// register-sw.ts
export async function registerServiceWorker(scriptUrl: string = '/sw.js') {
    if (!('serviceWorker' in navigator)) {
        console.warn('[SW] Not supported in this browser');
        return null;
    }

    try {
        const registration = await navigator.serviceWorker.register(scriptUrl);
        console.log('[SW] Registered:', registration);

        const swReady = await navigator.serviceWorker.ready;
        console.log('[SW] Ready:', swReady);

        return swReady;
    } catch (err) {
        console.error('[SW] Registration failed:', err);
        return null;
    }
}
