export function modifyImgSrcPlugin() {
    return {
        name: 'modify-img-src-plugin',

        observer: (mutationBuffer, _mutationCb) => {
            mutationBuffer.processMutations = (mutations) => {
                console.log("mutations--------",  mutations)
                for (const mutation of mutations) {
                    if (
                        mutation.type === 'attributes' &&
                        mutation.attributeName === 'src' &&
                        mutation.target.tagName.toLowerCase() === 'img'
                    ) {
                        // 修改 img.src，可以替换为你需要的 URL
                        mutation.target.setAttribute('src', 'https://your-custom-url.com/custom-image.jpg');
                    }
                }
            };
        }
    };
}