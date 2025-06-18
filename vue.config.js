module.exports = {
    lintOnSave: false,
    devServer: {
        watchOptions: {
            ignored: ['**/public/pdf/**'], // 忽略 src/assets/images 目录
        },
    },
}