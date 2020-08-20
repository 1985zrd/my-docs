import Vue from 'vue'
import App from './App.vue'
// import router from './router' // 权限路由
import router from './router/staticRoutes' // 静态路由
import store from './store'
import config from './config/index'
import ikit from 'ikit'
import 'ikit/lib/ikit.css'

import {
  fixNum,
  GetDateDiff,
  formatDate,
  jsGetAge,
  sum,
  round,
  byteSize
} from './utils'

Vue.config.productionTip = false

Vue.use(ikit)

const filters = {
  fixNum,
  GetDateDiff,
  formatDate,
  sum,
  round,
  byteSize,
  jsGetAge
}

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
var { tjb } = config
console.log('tjb', tjb)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
