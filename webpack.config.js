module.exports = {
    mode: 'development', // 开发模式
    entry: './src/index.js', // 输入 打包入口
    output: { // 输出 打包输出
        filename: 'bundle.js'
    },
    devServer: { // 开发模式下服务器设置
        port: 8080, // 端口
        static: 'www' // 静态文件目录, 当前www文件夹, 默认访问index.html
    }
}
