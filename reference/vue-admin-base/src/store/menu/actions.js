import * as types from './types'
import router from '@/router'
import dynamicRoutes from '@/router/dynamicRoutes.js'

// 筛选出有权限路由
function filterRouter (userRouter = [], dynamicRouter = []) {
  /**
    * @param  {Array} userRouter 后台返回的用户权限json
    * @param  {Array} dynamicRouter  所有路由的集合
    * @return {Array} realRoutes 过滤后的路由
  */
  const realRoutes = []
  userRouter.forEach(u => {
    for (let index = 0; index < dynamicRouter.length; index++) {
      const d = dynamicRouter[index]
      if (u.name === d.name) {
        // 创建新的对象
        const route = {
          path: d.path,
          component: d.component,
          name: d.name,
          meta: {
            name: d.meta.name
          }
        }

        // 如果后台返回的有子路由递归当前方法加入当前子路由
        if (u.children && u.children.length > 0) {
          route.children = filterRouter(u.children, d.children)
        }

        realRoutes.push(route)
        break
      }
    }
  })
  return realRoutes
}

export default {
  // 获取后台的路由权限
  getAsyncRoutes ({ commit }) {
    /**
      * @param  {Array} res 后台返回的用户权限json
    */
    setTimeout(() => {
      const res = [
        // 后台数据参考格式
        // {
        //   name: 'father',
        //   children: [
        //     {
        //       name: 'son'
        //     }
        //   ]
        // }
      ]
      // 筛选出有权限路由
      let menu = filterRouter(res, dynamicRoutes)
      // 将404页面加到最后
      menu = menu.concat([
        {
          path: '*',
          name: 'errorPage',
          meta: {
            name: '找不到该页面~'
          },
          component: () => import('@/views/errorPage')
        }
      ])
      // 存入session
      // TODO:是否需要存，退出登陆处理
      // if (!window.sessionStorage.getItem('menu')) {
      //   window.sessionStorage.setItem('menu', JSON.stringify(menu))
      // }
      router.$addRoutes(menu)
      commit(types.ADD_ROUTER, menu)
    }, 1000)
  }
}
