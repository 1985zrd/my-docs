/**
 * 2019-11-07
 * Author:CaoZhenHui
 * dynamicRoutes:这里是自己配置的全量路由表，但是还未添加到真正的router中，通过后台返回的的权限，递归出有权限的路由，动态加入路由表
 */

const dynamicRoutes = [
  // 例子
  // {
  //   path: '/father',
  //   component: () => {
  //     return import('@/views/Father')
  //   },
  //   name: 'father',
  //   meta: {
  //     name: '父亲'
  //   },
  //   children: [
  //     {
  //       path: 'son',
  //       component: () => {
  //         return import('@/views/Father/Son')
  //       },
  //       name: 'son',
  //       meta: {
  //         name: '儿子'
  //       }
  //     }
  //   ]
  // }
]

export default dynamicRoutes
