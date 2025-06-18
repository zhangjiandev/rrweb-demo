// utils/sendMessageToServiceWorker.ts

export async function sendMessageToServiceWorker<T = any>(
    message: any,
    timeoutMs = 2000
): Promise<T> {
    if (!navigator.serviceWorker.controller) {
        throw new Error('No active Service Worker controller.');
    }

    return new Promise<T>((resolve, reject) => {
        const channel = new MessageChannel();

        // 等待 Service Worker 的回复
        channel.port1.onmessage = (event) => {
            if (event.data && event.data.type === 'ACK') {
                console.log('onmessage ack success!');
                resolve(event.data.payload as T); // 成功
            } else {
                reject(new Error('Invalid response from Service Worker'));
            }
        };

        // 向 Service Worker 发送消息，并带上 port2
        navigator.serviceWorker.controller.postMessage(message, [channel.port2]);

        // 超时保护
        setTimeout(() => {
            reject(new Error('Timeout waiting for Service Worker ACK'));
        }, timeoutMs);
    });
}
