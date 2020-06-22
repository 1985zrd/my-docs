# 基于vue的UI组件库开发（工程）

> 一个UI组件库，应该包含下载安装、ui组件、文档、测试（如果想面向更多的人）等等。

开发一个组件库，前期需要理清一些工程化方面的问题。其中有一个我觉得非常重要的问题，就是组件的按需引入和完整引入。

- 按需引入，就是用到了哪个组件就引入哪个组件，项目里没有用到的组件，则不打包到项目文件中。
```js
// 如：element-ui
import Button from 'dd-ui-vue/lib/button'
// 也可以
import { Button } from 'dd-ui-vue';

Vue.use(Button) // 或在局部注册
```
- 完整引入，就是在打包的项目文件中，包含所有的组件。
```js
import ddUi from 'dd-ui-vue';
Vue.use(ddUi)
```

我们参考一下element的按需引入是怎么做的，它是将每个组件都单独打包了，借助 [babel-plugin-component](https://www.npmjs.com/package/babel-plugin-component) 实现的，将 .babelrc 修改为：
```js
// .babelrc
{
  "presets": ["@vue/cli-plugin-babel/preset"], // 这个是vue/cli创建项目时创建的
  "plugins": [
    [
      "component",
      {
        "libraryName": "dd-ui-vue",
        "style": false // 如果单个组件文件夹中没有style.css文件，则填false。由于我在按需引入的时候也是把样式文件都全部引入的，所以打包的文件里只有一个全部引入的样式文件。如果你需要样式也按需引入，则需要把每个组件的样式单独打包。
      }
    ]
  ]
}
```

`babel-plugin-component`规定了组件目录结构和主题库目录结构，我这里不需要组题库，只提供修改主题变量，这部分会在主题系统的地方说明。

```js
// babel-plugin-component插件规定的组件目录结构
- lib // 'libDir'
  - index.js // 全部加载的入口js
  - style.css //  全部加载的入口css
  - componentA // 组件
    - index.js
    - style.css // 我建议不要按需加载单个组件样式，后面在主题系统的地方会说明原因
  - componentB
    - index.js
    - style.css
```

也就是我只要最终的打包文件按这个目录结构，使用`babel-plugin-component`就可以实现组件按需引入。

## 文件目录

> 跟element-ui差不多。

这里是修改@vue/cli生成的文件夹

```js
|____lib                      // 打包后的库文件
|____build                    // 打包命令执行的文件
|____dist                     // 打包示例文件
|____examples                 // 组件示例。生成使用文档。
|  |____apiDoc                //组件属性，方法说明
|  |____App.vue               
|  |____assets                //示例静态资源
|  |____changeTheme           //切换主题配置
|  |____components            //组件使用示例
|  |____favicon.ico 
|  |____index.html
|  |____main.js
|  |____router                //示例网站路由
|  |____store                 //vuex       
|  |____utils                 //示例工具包
├── packages                  // 组件文件夹
│   |____button               // 按钮
│   |    |____src             // 组件
│   |    |    |____button.vue // 组件
│   |    |____ index.js       // 组件入口文件
│   |____form                 // 表单
│   |____icon                 // 图标
│   |____input                // 输入框
│   |____toast                // 提示
│   |____result               // 结果反馈
│   |____theme                // 样式文件夹
│     |____common             // 公用变量文件夹
│     |  |____colors.scss     // 颜色变量
│     |  |____minxin.scss     // 公用样式块
│     |  |____var.scss        // 全局变量
│     |____index.scss         // 样式主文件
│     |____button.scss        // 按钮样式文件
|____src                     
│     |____ local            
│     |     |____lang         // 国际化
│     |____ index.js          // 入口文件
|____tests                    // 单元测试
|____.eslintrc
|____.gitignore               // git忽略文件
|____.npmignore               // npm忽略文件。库文件上传到npm的时候用到
|____babel.config.js
|____vue.config.js            //vue-cli3 webpack配置文件
|____package-lock.json
|____package.json
```

## 制定规范

一个组件库不可能由一个人来开发，规范必不可少。[详见](../web前端/web前端规范.md)

## 主题系统

项目使用**sass**写样式。

这里不准备搞太复杂的主题系统，只提供修改变量。

在组件库定义变量的时候，使用的是一个默认值，如果在默认值之前有值，这默认值无效，使用定制的值（sass）。

```scss
// var.scss
$--color-primary: #409EFF !default; // sass的默认值
```
使用
```scss
// style.scss 类似element-variables.scss或别的什么名字
// 参考element-ui
/* 改变主题色变量 */
$--color-primary: teal;

/* 改变 icon 字体路径变量，必需 */ // 我还没提供字体，暂时用不上
// $--font-path: '~dd-ui-vue/lib/theme-chalk/fonts';

@import "~dd-ui-vue/packages/theme-chalk/index";
```

## 组件编写

组件都在packages目录下。组件需要支持按需引入，设计的是一个组件一个文件夹，并且都提供一个install方法。这里先简单实现一下。
```js
├── packages                  // 组件文件夹
    |____button               // 按钮
         |____src             // 组件
         |    |____button.vue // 组件
         |____ index.js       // 组件入口文件
```

#### button按钮组件

```vue
// button.vue
<template>
  <button :class="classSet" @click="handleClick">
    <slot></slot>  
  </button>  
</template>

<script>
export default {
  name: 'i-button',
  props: {
    type: {
      type: String,
      default: 'primary'
    }
  },
  computed: {
    classSet() {
      return `d-button d-button--${this.type}`
    }
  },
  methods: {
    handleClick() {
      this.$emit('click');
    }
  }
}
</script>

```
```js
// button/index.js
// 配置对外引用
import Button from './src/button.vue';

// 提供install方法
// 这里提供一次install是为了便于单独引入buttton组件时进行注册
Button.install = function(Vue) {
  Vue.component(Button.name, Button);
};

// 默认导出方式导出
export default Button;

```
```scss
// button.scss
.d-button {
  padding: 0 6px;
  border-radius: 4px;
}
```

#### toast提示组件

```vue
// toast.vue
<template>
  <div v-if="show" class="i-toast--mask">
    <div class="i-toast--dialog">
      <p class="i-toast--content">{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'i-toast',
  data() {
    return {
      show: false,
      message: ''
    }
  },
}
</script>
```

```js
// toast/index.js
import Vue from 'vue';
import Toast from './src/toast'


const toastConstructor =  Vue.extend(Toast);
let instance;

let toast = function(options = {}) {
  if(!instance) {
    instance = new toastConstructor({
      el: document.createElement('div')
    });
  }

  if(instance.show === true) return;

  instance.message = options.message;
  instance.show = true;
  document.body.appendChild(instance.$el)

  let timer = setTimeout(() => {
    instance.show = false;
    clearTimeout(timer);
  }, options.duration || 2000);
}

export default toast

```

```scss
// toast.scss
.i-toast--mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
}
.i-toast--dialog {
  color: $--color-primary;
  max-width: 80vw;
  // background-color: #333;
  background-color: $--color-black;
  padding: 16px;
  box-sizing: border-box;
  border-radius: 4px;
  /* animation: zoomIn .3s ease-out 0s forwards; */
}
.i-toast--content {
  font-size: 16px;
  color: #fff;
}
```

#### 组件总入口

```js
// src/index.js

// 导入按钮组件
import Button from '../packages/button'

import Toast from '../packages/toast'

import '../packages/theme-chalk/index.scss'

import { version } from '../package.json'

// 存储组件列表
const components = [
  Button
]

// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册
const install = function (Vue) {
  // 遍历注册全局组件
  components.forEach(component => {
    Vue.component(component.name, component)
  })

  Vue.prototype.$toast = Toast
  // Vue.prototype.$message = Message
  // Vue.prototype.$confirm = Modal.confirm
  // Vue.prototype.$info = Modal.info
  // Vue.prototype.$success = Modal.success
  // Vue.prototype.$error = Modal.error
  // Vue.prototype.$warning = Modal.warning
  // Vue.prototype.$destroyAll = Modal.destroyAll
  // Vue.prototype.$notification = Notification
}
// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export {
  Button
}

export default {
  version: version,
  // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
  install
}

```

## 组件示例

创建examples文件夹用于本地组件示例和文档输出。

需要处理一下`vue.config.js`，设置示例入口文件为`examples/main.js`，现在可以使用`npm run serve`启动示例了。使用`npm run build`打包完，就可以作为官网文档使用了。

```js
// vue.config.js
var path = require('path')

module.exports = {
  configureWebpack: config => {
    config.entry.app = ['./examples/main.js']

    // config.module.rules.push(
    //   {
    //     // 处理markdown文件
    //     test: /\.md$/,
    //     use: [
    //       {
    //         loader: 'vue-loader'
    //       },
    //       {
    //         loader: require.resolve('./markdownLoader')
    //       }
    //     ]
    //   }
    // )
    // config.plugins.push(createThemeColorReplacerPlugin())
  },
  // 扩展 webpack 配置，使 packages 加入编译
  chainWebpack: config => {
    // @ 默认指向 src 目录，这里要改成 examples
    // 另外也可以新增一个 ~ 指向 packages
    config.resolve.alias
      .set('@', path.resolve('examples'))
      .set('~', path.resolve('src'))
    
   config
      .plugin('webpack-bundle-analyzer')
      .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
  },
  // 以下是pwa配置
  pwa: {
    iconPaths: {
      favicon32: './examples/favicon.ico',
      favicon16: './examples/favicon.ico',
      appleTouchIcon: './examples/favicon.ico',
      maskIcon: './examples/favicon.ico',
      msTileImage: './examples/favicon.ico'
    }
  }
}

```

在views文件夹下创建`button.vue`、`toast`
```js
├──views                      // 视图
    |____button               // 按钮页面
    |____toast                // 提示页面
```

可以根据views文件夹自动生成路由。
```js
// router/index.js
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/App.vue')
  }
]

const pages = require.context('../views/', false, /\.vue$/)

pages.keys().forEach(item => {
  /\/(\w+)\.\w+$/.test(item)
  let name = RegExp.$1.trim()
  routes.push({
    path: `/${name}`,
    name: name,
    component: () => import(`@/views/${name}.vue`)
  })
})

const router = new Router({
  mode: 'hash',
  routes: routes
})

export default router

```


## 文档（使用文档）

运行`npm run build`可以打包示例作为使用文档，还有一些接口说明文档书写起来比较费劲，我们需要.vue文件里能使用.md文件。在`plugins`文件夹下创建`markdownLoader.js`
```js
├──plugins                      // 插件
    |____markdownLoader.js      // 用于加载.md文件
```

```js
// vue.config.js  添加如下代码
config.module.rules.push(
  {
    // 处理markdown文件
    test: /\.md$/,
    use: [
      {
        loader: 'vue-loader'
      },
      {
        loader: require.resolve('./plugins/markdownLoader')
      }
    ]
  }
)
```

```js
// markdownLoader.js
const markdown = require('markdown-it')

function markLoader (src) {
  this.cacheable(false)
  const md = markdown({
    html: true,
    typographer: true
  })
  const html = encodeURIComponent(md.render(src))
  // const html = md.render(src.replace(/</g, '&lt;').replace(/`.*?&lt;.*?`/g, $0 => $0.replace(/&lt;/g, '<')))
  return `
<template>
  <div class="markdown api-container" id="API" data-html="${html}"></div>
</template>
<script>
  export default {
    mounted () {
      this.$el.innerHTML = decodeURIComponent(this.$el.getAttribute('data-html'))
      this.$el.setAttribute('data-html', '')
    }
  }
</script>
`
}

module.exports = markLoader
```

然后我们再创建一个展示.md文件的vue组件
```vue
// components/common/MarkdownRender.vue
<template>
  <component :is="dynamicComponent"></component>
</template>
<script>
let dynamicComponent
export default {
  name: 'markdownRender',
  props: ['mdFileName'],
  data () {
    return {
      dynamicComponent: 'button'
    }
  },
  created () {
    let mdFileName = this.mdFileName
    dynamicComponent = this.dynamicComponent = () => import(`@/apiDoc/${mdFileName}.md`)
  },
  components: {
    dynamicComponent
  },
  beforeDestroy () {
    dynamicComponent = null
  }
}
</script>

<style lang="scss">
// css文件到项目里查看
  @import './markdown'
</style>
```
**全局注册**`MarkdownRender`组件
在`apiDoc`文件下创建`button.md`文件
```vue
// 使用
<MarkdownRender mdFileName="button" />
```

还有为方便在示例文档里**拷贝示例代码**，也做了相应处理，详见github。

运行`npm run build`打包输出`dist`，一个简单的文档就可以用了。（也可以用vuepress生成文档）。

如果有`md`文件的`eslint`**报错**，在根目录创建`.eslintignore`文件
```js
// .eslintignore
**/*.md
```

## 库的打包输出

我们需要打包出一个包含所有组件的入口文件，还需要把每个组件单独打包。所有的都输出到lib文件夹里就可以了，这在文件目录的时候就定好的。

新建`webpack.lib.base.js`，需要把vue排除。
```js
// webpack.lib.base.js
// 引入vue-loader插件
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// 引入清除打包后文件的插件（最新版的需要解构，不然会报不是构造函数的错，而且名字必须写CleanWebpackPlugin）
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  // 我们打包组件库时不需要把Vue打包进去
  externals: {
    'vue': {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue',
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }	
        ]
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false
              }
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 5120,
              esModule: false,
              fallback: 'file-loader',
              name: 'images/[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // new CleanWebpackPlugin(),
    new VueLoaderPlugin()
  ],
  resolve: {
		alias: {
      'vue$': 'vue/dist/vue.runtime.esm.js',
    },
    extensions: ['*', '.js', '.vue']
	}
};

```
#### 打包所有组件到一个
```js
// webpack.lib.prod.js
// 打包所有
// node.js里面自带的操作路径的模块
const path = require("path");
const merge = require('webpack-merge');
const webpackLibBaseConfig = require('./webpack.lib.base.js');
// 用于提取css到文件中
const miniCssExtractPlugin = require('mini-css-extract-plugin');
// 用于压缩css代码
const optimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin');

module.exports = merge(webpackLibBaseConfig, {
  mode: 'production',
  // devtool: 'source-map',
  devtool: 'none',
  entry: {
    index: path.resolve(__dirname, "../src/index.js")
  },
  output: {
    // 打包过后的文件的输出的路径
    path: path.resolve(__dirname, "../lib"),
    // 打包后生成的js文件
    filename: "[name].js",
    publicPath: "/",
    library: 'dd-ui',
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass)$/,
        use: [
          {
            loader: miniCssExtractPlugin.loader, // 使用miniCssExtractPlugin.loader代替style-loader
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
            // options: {
            //   implementation: require('dart-sass')
            // }
          }
          // {
          //   loader: 'postcss-loader'
          // }
        ]
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: "./fonts/[name].[ext]",
          publicPath: './'
        }
      }
    ]
  },
  plugins: [
    // 新建miniCssExtractPlugin实例并配置
    new miniCssExtractPlugin({
      filename: 'style.css'
    }),
    // 压缩css
    new optimizeCssnanoPlugin({
      sourceMap: true,
      cssnanoOptions: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
        }],
      },
    }),
  ]
})

```
#### 单组件打包

```js
// webpack.lib.prod.disperse.js
// 用于对组件单独打包，便于按需加载
// 用于拷贝的插件
const path = require('path');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const optimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin');
const merge = require('webpack-merge');
const webpackLibBaseConfig = require('./webpack.lib.base.js');
// 引入入口配置文件
const entryConfig = require('../componentList.js');

//定义入口
let entry =  {};
entryConfig.list.map((item) => {
  let componentName = item.name.toLowerCase();
  entry[componentName] = path.resolve(__dirname, '../packages/' + componentName + '/index.js');
});

module.exports = merge(webpackLibBaseConfig, {
  mode: 'production',
  // devtool: '#source-map',
  devtool: 'none',
  entry,
  output: {
    // 打包过后的文件的输出的路径
    path: path.resolve(__dirname, "../lib"),
    // 打包后生成的js文件
    // 解释下这个[name]是怎么来的，它是根据你的entry命名来的，入口叫啥，出口的[name]就叫啥
    filename: "[name]/index.js",
    // 我这儿目前还没有资源引用
    publicPath: "/",
    library: '[name]',
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass)$/,
        use: [
          {
            loader: miniCssExtractPlugin.loader, // 使用miniCssExtractPlugin.loader代替style-loader
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
            // options: {
            //   implementation: require('dart-sass')
            // }
          },
          // {
          //   loader: 'postcss-loader'
          // }
        ]
      },
    ]
  },
  plugins: [
    // 新建miniCssExtractPlugin实例并配置
    new miniCssExtractPlugin({
      filename: '[name]/style.css'
    }),
    // 压缩css
    new optimizeCssnanoPlugin({
      sourceMap: true,
      cssnanoOptions: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
        }],
      },
    }),
  ]
})
```

在根目录创建`componentList.js`，用于单组件打包时遍历。
```js
// componentList.js
module.exports = {
  list: [
    {
      name: 'button',
      author: 'z'
    },
    {
      name: 'toast',
      author: 'z'
    },
    {
      name: 'icon',
      author: 'z'
    },
    {
      name: 'result',
      author: 'z'
    },
    {
      name: 'form',
      author: 'z'
    },
    {
      name: 'input',
      author: 'z'
    }
  ]
}
```

最后在`package.json`中加入命令
```json
"lib:all": "webpack --config ./build/webpack.lib.prod.js",
"lib:disp": "webpack --config ./build/webpack.lib.prod.disperse.js",
"clean": "rimraf lib",
"dist": "npm run clean && npm run lib:all && npm run lib:disp"
```
执行`npm run dist`就可以打包了。

## 安装和使用
```js
// 安装
npm i -S dd-ui-vue

// 全量引入
import ddUi from 'dd-ui-vue'
import 'dd-ui-vue/lib/style.css'

Vue.use(ddUi)

// 按需引入
import { Button } from 'dd-ui-vue'
import 'dd-ui-vue/lib/style.css'

Vue.use(Button)
```

## 单元测试
运行`vue ui`，在插件中添加插件`@vue/cli-plugin-unit-jest`，项目里会生成`tests`文件夹，这里就是放单元测试的地方。

详细内容参考 [vue单元测试](./vue单元测试jest.md)

## 国际化
详细内容参考 [国际化](./国际化.md)

## 发布
```js
npm login // 登录npm
npm publish // 发布 包名重复的话发布会失败
```
在发布前设置`.npmignore`文件，必须发布的文件包含`lib`、`packages`、`package.json`、`README.md`。

`packages`里用到的是`theme-chalk`文件夹，用来定义主题变量的，也可以把`theme-chalk`复制到`lib`文件夹下，这样`packages`文件夹就不用发布到npm了。

`package.json`里也有一些必设的值，如：`name`、`version`、`main`
```
.DS_Store
node_modules
dist
build
examples
public
src

# local env files
.env.local
.env.*.local

# Log files
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor directories and files
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw*

babel.config.js
vue.config.js
componentList.js
postcss.config.js
教程.MD
.gitignore
*.map
*.html
```

## 总结

组件库是一个持续的开发过程，需要在过程中慢慢完善。这里写下的是当下的开发过程，希望没有误人。如有任何建议，请发邮件给我 [ rd_1985@163.com ]。很多地方都是参考 [element-ui](https://github.com/ElemeFE/element)，依葫芦画瓢。

github地址： [dd-ui-vue](https://github.com/1985zrd/dd-ui)
