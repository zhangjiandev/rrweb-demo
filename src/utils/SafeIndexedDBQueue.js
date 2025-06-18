"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeIndexedDBQueue = void 0;
// SafeIndexedDBQueue.ts
const idb_keyval_1 = require("idb-keyval");
class SafeIndexedDBQueue {
    constructor(queueKey) {
        this.fallbackQueue = [];
        this.indexedDBAvailable = true;
        this.queueKey = queueKey;
        this.checkIndexedDB().then((ok) => {
            this.indexedDBAvailable = ok;
        });
    }
    checkIndexedDB() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!('indexedDB' in window))
                return false;
            try {
                const testKey = '__idb_test__';
                yield (0, idb_keyval_1.set)(testKey, 'test');
                yield (0, idb_keyval_1.get)(testKey);
                return true;
            }
            catch (e) {
                console.warn('[SafeQueue] IndexedDB not available, falling back to memory');
                return false;
            }
        });
    }
    add(item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.indexedDBAvailable) {
                yield (0, idb_keyval_1.update)(this.queueKey, (items = []) => [...items, item]);
            }
            else {
                this.fallbackQueue.push(item);
            }
        });
    }
    addBatch(items) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.indexedDBAvailable) {
                yield (0, idb_keyval_1.update)(this.queueKey, (old = []) => [...old, ...items]);
            }
            else {
                this.fallbackQueue.push(...items);
            }
        });
    }
    flush(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const queue = this.indexedDBAvailable ? (yield (0, idb_keyval_1.get)(this.queueKey)) || [] : this.fallbackQueue;
            if (!queue.length)
                return;
            const success = yield callback(queue);
            if (success) {
                if (this.indexedDBAvailable) {
                    yield (0, idb_keyval_1.set)(this.queueKey, []);
                }
                else {
                    this.fallbackQueue.length = 0;
                }
            }
            else {
                console.warn('[SafeQueue] Flush failed, will retry later');
            }
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.indexedDBAvailable) {
                yield (0, idb_keyval_1.set)(this.queueKey, []);
            }
            else {
                this.fallbackQueue.length = 0;
            }
        });
    }
}
exports.SafeIndexedDBQueue = SafeIndexedDBQueue;
