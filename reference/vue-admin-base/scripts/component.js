/*
 * @Description: 组件快速生成脚本
 */

const fs = require('fs')
const path = require('path')
const basePath = path.resolve(__dirname, '../src')

const comName = process.argv[2]
if (!comName) {
  console.log('文件夹名称不能为空！')
  console.log('示例：npm run com ComponentName')
  process.exit(0)
}

/**
 * @msg: vue页面模版
 */
const VueTep = `
<template>
    <div class="${comName}">

    </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: '${comName}',
  data () {
    return {}
  },
  components: {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.${comName}{

}
</style>
`

fs.mkdirSync(`${basePath}/components/${comName}`) // mkdir

process.chdir(`${basePath}/components/${comName}`) // cd components
fs.writeFileSync(`${comName}.vue`, VueTep) // vue

process.exit(0)
