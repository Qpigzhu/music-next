module.exports = {
  css: {
    loaderOptions: {
      sass: {
        // 全局引入变量和 mixin
        additionalData: `
              @import "@/assets/scss/variable.scss";
              @import "@/assets/scss/mixin.scss";
            `
      }
    }
  },

  lintOnSave: false,
  devServer: {
    overlay: {
      warning: false,
      errors: false
    },
    proxy: {
      '/api': {
        // target: 'http://172.16.15.27:8081',
        target: 'http://127.0.0.1:9001/',
        secure: false, // false为http访问，true为https访问
        changeOrigin: true, // 跨域访问设置，true代表跨域
        ws: true,
        pathRewrite: { // 路径改写规则
          '^/api': '' // 以/proxy/为开头的改写为''
        }
      }
    }
  }
}