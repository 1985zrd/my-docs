/*
 * @Description: 页面快速生成脚本
 * @Date: 2018-12-06 10:28:08
 * @LastEditTime: 2018-12-10 09:43:50
 */
const fs = require('fs')
const path = require('path')
const basePath = path.resolve(__dirname, '../src')

const tepName = process.argv[2]
if (!tepName) {
  console.log('文件夹名称不能为空！')
  console.log('示例：npm run tep viewName')
  process.exit(0)
}

/**
 * @msg: vue页面模版
 */
const VueTep = `
<template>
    <div class="${tepName}">

    </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: '${tepName}',
  data () {
    return {}
  },
  components: {},
  methods: {}
}
</script>

<style lang="scss" scoped>
@import "./${tepName}.scss"
</style>
`

// scss 模版
const scssTep = `
.${tepName} {

}
`

// api 接口模版
const apiTep = `import getData from '@http/index'

export const test = (data) => getData('url', data, 'METHOD')

`

fs.mkdirSync(`${basePath}/views/${tepName}`) // mkdir

process.chdir(`${basePath}/views/${tepName}`) // cd views
fs.writeFileSync(`${tepName}.vue`, VueTep) // vue
fs.writeFileSync(`${tepName}.scss`, scssTep) // scss

process.chdir(`${basePath}/api`) // cd api
fs.writeFileSync(`${tepName}.js`, apiTep) // api

process.exit(0)
