# Nuxt.js初探

> Nuxt.js是一款基于vue的开源框架。我主要用来它做服务器端渲染，它还可以用来做为静态站生成器。

## 为什么要用Nuxt.js
我们用框架（vue或react）开发一个项目，页面在最开始加载的时候，是个空页面，页面body中只有一个div，我们需要从后台获取数据，通过框架把组件生成dom填充到页面上，才能呈现最终页面。

##### 所以就产生了问题：
1. SEO不能抓取内容
2. 获取数据阶段页面是空白的
3. ...

##### 如何解决问题呢？
vue官方给出的解决办法是服务器端渲染（SSR）（只部分页面的话也可以用Prerendering）。SSR就是将组件渲染为服务器端的HTML字符串，直接发送到浏览器。它需要依赖vue-server-renderer，客户端和服务器端代码都需要额外处理，感觉很麻烦（可能是我没认真看）。官方推荐使用Nuxt.js。

## Nuxt.js开始一个项目

##### 创建一个项目
```
npx create-nuxt-app <项目名>
```
然后就是配置信息

这里需要注意的是，choose rendering mode：Universal（SSR）or Single Page App。**推荐选择Universal（SSR）**。因为Single Page App模式只被搜索引擎收录一个页面，而Universal（SSR）会收录所有的路由页面（百度查找的）。可以在`nuxt.config.js`中`mode`里找到。

##### 运行
`npm run dev`，它运行的是`nuxt`命令

##### 编译打包
`npm run build`，它运行的是`nuxt build`命令

##### 生产上运行。以生产模式启动一个Web服务器 (需要先执行nuxt build)。
`npm start`，它运行的是`nuxt start`命令

## 配置页面头部信息
在`nuxt.config.js`中配置`head`
```
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no, shrink-to-fit=no' },
      { 'http-equiv': 'X-UA-Compatible', 'content': 'IE-edge' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    title: '春香' || process.env.npm_package_name || '',
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  }
```

## 请求代理
如果我们需要把以某个字段开始的请求，代理到另一个服务上，需要在`nuxt.config.js`中配置`proxy`。
```
  proxy: {
    '/api': {
      target: 'http://localhost:9000',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api'
      }
    }
  },
```
## vuex使用
在`store`文件夹下新建`index.js`，内容如下：
```
export const state = () => ({
  isLogin: false,
  username: '',
  activeIndex: 0,
  categories: []
})

export const mutations = {
  setLogin (state, isLogin) {
    state.isLogin = isLogin
  },
  setUsername (state, username) {
    state.username = username
  },
  setActiveIndex (state, index) {
    state.activeIndex = index
  },
  setCategory (state, categories) {
    state.categories = [...categories]
  }
}
```
在组件中使用`this.$store`

我把vuex的数据做了**持久化**，用的`vuex-persistedstate`。

首先在`plugins`文件夹下新建`localStorage.js`，内容：
```
import createPersistedState from 'vuex-persistedstate'

export default ({store}) => {
  createPersistedState({
    storage: window.sessionStorage
  })(store)
}
```
然后在`nuxt.config.js`中配置`plugins`，`ssr: false`。
```
  plugins: [
    { src: '@/plugins/localStorage.js', ssr: false }
  ],
```
## 路由
写在`pages`文件夹里的`.vue`文件，默认会生成一个路由，路径为文件名。

我们有时候需要全局的路由守卫，需要在`plugins`文件夹下新建`router.js`，内容：
```
import globalConfig from '@/config'
export default ({ app }) => {
  app.router.beforeEach((to, from, next) => {
    if (globalConfig.cancelTokenList && globalConfig.cancelTokenList.length) {
      globalConfig.cancelTokenList.forEach(request => {
        request.cancel()
      })
    }
    globalConfig.cancelTokenList = []
    next()
  })
}
```
然后在`nuxt.config.js`中配置`plugins`，`ssr: true`。
```
  plugins: [
    { src: '@/plugins/router.js', ssr: true },
  ],
```
通过这种方式可以获取到一些实例，如app、store...

## vue扩展插件或方法
给vue添加过滤器或使用UI框架，方法都差不多。下面以过滤器为例。

在`plugins`文件夹下新建`filter.js`，内容：
```
import Vue from 'vue'
import moment from 'moment'

export default () => {
  Vue.filter('formatTime', function (time) {
    return moment(time).format('YYYY-MM-DD HH:mm:ss')
  })
  Vue.filter('username', function (val) {
    return val.replace(/(\d{3})\d{4}(\d{}4)/, '$1****$2')
  })
}
```
然后在`nuxt.config.js`中配置`plugins`，`ssr: true`。
```
  plugins: [
    { src: '@/plugins/filter.js', ssr: true },
  ],
```

## 全局的$nuxt
有时候我们需要在外部js中获取一些全局对象，譬如，我们需要在axios的请求拦截里，做store存储，或在返回拦截里，清除一些登录状态。这时候可以用$nuxt.$store（如果有更好的，请告诉我）,$nuxt对象得页面初始化完了才可以拿到。
```
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
```
## 异步数据
`nuxt.js`提供了`asyncData`方法，让我们在**设置组件的数据之前**能异步获取或处理数据。`asyncData`方法返回的数据与`data`方法返回的数据，一并返回给当前组件。
```
export default {
  asyncData ({ params }) {
    return axios.get(`https://my-api/posts/${params.id}`)
      .then((res) => {
        return { title: res.data.title }
      })
  }
}
```

## 最后附上我的`nuxt.config.js`配置
```

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no, shrink-to-fit=no' },
      { 'http-equiv': 'X-UA-Compatible', 'content': 'IE-edge' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    title: '春香' || process.env.npm_package_name || '',
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: ['normalize.css', '@/assets/font/iconfont.css', '@/assets/css/main.css', '@/assets/sass/common.scss'],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '@/plugins/vue-mavon-editor', ssr: true },
    { src: '@/plugins/element-ui', ssr: true },
    { src: '@/plugins/router.js', ssr: true },
    { src: '@/plugins/filter.js', ssr: true },
    { src: '@/plugins/localStorage.js', ssr: false }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: ['@nuxtjs/axios'],
  axios: {
    proxy: true
  },
  proxy: {
    '/api': {
      target: 'http://localhost:9000',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api'
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    babel: {
      plugins: [
        ["component", {"libraryName": "element-ui", "styleLibraryName": "theme-chalk"}]
      ]
    },
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}

```
