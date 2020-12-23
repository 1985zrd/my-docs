# vue开发小技巧
> 每个项目情况都不一样，使用时需根据当前项目修改。

## postcss
```js
// postcss.config.js
module.exports = ({ file }) => {
  let remUnit = null // 判断条件vant插件使用1倍,自定义组件使用2倍
  if (file && file.dirname && file.dirname.indexOf('vant') > -1) { remUnit = 100 } else { remUnit = 200 }
  return { plugins: {
    'postcss-import': {},
    'postcss-url': {},
    autoprefixer: {},
    'postcss-lazyimagecss': {},
    'postcss-pxtorem': {
      rootValue: remUnit,
      prop_white_list: [],
      mediaQuery: false,
      selectorBlackList: [/html/, /body/, /\.baseWidth/],
      minPixelValue: 2
    },
    cssnano: {
      preset: [
        'default',
        {
          autoprefixer: false,
          reduceIdents: false,
          mergeIdents: true,
          zindex: false
        }
      ]
    }
  }
  }
}
// 或者
'postcss-pxtorem': {
  rootValue ({ file }) {
    console.log(file)
    return file.indexOf('vant') !== -1 ? 37.5 : 75
  },
  prop_white_list: [],
  mediaQuery: false,
  selectorBlackList: [/html/, /body/, /\.baseWidth/],
  minPixelValue: 2
},
```

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

## 动态路由
```js
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: () => {
      return import('../views/About.vue')
    }
  }
]

const router = new VueRouter({
  mode,
  routes: routes
})
/**
 * 为了防止重复添加路由
 * 重新定义$addRoutes,调用这个方法来添加路由，这个方法会先重置路由
 * 这个路由只会包括非权限页，比如登录页，再调用router.addRoutes添加权限路由
 */
router.$addRoutes = (params) => {
  // 替换现有router的routes
  router.matcher = new VueRouter({ // 重置路由规则
    mode,
    routes
  }).matcher
  router.addRoutes(params) // 添加路由
}

export default router
```

## axios二次封装
```js
// http.js
import axios from 'axios'
import globalConfig from '@/config/index'
import loading from './loading'
import { Message } from 'element-ui'

const baseURL = ''

axios.defaults.withCredentials = true

const $request = axios.create({
  baseURL: baseURL,
  timeout: 1000*60
})

$request.interceptors.request.use(config => {
  // console.log(config)
  const token = store.state.token || '' // store为vuex的store
  config.headers.common['Authorization'] = 'Bearer ' + token
  loading.start() // 如果不需要loading，可以不用
  return config
}, error => {
  return Promise.reject(error)
})

$request.interceptors.response.use(response => {
  loading.end()
  if (response.data.code === 401) { // 未登录状态 清除用户信息
    // 清除用户信息
    $nuxt.$store.commit('setLogin', false)
    $nuxt.$store.commit('setUsername', '')
  }
  if (response.data.code !== 200) {
    Message({
      message: response.data.message
    })
  }
  return response.data
}, error => {
  // 这里返回系统错误，可以在这里做统一处理
  loading.end()
  Message({
    message: '服务出错了'
  })
  return Promise.reject(error)
})

const cancelToken = () => {
  return new axios.CancelToken(cancel => {
    globalConfig.cancelTokenList.push({ cancel }) // 收集需要取消的请求，在路由跳转的时候，请求还没结束的请求都将取消
  })
}

const getData = (url, data = {}, method = 'GET', headers, responseType = 'json') => {
  let type = method.toUpperCase()
  const requestConfig = {
    url: url,
    method: type,
    headers,
    responseType, // json blob stream text document arraybuffer
    cancelToken: cancelToken()
  }
  if (type === 'GET' || type === 'DELETE') {
    // if (!!window.ActiveXObject || 'ActiveXObject' in window) {
    //   data.t = new Date().getTime()
    // }
    data.t = new Date().getTime()
    requestConfig.params = data
  } else {
    requestConfig.data = data
  }
  return $request(requestConfig)
}

export default getData
```

```js
// loading.js  合并多个请求的loading
import globalConfig from '@/config'
import { Loading } from 'element-ui'

let requestNumber = 0

let loading

export default {
  start () {
    if (requestNumber === 0) {
      loading = Loading.service({
        text: '加载中...'
      })
    }
    requestNumber++
  },
  close () {
    if (requestNumber <= 0) return
    requestNumber--
    if (requestNumber === 0) {
      globalConfig.cancelTokenList = [] // 所有请求都结束后，清空
      loading && loading.close()
    }
  },
  end () {
    setTimeout(this.close, 300)
  }
}
```
```js
// 路由跳转时，如果还有没结束的请求，都给取消了
// 路由切换检测是否强行中断
router.beforeEach((to, from, next) => {
  if (Vue.$httpRequestList && Vue.$httpRequestList.length) {
    Vue.$httpRequestList.forEach(request => {
      // 取消没有响应的请求
      request.cancel()
    })
    // 请求取消响应的数据
    Vue.$httpRequestList = []
  }
  next()
})
```
