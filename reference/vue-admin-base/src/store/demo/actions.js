import * as types from './types'

export default {
  [types.SET_TITLE] ({ commit }, title) {
    commit(types.SET_TITLE, title)
  }
}
