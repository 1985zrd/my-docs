import * as types from './types'

export default {
  [types.SET_THEME] ({ commit }, theme) {
    commit(types.SET_THEME, theme)
  },
  [types.SET_THEME_COLOR] ({ commit }, themeColor) {
    commit(types.SET_THEME_COLOR, themeColor)
  }
}
