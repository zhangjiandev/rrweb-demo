// SafeIndexedDBQueue.ts
import { get, set, update } from 'idb-keyval';

export class SafeIndexedDBQueue<T> {
    private queueKey: string;
    private fallbackQueue: T[] = [];
    private indexedDBAvailable: boolean = true;

    constructor(queueKey: string) {
        this.queueKey = queueKey;
        this.checkIndexedDB().then((ok) => {
            this.indexedDBAvailable = ok;
        });
    }

    private async checkIndexedDB(): Promise<boolean> {
        if (!('indexedDB' in window)) return false;
        try {
            const testKey = '__idb_test__';
            await set(testKey, 'test');
            await get(testKey);
            return true;
        } catch (e) {
            console.warn('[SafeQueue] IndexedDB not available, falling back to memory', e);
            return false;
        }
    }

    async add(item: T): Promise<void> {
        if (this.indexedDBAvailable) {
            await update(this.queueKey, (items: T[] = []) => [...items, item]);
        } else {
            this.fallbackQueue.push(item);
        }
    }

    async addBatch(items: T[]): Promise<void> {
        if (this.indexedDBAvailable) {
            await update(this.queueKey, (old: T[] = []) => [...old, ...items]);
        } else {
            this.fallbackQueue.push(...items);
        }
    }

    async flush(callback: (batch: T[]) => Promise<boolean>): Promise<void> {
        const queue = this.indexedDBAvailable ? await get(this.queueKey) || [] : this.fallbackQueue;

        if (!queue.length) return;

        const success = await callback(queue);
        if (success) {
            if (this.indexedDBAvailable) {
                await set(this.queueKey, []);
            } else {
                this.fallbackQueue.length = 0;
            }
        } else {
            console.warn('[SafeQueue] Flush failed, will retry later');
        }
    }

    async clear(): Promise<void> {
        if (this.indexedDBAvailable) {
            await set(this.queueKey, []);
        } else {
            this.fallbackQueue.length = 0;
        }
    }
}
