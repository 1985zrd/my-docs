import * as types from './types'

export default {
  [types.ADD_ROUTER] (state, arr) { // 加入权限路由
    state.routes = arr
  }
}
