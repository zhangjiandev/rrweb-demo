// sw.js
self.addEventListener('install', (event) => {
    console.log('[SW] Installed', event);
    self.skipWaiting(); // 立即激活
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Activated', event);
});

self.addEventListener('message', (event) => {
    const { type, payload } = event.data || {};

    if (type === 'FLUSH_EVENTS') {
        console.log('[SW] Received events:', payload);

        // 这里可以做真正上传，比如 fetch 服务器
        // ...


        // 回 ACK
        event.ports[0].postMessage({ type: 'ACK', payload: { ok: true } });
    }
});
