# vue-lazyload源码解读

[vue-lazyload github地址](https://github.com/hilongjw/vue-lazyload)

## 大致流程
app.use() => install => vue.directive，指令bind => ListenerQueue.push(listener)、添加事件监听 => 判断元素是否在可视区 => 加载loading图片 => 渲染loading图片 => 加载src(需要展示的)图片 => 加载成功渲染结束，加载失败渲染error图并再次加载src图(attempt默认3次)

## 构建
从package.json的scripts中知道，vue-lazyload是rollup打包的，打包到根目录vue-lazyload.js和vue-lazyload.esm.js，对应package.json中main和module，以支持commonJS和es6模块化。

> rollup对于库的打包有优势  [rollup和webpack对比](https://www.jianshu.com/p/438de643773b)

## 入口
> vue插件必须为函数或一个带install方法的对象。

一、这个函数主要实例化了LazyClass，并添加自定义指令。在指令绑定到元素时，执行lazy.add方法。

```
// src/index.js
export default {
  /*
  * install function
  * @param  {Vue} Vue
  * @param  {object} options  lazyload options
  */
  install (Vue, options = {}) {
    const LazyClass = Lazy(Vue) // 返回lazy类。函数柯里化。
    const lazy = new LazyClass(options) // 核心
    const lazyContainer = new LazyContainer({ lazy })

    const isVue2 = Vue.version.split('.')[0] === '2'

    Vue.prototype.$Lazyload = lazy

    // 如果支持 lazyload 组件,则定义一个 lazy-component的全局组件
    if (options.lazyComponent) {
      Vue.component('lazy-component', LazyComponent(lazy))
    }

    if (options.lazyImage) {
      Vue.component('lazy-image', LazyImage(lazy))
    }

    if (isVue2) { // vue2.x版本的
      Vue.directive('lazy', {
        bind: lazy.add.bind(lazy),
        update: lazy.update.bind(lazy),
        componentUpdated: lazy.lazyLoadHandler.bind(lazy),
        unbind: lazy.remove.bind(lazy)
      })
      Vue.directive('lazy-container', {
        bind: lazyContainer.bind.bind(lazyContainer),
        componentUpdated: lazyContainer.update.bind(lazyContainer),
        unbind: lazyContainer.unbind.bind(lazyContainer)
      })
    } // vue1.x版的不想看。。
  }
}
```
二、lazy.js
```
// src/lazy.js
export default function (Vue) {
  return class Lazy {
    constructor ({ preLoad, error, throttleWait, preLoadTop, dispatchEvent, loading, attempt, silent = true, scale, listenEvents, hasbind, filter, adapter, observer, observerOptions }) {
      this.version = '__VUE_LAZYLOAD_VERSION__'
      this.mode = modeType.event
      this.ListenerQueue = []
      this.TargetIndex = 0
      this.TargetQueue = []
      this.options = {
        silent: silent,
        dispatchEvent: !!dispatchEvent,
        throttleWait: throttleWait || 200, // 节流函数时间，默认200毫秒
        preLoad: preLoad || 1.3, // 预加载，在屏幕的1.3倍高的时候加载
        preLoadTop: preLoadTop || 0, // dom的底部距离页面顶部多少距离还是加载
        error: error || DEFAULT_URL, // 图片加载出错时展示
        loading: loading || DEFAULT_URL, // 图片加载中展示
        attempt: attempt || 3, // 如果图片出错，尝试加载3次
        scale: scale || getDPR(scale), // 比例
        ListenEvents: listenEvents || DEFAULT_EVENTS, // 给dom注册dom的事件，在这些事件回调中会触发加载图片的方法
        hasbind: false,
        supportWebp: supportWebp(),
        filter: filter || {},
        adapter: adapter || {}, // 状态变化的回调监听，同时也可以使用lazyload的$on()函数(注意不是vue的)来监听状态变化的回调函数
        observer: !!observer,
        observerOptions: observerOptions || DEFAULT_OBSERVER_OPTIONS
      }
      this._initEvent() // 初始化事件处理器 (实现同理 vue的事件机制)
      this._imageCache = new ImageCache({ max: 200 }) // 图片缓存200
      this.lazyLoadHandler = throttle(this._lazyLoadHandler.bind(this), this.options.throttleWait)

      this.setMode(this.options.observer ? modeType.observer : modeType.event)
    }
  }
}
```
Lazy类主要初始化了一些默认参数、事件处理器(和vue的$on,$emit,$off类似)，用节流函数处理了加载图片的入口函数_lazyLoadHandler，还有很重要的ListenerQueue监听队列。

三、在指令bind的时候执行lazy.add。这个方法主要是实例化ReactiveListener（图片加载状态管理），并push到ListenerQueue，然后监听scroll等事件，执行lazy.lazyLoadHandler方法

```
// lazy.add
add (el, binding, vnode) {
  if (some(this.ListenerQueue, item => item.el === el)) {
    this.update(el, binding)
    return Vue.nextTick(this.lazyLoadHandler)
  }

  let { src, loading, error, cors } = this._valueFormatter(binding.value)

  Vue.nextTick(() => {
    src = getBestSelectionFromSrcset(el, this.options.scale) || src
    this._observer && this._observer.observe(el)

    const container = Object.keys(binding.modifiers)[0]
    let $parent

    // 如果使用了container 修饰符, 那么查找我们定义的contianer; 如果没有使用当前dom所在最近的滚动parent
    // 这个contianer是用于 设置监听dom事件的dom对象, 他的事件触发回调会触发图片的加载操作
    if (container) {
      $parent = vnode.context.$refs[container]
      // if there is container passed in, try ref first, then fallback to getElementById to support the original usage
      $parent = $parent ? $parent.$el || $parent : document.getElementById(container)
    }

    if (!$parent) {
      $parent = scrollParent(el)
    }

    // 在当前dom绑定到vdom中, 为当前dom创建一个监听事件(此事件用于触发当前dom在不同时期的不同处理操作), 并将事件添加到事件队列里面
    const newListener = new ReactiveListener({
      bindType: binding.arg, // 要绑定的属性
      $parent,
      el,
      loading,
      error,
      src,
      cors,
      elRenderer: this._elRenderer.bind(this),
      options: this.options,
      imageCache: this._imageCache
    })

    this.ListenerQueue.push(newListener)

    if (inBrowser) {
      this._addListenerTarget(window)
      this._addListenerTarget($parent)
    }

    this.lazyLoadHandler()
    Vue.nextTick(() => this.lazyLoadHandler())
  })
}
```

ReactiveListener实例化主要就是初始化了状态
```
// src/listener.js
export default class ReactiveListener {
  constructor ({ el, src, error, loading, bindType, $parent, options, cors, elRenderer, imageCache }) {
    this.el = el
    this.src = src
    this.error = error
    this.loading = loading
    this.bindType = bindType
    this.attempt = 0
    this.cors = cors

    this.naturalHeight = 0
    this.naturalWidth = 0

    this.options = options

    this.rect = null

    this.$parent = $parent
    this.elRenderer = elRenderer
    this._imageCache = imageCache
    this.performanceData = {
      init: Date.now(),
      loadStart: 0,
      loadEnd: 0
    }

    this.filter()
    this.initState()
    this.render('loading', false)
  }

  /*
   * init listener state
   * @return
   */
  initState () {
    if ('dataset' in this.el) {
      this.el.dataset.src = this.src
    } else {
      this.el.setAttribute('data-src', this.src)
    }

    this.state = {
      loading: false,
      error: false,
      loaded: false,
      rendered: false
    }
  }
}
```

_lazyLoadHandler方法，循环ListenerQueue，找出在可视区的元素，执行listener.load，listener是ReactiveListener实例。
```
// lazy._lazyLoadHandler方法
_lazyLoadHandler () {
  const freeList = []
  this.ListenerQueue.forEach((listener, index) => {
    if (!listener.el || !listener.el.parentNode) {
      freeList.push(listener)
    }
    const catIn = listener.checkInView()
    if (!catIn) return
    listener.load()
  })
  freeList.forEach(item => {
    remove(this.ListenerQueue, item)
    item.$destroy()
  })
}
```

listener.load，异步加载图片，加载完后执行render渲染，更改相应状态。render执行的是lazy._elRenderer方法
```
// listener.load
load (onFinish = noop) {
// 如果当前尝试加载图片的次数大于指定的次数, 并且当前状态还是错误的, 停止加载动作
if ((this.attempt > this.options.attempt - 1) && this.state.error) {
  if (!this.options.silent) console.log(`VueLazyload log: ${this.src} tried too more than ${this.options.attempt} times`)
  onFinish()
  return
}
if (this.state.rendered && this.state.loaded) return // 渲染完了
if (this._imageCache.has(this.src)) { // 使用缓存渲染图片
  this.state.loaded = true
  this.render('loaded', true)
  this.state.rendered = true
  return onFinish()
}

this.renderLoading(() => {
  this.attempt++ // 尝试次数累加

  this.options.adapter['beforeLoad'] && this.options.adapter['beforeLoad'](this, this.options)
  this.record('loadStart') // 记录当前状态的时间

  loadImageAsync({
    src: this.src,
    cors: this.cors
  }, data => {
    this.naturalHeight = data.naturalHeight
    this.naturalWidth = data.naturalWidth
    this.state.loaded = true
    this.state.error = false
    this.record('loadEnd')
    this.render('loaded', false)  // 调用lazy中的 elRender()函数, 用户切换img的src显示数据,并触发相应的状态的回调函数
    this.state.rendered = true
    this._imageCache.add(this.src) // 当前图片缓存在浏览器里面了
    onFinish()
  }, err => {
    !this.options.silent && console.error(err)
    this.state.error = true
    this.state.loaded = false
    this.render('error', false)
  })
})
}
```

_elRenderer设置dom的src或background

```
// lazy._elRenderer
/**
* set element attribute with image'url and state
* @param  {object} lazyload listener object
* @param  {string} state will be rendered
* @param  {bool} inCache  is rendered from cache
* @return
*/
_elRenderer (listener, state, cache) {
  if (!listener.el) return
  const { el, bindType } = listener

  let src
  // 根据不同状态加载不同的图片资源
  switch (state) {
    case 'loading':
      src = listener.loading
      break
    case 'error':
      src = listener.error
      break
    default:
      src = listener.src
      break
  }

  if (bindType) { // v-lazy: 后面的内容, 代表绑定的是这个属性
    el.style[bindType] = 'url("' + src + '")'
  } else if (el.getAttribute('src') !== src) {
    el.setAttribute('src', src)
  }

  el.setAttribute('lazy', state) // 自定义属性 lazy,用于给用于 根据此进行class搜索,设置指定状态的样式

  this.$emit(state, listener, cache) // 触发当前状态的回调函数
  this.options.adapter[state] && this.options.adapter[state](listener, this.options) // 触发adapter中的回调函数

  if (this.options.dispatchEvent) {
    const event = new CustomEvent(state, {
      detail: listener
    })
    el.dispatchEvent(event)
  }
}
```

节流函数
```
function throttle (action, delay) {
  let timeout = null
  let lastRun = 0
  return function () {
    if (timeout) {
      return
    }
    let elapsed = Date.now() - lastRun
    let context = this
    let args = arguments
    let runCallback = function () {
      lastRun = Date.now()
      timeout = false
      action.apply(context, args)
    }
    if (elapsed >= delay) {
      runCallback()
    } else { // 如果时间差小于delay，就dalay后执行
      timeout = setTimeout(runCallback, delay)
    }
  }
}
```

检查元素是否在可视区内
```
/*
* get el node rect
* @return
*/
getRect () {
  this.rect = this.el.getBoundingClientRect()
}

/*
*  check el is in view
* @return {Boolean} el is in view
*/
checkInView () {
  this.getRect()
  return (this.rect.top < window.innerHeight * this.options.preLoad && this.rect.bottom > this.options.preLoadTop) &&
        (this.rect.left < window.innerWidth * this.options.preLoad && this.rect.right > 0)
}

```

## 总结
vue-lazyload是利用vue自定义指令的钩子函数bind或update来收集需要懒加载的元素（收集到ListenerQueue中），在页面初始化（指令bind到元素上时）或页面滚动（scroll、resize、touchmove等等事件）时，遍历ListenerQueue，检测哪些元素已经可以去加载图片了（checkInView），再去异步加载图片。图片加载完，设置元素的src或background。

图片加载分4种状态：
状态 | 成功 | 含义
-- | -- | ---
加载中 | loading | loading图加载。设置el的src或background为loading图片。默认有一张黑色图片。
成功 | loaded | 图片加载成功。设置el的src或background为成功时图片
失败 | error | 图片加载失败。设置el的src或background为失败时图片。默认有一张黑色图片。
渲染完成 | rendered | 图片渲染完成。如果失败了（error），默认有3次获取图片的机会



