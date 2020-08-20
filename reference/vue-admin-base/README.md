<h1 align="center">vue-admin-base（ikang后台管理系统基础库）</h1>

## 使用
1. ``` git clone git@gitlab.it.ikang.com:fe/vue-admin-base.git 你的项目名字 ```
2. ``` cd 你的项目名字 ```
3. `git remote origin set-url origin 新的仓库地址` 修改提交地址（修改提交地址到你当前项目gitlab地址）
4. `npm install`
5. `npm start`

## 用到的技术栈
包含但不限：@vue/cli（脚手架工具）、webpack（工具）、vue（框架）、vuex（状态管理）、vue-router（路由管理）、ikit（爱康UI组件）、axios（数据获取）、vue-color（颜色获取组件）、vuex-persistedstate（状态持久化）、js-cookie（cookie操作）、eslint（代码检测）、less（css预编译）、sass（css预编译）、webpack-theme-color-replacer（主题色切换）

## 提供的功能
1. UI组件使用**ikit**，支持全局注册，也支持部分注册和局部注册，需引入ikit.css，见```src/main.js```
2. **环境**配置，在```src/config/index.js```里修改
3. 在```src/main.js```里注册了一些vue **filter**方法，在```/src/utils/index.js```里可以查看
4. 动态**路由**或静态路由可根据项目进行选择，在```src/main.js```里设置
5. ```/src/utils/index.js```里提供了部分**常用方法**
6. **vuex**在```src/srore```里，做了持久化，提供了demo做参考
7. ```src/http/index.js```二次封装了**axios**，做了数据拦截、请求取消、多个请求的loading合并
8. 封装了**登录页**，在```src/views/login```文件夹下
9. 提供了**404**页面，在```src/views/errorPage.vue```
10. 提供了可修改**主题色**，在```src/components/ThemeSetting.vue```
11. 提供了**layou**t组件，在```src/layout```
12. 提供**eslint**代码检测
13. 添加**命令**```npm run tep viewName```创建一个页面组件。viewName为你需要创建的页面组件名称。命令在```src/views```里创建了viewName文件夹，包含viewName.vue和viewName.scss，同时在```src/api```文件夹下创建viewName.js。详见```scripts/template.js```。
14. 添加**命令**```npm run com ComponentName```创建一个通用组件或业务组件。ComponentName为你需要创建的组件名称。命令在```src/components```里创建了ComponentName文件夹，包含ComponentName.vue。详见```scripts/component.js```。

## 环境依赖
node v8+

## 目录结构描述
```
├── README.md
├── .eslintrc.js 配置eslint规则
├── babel.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── config 项目配置相关
│   └── plugin.config.js
├── public 静态资源
│   ├── favicon.ico
│   └── index.html
├── scripts
│   ├── component.js
│   └── template.js
├── src
│   ├── App.vue
│   ├── api api接口相关
│   ├── assets
│   │   └── images
│   ├── components 组件文件夹
│   │   ├── HelloWorld.vue
│   │   ├── common 通用组件文件夹
│   │   ├── ThemeSetting.vue 设置主题色组件
│   │   └── login-container 登录组件
|   |        ├── login-container.less
|   |        └── LoginContainer.vue
│   ├── config 配置信息，包括环境配置
│   │   └── index.js
│   ├── http 请求相关
│   │   ├── index.js
│   │   └── loading.js
│   ├── main.js
│   ├── layouts 组件组合
│   │   ├── Header.vue
│   │   ├── Menu.vue
│   │   └── index.vue
│   ├── router 有静态路由和动态路由可供选择
│   │   |── dynamicRoutes.js 动态路由
│   │   |── staticRoutes.js 静态路由
│   │   └── index.js
│   ├── store vuex做了持久化（可自行选择）
│   │   |── demo 这里写了一个demo
|   |   |   ├── state.js
|   |   |   ├── getters.js
|   |   |   ├── actions.js
|   |   |   ├── mutations.js
|   |   |   ├── types.js
|   |   |   └── index.js
│   │   |── menu 左侧菜单栏相关
│   │   |── theme 主题色相关
│   │   └── index.js
│   ├── utils 工具方法
|   |   ├── index.js
│   |   └── changeTheme 修改主题色相关
|   |       ├── settingConfig.js
|   |       └── themeColor.js
│   └── views 页面
│       ├── About.vue
│       ├── errorPage.vue
│       ├── Home.vue
│       └── login
|           ├── login.less
|           └── Login.vue
└── vue.config.js
```
