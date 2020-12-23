# web移动端开发注意事项
> web网站在移动设备上的表现跟pc上有一定的差别，注意到这些差别，开发起来会更方便。

## viewport
设置可视区域和页面缩放。`viewport-fit=cover`视图端口被缩放以填充设备显示，是处理刘海屏的
```js
<meta content="width=device-width,initial-scale=1,user-scalable=0,viewport-fit=cover" name="viewport" />
```
[视口概念](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Viewport_concepts)
[知乎 viewport-fit](https://www.zhihu.com/question/66761606)

## 媒体查询
> @media
```css
@media (min-width: 320px) and (max-width: 768) {}
```
[@media](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Media_queries)

## 单位
常用的单位有px、em、rem、vh、vw
在移动端，如果用固定单位（px）是有一点问题的，譬如：一个375px宽的盒子，在iPhone6上是占满整个可视区的，而在iPhone6 plus上，会留出一些空白。
**在移动端，我们使用相对单位，如：rem、vh、vw...**

### rem
`rem`是根元素`html`的字体大小，如果`html`元素的`font-size`为`16px`，`1rem === 16px`
一般情况下，设计稿的宽度是750px（一般用iPhone6作为设计标准，它的dpr为2，设计稿太小，页面会模糊），在设计稿中一个元素宽为300px，要转成rem：300/2/16，每个元素都需要去算，这样太麻烦了
我们可以用webpack插件`postcss-pxtorem`去自动转化px值。
我们先动态计算html元素的字体大小，它的大小应该是跟屏幕大小关联的。
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
  document.documentElement.style.fontSize = screenWidth / (750 / 40) + 'px'
  // 750是一般设计稿的宽度，如果是640的设计稿，可以改成640。
  // 40是一个基本参考值，主要配合下面的插件使用，也可以是其他数值。最终算出来的html字体大小建议不要太小，因为chrome有最新字体大小12px的限制。
}

```

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

**这样就可以使用了，设计图上10px，样式中就写10px就可以了，自动转rem**

## node-sass安装失败
> 在`npm install node-sass -D`的时候经常失败，非常苦恼

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
> 边框1px，在dpr(设备像素比)大于等于2的设备上，显示会很粗，[原因](https://juejin.cn/post/6844904112270622728)

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

大体的意思是把弹出层渲染到body元素下

vue：
```js
Vue.directive('transfer-dom', function (el, binding) {
    document.body.appendChild(el) // 大体是这样，详细的参考vux，xux还用了一个注释节点替换el
}
```
或在组件`mounted`后，`document.body.appendChild(this.$el)`

## 调试
> 移动端调试

[vconsole](https://github.com/Tencent/vConsole)
[eruda](https://github.com/chalk/chalk)

2个都很好用。如果是bug定位，我觉得还是模拟器好用。

## 动画尽量使用css3

动画尽量用transform，因为css避免改变top、left这种方式。

可以使用3D动画，开启GPU硬件加速模式。

[为什么transform好](https://www.jianshu.com/p/d42047481def)

## 图片加载

### 图片懒加载
对于页面中图片较多，使用图片懒加载。

vue: [vue-lazyload](https://github.com/hilongjw/vue-lazyload)
react: [react-lazyload](https://github.com/twobin/react-lazyload)

### 根据设备加载图片
1. 后端根据设备信息返回适当大小图片

2. srcset
`<img src="small.jpg " srcset="big.jpg 1440w, middle.jpg 800w, small.jpg 1x" />`
上面的例子表示浏览器宽度达到 800px 则加载 middle.jpg ，达到 1400px 则加载 big.jpg。注意：像素密度描述只对固定宽度图片有效。
单独使用srcset在加载图片的时候，不是很准确，需配合sizes使用

3. srcset配合sizes
```html
<img src="images/gun.png" alt="img元素srcset属性浅析"
         srcset="images/bg_star.jpg 1200w, images/share.jpg 800w, images/gun.png 320w"
         sizes="(max-width: 320px) 300w, 1200w"/>
```
表示浏览器视口为 320px 时图片宽度为 300px，其他情况为 1200px。

4. picture
```html
<picture>
    <source srcset="/media/cc0-images/surfer-240-200.jpg"
            media="(min-width: 800px)">
    <img src="/media/cc0-images/painted-hand-298-332.jpg" alt="" />
</picture>
```
浏览器会选择最匹配的子 `<source>` 元素，如果没有匹配的，就选择 `<img>` 元素的 `src` 属性中的`URL`
[picture MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/picture)

5. svg
矢量图标，放大不虚化

## autoprefix
> css自动前缀补齐

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


