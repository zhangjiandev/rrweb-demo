import { SafeIndexedDBQueue } from '@/utils/SafeIndexedDBQueue';
import { sendMessageToServiceWorker } from '@/utils/sendMessageToServiceWorker';

export async function flushQueueToServiceWorker(queue: SafeIndexedDBQueue<any>) {
    if (!navigator.onLine) {
        console.warn('[FLUSH] Offline, skip flush');
        return;
    }

    const swReady = await navigator.serviceWorker.ready;
    const sw = swReady.active;

    if (!sw) {
        console.warn('[FLUSH] Service Worker not active');
        return;
    }

    const MAX_RETRIES = 3;   // 最大重试次数
    const RETRY_DELAY = 5000; // 重试间隔（5秒）

    await queue.flush(async (events) => {
        if (!events.length) return true; // nothing to flush

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                await sendMessageToServiceWorker({
                    type: 'FLUSH_EVENTS',
                    payload: events
                });
                console.log(`[FLUSH] Sent events to SW successfully on attempt ${attempt}`);
                return true; // 成功，直接 return
            } catch (err) {
                console.warn(`[FLUSH] Attempt ${attempt} failed:`, err);

                if (attempt < MAX_RETRIES) {
                    console.log(`[FLUSH] Retrying in ${RETRY_DELAY / 1000} seconds...`);
                    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY)); // 延迟再试
                } else {
                    console.error('[FLUSH] All retries failed, will keep events in queue');
                    return false; // 最后一次失败，flush失败，保留数据
                }
            }
        }
        return false; // 理论上不会走到这里
    });
}

export async function handleBeforeUnload(queue: SafeIndexedDBQueue<any>) {
    if (queue) {
        try {
            // 最后一波 flush
            await flushQueueToServiceWorker(queue);
            console.log('[FLUSH] Last flush before unload success');
        } catch (err) {
            console.warn('[FLUSH] Last flush before unload failed:', err);
        }
    }
}

