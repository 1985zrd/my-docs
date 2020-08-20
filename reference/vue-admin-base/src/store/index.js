import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import createLogger from 'vuex/dist/logger'

import menu from './menu' // 动态添加的路由表
import demo from './demo'
import theme from './theme'

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
    theme,
    menu,
    demo
  },
  plugins: process.env.NODE_ENV === 'production' ? [createPersistedState(persistedStateOpt)] : [createLogger(), createPersistedState(persistedStateOpt)]
})
