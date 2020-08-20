module.exports = {
  root: true,
  env: {
    node: true
  },
  // extends: ["plugin:vue/essential", "@vue/standard"],
  extends: ['standard', 'plugin:vue/essential'],
  plugins: ['html'],
  rules: {
    'standard/no-callback-literal': 0,//取消回调中必须传递Error对象
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
