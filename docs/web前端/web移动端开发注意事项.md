# web移动端开发注意事项

## node-sass安装失败

[失败原因](https://segmentfault.com/a/1190000020993365?utm_source=tag-newest)

```
npm i node-sass --sass_binary_site=https://npm.taobao.org/mirrors/node-sass/

或

npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
```
也可以用**cnpm**安装

## click 300ms延迟
> 这要追溯至 2007 年初。苹果公司在发布首款 iPhone 前夕，遇到一个问题 —— 当时的网站都是为大屏幕设备所设计的。于是苹果的工程师们做了一些约定，应对 iPhone 这种小屏幕浏览桌面端站点的问题。这当中最出名的，当属双击缩放(double tap to zoom)。这也是会有上述 300 毫秒延迟的主要原因。

一般使用fastclick解决。zepto库的tap事件也可以，但是它有一个点透的问题。

使用：
```js
npm i fastclick -S

import FastClick from 'fastclick'

FastClick.attach(document.body)
```

思路：在捕获阶段阻止click事件，利用touchstart、touchmove、touchend判断手指移动位置，通过创建事件，dispatch事件去触发元素上click事件。

```js
var event = document.createEvent('Event'); // createEvent使用的许多方法, 如 initCustomEvent, 都被废弃了. 请使用 Event constructors 来替代.
event.initEvent('click', true, true);
window.dispatchEvent(event); // window可以是任何元素

也可以用Event或CustomEvent
var event = new Event('click')
window.dispatchEvent(event)

var event = new CustomEvent('click', { detail: {} }) // CustomEvent可以传递参数
window.dispatchEvent(event)
```

[fastclick原理](https://segmentfault.com/a/1190000005850383)

## 边框1px问题
> 边框1px，在dpr(设备像素比)大于等于2的设备上，显示会很粗

```scss
// scss文件
$borderColor: #E1E0DF;

.border-1px, .border-1px-t, .border-1px-b, .border-1px-tb, .border-1px-l, .border-1px-r {
  position: relative;
}

.border-1px {
  &:before {
    content: " ";
    position: absolute;
    border: 1px solid $borderColor;
    color: $borderColor;
    left: 0;
    top: 0;
    width: 200%;
    height: 200%;
    transform-origin: left top;
    transform: scale(0.5);
  }
}

.border-1px-t {
  &:before {
    content: " ";
    position: absolute;
    border-top: 1px solid $borderColor;
    color: $borderColor;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    transform-origin: 0 0;
    transform: scaleY(0.5);
  }
}

.border-1px-b {
  &:after {
    content: " ";
    position: absolute;
    border-bottom: 1px solid $borderColor;
    color: $borderColor;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    transform-origin: 0 100%;
    transform: scaleY(0.5);
  }
}

.border-1px-tb {
  &:before {
    content: " ";
    position: absolute;
    border-top: 1px solid $borderColor;
    color: $borderColor;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    transform-origin: 0 0;
    transform: scaleY(0.5);
  }
  &:after {
    content: " ";
    position: absolute;
    border-bottom: 1px solid $borderColor;
    color: $borderColor;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    transform-origin: 0 100%;
    transform: scaleY(0.5);
  }
}

.border-1px-l {
  &:before {
    content: " ";
    position: absolute;
    border-left: 1px solid $borderColor;
    color: $borderColor;
    left: 0;
    top: 0;
    width: 1px;
    bottom: 0;
    transform-origin: 0 0;
    transform: scaleX(0.5);
  }
}

.border-1px-r {
  &:after {
    content: " ";
    position: absolute;
    border-right: 1px solid $borderColor;
    color: $borderColor;
    right: 0;
    top: 0;
    width: 1px;
    bottom: 0;
    transform-origin: 100% 0;
    transform: scaleX(0.5);
  }
}

```

## 弹出框遮不住底部栏问题
> 在移动端应用里，为了便于代码组织，通常我们要将组件放在各个路由的 `.vue` 文件里，但是因为此时组件并不在 `body` 下，加上定位，`overflowscrolling` 设置等原因，会出现遮罩在弹层之上，`z-index` 失效等问题。

参考vux的`v-transfer-dom`指令，[地址](https://github.com/airyland/vux/blob/v2/src/directives/transfer-dom/index.js)

```
Vue.directive('transfer-dom', function (el, binding) {
    document.body.appendChild(el) // 大体是这样，详细的参考vux，xux还用了一个注释节点替换el
}
```

## rem
> 为什么要用rem？

> rem是基于html元素字体大小的

```js
/**
 * 设置html字体大小
 */
export const setFontSize = function () {
  function getWdith () {
    let myWidth = 0
    if (typeof (window.innerWidth) === 'number') {
      myWidth = window.innerWidth
    } else if (document.documentElement && (document.documentElement.clientWidth)) {
      myWidth = document.documentElement.clientWidth
    } else if (document.body && (document.body.clientWidth)) {
      myWidth = document.body.clientWidth
    }
    return parseInt(myWidth)
  }
  
  let screenWidth = window.screen.width > getWdith() ? getWdith() : window.screen.width
  
  if (screenWidth >= 768) {
    screenWidth = 768
  }
  document.documentElement.style.fontSize = screenWidth / (750 / 40) + 'px' // 750是一般设计稿的宽度，40是一个基本参考值。
}

```
用`postcss-pxtorem`去自动转化px值。
```js
"postcss": {
    "plugins": {
      "autoprefixer": {},
      "postcss-pxtorem": {
        "rootValue": 40, // 这个值和setFontSize的参考值一致。
        propList: ['*', '!border'], // border不转
        "selectorBlackList": [
          ".vux-",
          ".weui-",
          "#vux-",
          "#weui-"
        ]
      }
    }
}
```

这样就可以使用了，设计图上10px，样式中就写10px就可以了，自动转rem。

也可以使用`flexible.js`，或vue开发时使用`amfe-flexible`。

## meta标签

``` html
<!DOCTYPE html> <!-- 使用 HTML5 doctype，不区分大小写 -->
<html lang="zh-cmn-Hans"> <!-- 更加标准的 lang 属性写法 http://zhi.hu/XyIa -->
<head>

    <!-- 声明文档使用的字符编码 -->
    <meta charset='utf-8'>
    
    <!-- 优先使用 IE 最新版本和 Chrome -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    
    <!-- 页面描述 -->
    <meta name="description" content="不超过150个字符"/>
    
    <!-- 页面关键词 -->
    <meta name="keywords" content=""/>
    
    <!-- 网页作者 -->
    <meta name="author" content="name, email@gmail.com"/>
    
    <!-- 搜索引擎抓取 -->
    <meta name="robots" content="index,follow"/>
    
    <!-- 为移动设备添加 viewport -->
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover">
    <!-- `width=device-width` 会导致 iPhone 5 添加到主屏后以 WebApp 全屏模式打开页面时出现黑边 http://bigc.at/ios-webapp-viewport-meta.orz -->
 
    <!-- iOS 设备 begin -->
    <meta name="apple-mobile-web-app-title" content="标题">
    <!-- 添加到主屏后的标题（iOS 6 新增） -->
    
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <!-- 是否启用 WebApp 全屏模式，删除苹果默认的工具栏和菜单栏 -->
    
    <meta name="apple-touch-fullscreen" content="yes">：
    <!-- "添加到主屏幕“后，全屏显示 -->
    
    <meta name="apple-itunes-app" content="app-id=myAppStoreID, affiliate-data=myAffiliateData, app-argument=myURL">
    <!-- 添加智能 App 广告条 Smart App Banner（iOS 6+ Safari） -->
    
    <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
    <!-- 设置苹果工具栏颜色 -->
    
    <meta name="format-detection" content="telphone=no, email=no"/>
    <!-- 忽略页面中的数字识别为电话，忽略email识别 -->
    
    <!-- 启用360浏览器的极速模式(webkit) -->
    <meta name="renderer" content="webkit">
    
    <!-- 针对手持设备优化，主要是针对一些老的不识别viewport的浏览器，比如黑莓 -->
    <meta name="HandheldFriendly" content="true">
    
    <!-- 微软的老式浏览器 -->
    <meta name="MobileOptimized" content="320">
    
    <!-- uc强制竖屏 -->
    <meta name="screen-orientation" content="portrait">
    
    <!-- QQ强制竖屏 -->
    <meta name="x5-orientation" content="portrait">

    <!-- UC强制全屏 -->
    <meta name="full-screen" content="yes">
    
    <!-- QQ强制全屏 -->
    <meta name="x5-fullscreen" content="true">
    
    <!-- UC应用模式 -->
    <meta name="browsermode" content="application">
    
    <!-- QQ应用模式 -->
    <meta name="x5-page-mode" content="app">
    
    <!-- windows phone 点击无高光 -->
    <meta name="msapplication-tap-highlight" content="no">
    
    <!-- iOS 图标 begin -->
    <link rel="apple-touch-icon-precomposed" href="/apple-touch-icon-57x57-precomposed.png"/>
    <!-- iPhone 和 iTouch，默认 57x57 像素，必须有 -->
    
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/apple-touch-icon-114x114-precomposed.png"/>
    <!-- Retina iPhone 和 Retina iTouch，114x114 像素，可以没有，但推荐有 -->
    
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/apple-touch-icon-144x144-precomposed.png"/>
    <!-- Retina iPad，144x144 像素，可以没有，但推荐有 -->
    <!-- iOS 图标 end -->
 
    <!-- iOS 启动画面 begin -->
    <link rel="apple-touch-startup-image" sizes="768x1004" href="/splash-screen-768x1004.png"/>
    <!-- iPad 竖屏 768 x 1004（标准分辨率） -->
    <link rel="apple-touch-startup-image" sizes="1536x2008" href="/splash-screen-1536x2008.png"/>
    <!-- iPad 竖屏 1536x2008（Retina） -->
    <link rel="apple-touch-startup-image" sizes="1024x748" href="/Default-Portrait-1024x748.png"/>
    <!-- iPad 横屏 1024x748（标准分辨率） -->
    <link rel="apple-touch-startup-image" sizes="2048x1496" href="/splash-screen-2048x1496.png"/>
    <!-- iPad 横屏 2048x1496（Retina） -->
 
    <link rel="apple-touch-startup-image" href="/splash-screen-320x480.png"/>
    <!-- iPhone/iPod Touch 竖屏 320x480 (标准分辨率) -->
    <link rel="apple-touch-startup-image" sizes="640x960" href="/splash-screen-640x960.png"/>
    <!-- iPhone/iPod Touch 竖屏 640x960 (Retina) -->
    <link rel="apple-touch-startup-image" sizes="640x1136" href="/splash-screen-640x1136.png"/>
    <!-- iPhone 5/iPod Touch 5 竖屏 640x1136 (Retina) -->
    <!-- iOS 启动画面 end -->
 
    <!-- iOS 设备 end -->
    <meta name="msapplication-TileColor" content="#000"/>
    <!-- Windows 8 磁贴颜色 -->
    <meta name="msapplication-TileImage" content="icon.png"/>
    <!-- Windows 8 磁贴图标 -->
 
    <link rel="alternate" type="application/rss+xml" title="RSS" href="/rss.xml"/>
    <!-- 添加 RSS 订阅 -->
    <link rel="shortcut icon" type="image/ico" href="/favicon.ico"/>
    <!-- 添加 favicon icon -->
    
    <meta name="imagemode" content="force">
    <!-- 强制图片显示  。 UC浏览器为了节省流量，为用户提供了无图模式，但是如果页面的图片是必不可少的，如验证码的，需要强制浏览器显示图片，可以设置imagemode， 不影响子页面。通过META设置图片加载方式会作用于整个页面，如果希望对单个图片进行设置，那么可以使用这个 -->
     
    <meta name="nightmode" content="disable">
     <!-- 夜间模式。nightmode的值设置为disable后，即使用户使用浏览器的夜间模式，页面的表现也仍然是非夜间模式。 -->
     
    <meta name="browsermode" content="application">
     <!-- 使用了application这种应用模式后，页面讲默认全屏，禁止长按菜单，禁止收拾，标准排版，以及强制图片显示。 -->
     
    <meta name="msapplication-tap-highlight" content="no"> 
     <!-- winphone系统a、input标签被点击时产生的半透明灰色背景去掉 -->

    <title>标题</title>
</head>
```

## 视频播放
> 移动端对视频格式和界面的支持不一致

请参考 [移动端H5视频播放](./移动端H5视频播放.md)

## 调试
> 移动端调试

[vconsole](https://github.com/Tencent/vConsole)
[eruda](https://github.com/chalk/chalk)

2个都很好用。如果是bug定位，我觉得还是模拟器好用。

## 动画尽量使用css3

动画尽量用transform，避免改变top、left这种方式。

可以使用3D动画，开启GPU硬件加速模式。

## 图片懒加载

对于页面中图片较多，使用图片懒加载。

vue: [vue-lazyload](https://github.com/hilongjw/vue-lazyload)

## autoprefix

[参考](https://www.jianshu.com/p/bd9cb7861b85)

`package.json`里的`browsersList`设置是`last 2 versions`，可能会导致你在某些`Android`机子上出现问题。如果你使用 `last 7 versions` 会生成不必要的 `-ms` 前缀代码。可以添加 `"Android >= 4.1"`

`react` 默认的：
```json
"browserslist": {
  "production": [
    ">0.2%",
    "not dead",
    "not op_mini all"
  ],
  "development": [
    "last 1 chrome version",
    "last 1 firefox version",
    "last 1 safari version"
  ]
}
```


