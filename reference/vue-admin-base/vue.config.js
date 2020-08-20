var path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const createThemeColorReplacerPlugin = require('./config/plugin.config')

// 查找路径
function resolve (dir) {
  return path.join(__dirname, dir)
}

// 压缩js
const compress = new CompressionWebpackPlugin({
  filename: info => {
    return `${info.path}.gz${info.query}`
  },
  algorithm: 'gzip',
  threshold: 10240,
  test: new RegExp('\\.(' + ['js'].join('|') + ')$'),
  minRatio: 0.8,
  deleteOriginalAssets: false
})

const env = process.env.NODE_ENV

module.exports = {
  publicPath: '/',
  productionSourceMap: false, // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
  css: {
    loaderOptions: {
      less: {
        modifyVars: {},
        javascriptEnabled: true
      }
    },
    extract: true
  },
  chainWebpack: config => {
    // 配置别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@api', resolve('src/api'))
      .set('@components', resolve('src/components'))
      .set('@config', resolve('src/config'))
      .set('@store', resolve('src/store'))
      .set('@utils', resolve('src/utils'))
      .set('@http', resolve('src/http'))
      .set('@layouts', resolve('src/layouts'))

    config.optimization.minimize(true) // 最小化压缩
    config.optimization.splitChunks({
      // 分割代码
      chunks: 'all'
    })

    // // 用cdn方式引入
    // config.externals({
    //   'vue': 'Vue',
    //   'vuex': 'Vuex',
    //   'vue-router': 'VueRouter',
    //   'axios': 'axios'
    // })

    // 打包文件带hash
    config.output.filename('[name].[hash].js').end()
  },
  configureWebpack: config => {
    // 入口文件
    config.entry.app = ['babel-polyfill', './src/main.js']

    // 只有打包生产环境才需要将console删除
    if (env === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = [
        'console.log'
      ]
    }
    return {
      // 压缩代码
      plugins: [createThemeColorReplacerPlugin(), compress]
    }
  },
  devServer: {
    before (app) {
      app.get(/.*.(js) | .*.*.(js)$/, (req, res, next) => {
        req.url = req.url + '.gz'
        res.set('Content-Encoding', 'gzip')
        next()
      })
    },
    disableHostCheck: true,
    // host: 'localhost', // 要设置当前访问的ip 否则失效
    open: true // 浏览器自动打开页面
    // proxy: { // 代理
    // '/': {
    //   target: '目标网址',
    //   ws: true,
    //   changeOrigin: true,
    //   pathRewrite: {
    //     '^/api': ''
    //   }
    // }
    // }
  },
  parallel: require('os').cpus().length > 1 // 构建时开启多进程处理babel编译
}
// 查看webpack配置信息参考https://www.cnblogs.com/cag2050/p/10523096.html
