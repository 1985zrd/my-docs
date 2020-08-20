import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/Login.vue')
  },
  {
    path: '*',
    name: 'errorPage',
    meta: {
      name: '找不到该页面~'
    },
    component: () => import('@/views/errorPage')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes: routes
})

// 路由切换检测是否强行中断
router.beforeEach((to, from, next) => {
  if (Vue.$httpRequestList && Vue.$httpRequestList.length > 0) {
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
