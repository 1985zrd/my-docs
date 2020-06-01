# web移动端开发注意事项

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
    document.body.appendChild(el) // 还是要参照vux写好一些
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
