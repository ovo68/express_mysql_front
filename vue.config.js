module.exports = {
  devServer: {
    port: 5155, // 端口号
    host: '0.0.0.0',
    https: false, // https:{type:Boolean}
    proxy: {
      '/api': {
        target: 'http://localhost:6166/', // 需要代理的接口前缀，当前项目未使用代理
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api/': '',
        },
      },
    }, // 配置多个代理
  },
}
