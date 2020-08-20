import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import store from '@/store'

Vue.use(VueRouter)

const mode = 'history'

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

router.onReady(() => {
  // 刷新页面，判断如果登录过并且有权限列表，那么动态加入权限路由
  if (store.state.menu.routes && store.state.menu.routes.length) {
    store.dispatch('getAsyncRoutes')
  }
})

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

export default router
