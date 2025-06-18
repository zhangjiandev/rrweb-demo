// sw-bridge.ts
import {registerServiceWorker} from "./register-sw";

let swReady: ServiceWorkerRegistration | null = null;

export async function ensureServiceWorkerReady(): Promise<ServiceWorkerRegistration | null> {
    if (swReady) return swReady;
    swReady = await registerServiceWorker('/sw.js');
    return swReady;
}

export function postToSW(data: any) {
    //ensureServiceWorkerReady().then(() => {
        if (swReady?.active) {
            swReady.active.postMessage(data);
        } else {
            console.warn('[SW] Not ready to post message');
        }
    //})
}
