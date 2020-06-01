# vue开发小技巧

## 依赖库分析工具
1. 安装本地依赖
```
npm i -D webpack-bundle-analyzer
```
2. vue.config.js 添加配置
```
module.exports = {    
    chainWebpack: config => {
        config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    },
}
```
## 查看webpack配置信息
```
vue inspect --mode production
vue instpect --rule js // 举一反三
或
npx vue-cli-service inspect --mode development
```

## vuex持久化和开发时log
> 目前没发现可以排除某个字段的方法

```
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import createLogger from 'vuex/dist/logger'

import demo from './demo'

Vue.use(Vuex)

const persistedStateOpt = {
  // storage: window.sessionStorage, // 默认是用localStorage，可以用sessionStorage，也可以改用coikie（参考：https://www.npmjs.com/package/vuex-persistedstate）
  // paths: ['theme', 'menu', 'demo.title'], // 如果想持久化一个模块，如：theme、menu里的所有数据或'demo.title'。它跟reducer是不能共用的，配置了reducer，paths失效。
  // reducer: function (val) { // 如果要选择持久化部分数据，请把reducer放开。这个方法用于部分数据持久化。
  //   return { // 需要持久化的对象，对象为空为所有数据都不持久化
  //     menu, // 如果放置一个模块，这个模块里的getters、actions和mutations都会在storage里（是一个空对象），paths则不会有getters、actions和mutations
  //     demo: {
  //       title: val.demo.title
  //     }
  //   }
  // }
}

export default new Vuex.Store({
  modules: {
    demo
  },
  plugins: process.env.NODE_ENV === 'production' ? [createPersistedState(persistedStateOpt)] : [createLogger(), createPersistedState(persistedStateOpt)]
})

```

## 前端加密
> 一般给个md5加密就可以了。

```
npm install md5 -S

let password = md5(password)
```

## 清除定时器
不用在组件钩子函数中清除了，任何地方都可以绑定。
```
this.$once('hook:beforeDestory',()=>{
  clearInterval(timer);
  timer = null;
})
```
