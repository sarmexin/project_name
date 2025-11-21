//const { defineConfig } = require('@vue/cli-service')
//module.exports = defineConfig({
//  transpileDependencies: true
//})

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/project_name/'
    : '/',
  outputDir: 'dist',
  assetsDir: 'static'
}