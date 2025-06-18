// sw.js
self.addEventListener('install', (event) => {
    console.log('[SW] Installed', event);
    self.skipWaiting(); // 立即激活
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Activated', event);
});

self.addEventListener('message', (event) => {
    const {type, payload} = event.data || {};
    if (type === 'FLUSH_EVENTS') {
        flushEventsToBackend(event, payload);
    }
    if(type === 'CACHE_EVENTS') {

    }
});

function flushEventsToBackend(event, payload) {
    console.log('[SW] Received events:', payload);

    const data = {
        metaData: {
            sendDate: new Date().toISOString(), // 当前时间
        },
        payload: {
            // rrweb 事件内容，比如
            events: payload
        }
    };

    // 这里可以做真正上传，比如 fetch 服务器
    // ...
    fetch('http://127.0.0.1:8080/api/events/upload', {
        method: 'POST', headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify(data)
    })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.text();
        })
        .then(response => {
            console.log('后端返回:', response);
        })
        .catch(error => {
            console.error('发送失败:', error);
        });
    // 回 ACK
    event.ports[0].postMessage({type: 'ACK', payload: {ok: true}});
}
