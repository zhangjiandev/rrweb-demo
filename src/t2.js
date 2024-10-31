const pako = require('pako');
const polyfill = require('../public/base64')
const {atob, btoa} = polyfill;

// 将 Base64 字符串转换为 Uint8Array
function base64ToUint8Array(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

// 将 Uint8Array 转为 Base64
function uint8ArrayToBase64(uint8Array) {
    let binaryString = '';
    for (let i = 0; i < uint8Array.length; i++) {
        binaryString += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binaryString);
}

// 示例 Base64 字符串
const base64String = "SGVsbG8gd29ybGQh";  // Base64 编码的 "Hello world!"
//const base64String = "data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjMDAwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGRhdGEtbmFtZT0iTGF5ZXIgMSIgdmlld0JveD0iMCAwIDUwIDUwIiB4PSIwcHgiIHk9IjBweCI+PHRpdGxlPkRlc2lnbl90bnA8L3RpdGxlPjxwYXRoIGQ9Ik00OC43MSw0Mi45MUwzNC4wOCwyOC4yOSw0NC4zMywxOEExLDEsMCwwLDAsNDQsMTYuMzlMMi4zNSwxLjA2QTEsMSwwLDAsMCwxLjA2LDIuMzVMMTYuMzksNDRhMSwxLDAsMCwwLDEuNjUuMzZMMjguMjksMzQuMDgsNDIuOTEsNDguNzFhMSwxLDAsMCwwLDEuNDEsMGw0LjM4LTQuMzhBMSwxLDAsMCwwLDQ4LjcxLDQyLjkxWm0tNS4wOSwzLjY3TDI5LDMyYTEsMSwwLDAsMC0xLjQxLDBsLTkuODUsOS44NUwzLjY5LDMuNjlsMzguMTIsMTRMMzIsMjcuNThBMSwxLDAsMCwwLDMyLDI5TDQ2LjU5LDQzLjYyWiI+PC9wYXRoPjwvc3ZnPg==";  // Base64 编码的 "Hello world!"

// 1. 将 Base64 字符串转换为二进制数据
const binaryData = base64ToUint8Array(base64String);

// 2. 使用 pako 进行压缩
const compressed = pako.deflate(binaryData);

// 3. 将压缩后的数据转为 Base64 格式（如果需要传输或存储）
const compressedBase64 = uint8ArrayToBase64(compressed);

console.log('压缩后的 Base64:', compressed);


// 1. 将压缩后的 Base64 字符串转换回 Uint8Array
const compressedData = base64ToUint8Array(compressedBase64);

// 2. 使用 pako 解压缩
const decompressed = pako.inflate(compressed);

console.log('解压缩后的数据:', uint8ArrayToBase64(decompressed));


function zip(str) {
    let binaryString = pako.gzip(encodeURIComponent(str), {to: 'string'});
    return btoa(binaryString)
}

function unzip(b64Data) {
    let strData = atob(b64Data),
        charData = strData.split('').map(function (x) {
            return x.charCodeAt(0);
        }),
        binData = new Uint8Array(charData),
        data = pako.inflate(binData);
    strData = String.fromCharCode.apply(null, new Uint16Array(data));
    return decodeURIComponent(strData)
}

const compressedStr = zip(base64String);
console.log('compressedStr:', compressedStr);

const decompressedStr = unzip(decompressed);
console.log('decompressedStr:', decompressedStr);
