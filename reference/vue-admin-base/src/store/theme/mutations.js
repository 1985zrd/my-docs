import * as types from './types'

export default {
  [types.SET_THEME] (state, theme) {
    state.theme = theme
  },
  [types.SET_THEME_COLOR] (state, themeColor) {
    state.themeColor = themeColor
  }
}
