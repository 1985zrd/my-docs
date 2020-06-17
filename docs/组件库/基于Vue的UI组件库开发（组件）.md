# 基于Vue的UI组件开发（pc端）

> 记录组件库单个组件开发

- [icon 图标组件](#icon组件)
- [form 表单组件](#form组件)
- [skeleton 骨架屏组件](#skeleton组件)
- [result 结果组件](#result组件)

## icon组件
icon组件可以基于字体（@font-face），也可以基于svg。

基于字体的话，个人感觉维护比较麻烦，需要写很多的样式，在使用的时候，如果有新的icon，还得更新组件库，不好扩展。下面写一个基于svg的icon组件：
```
<script>
export default {
  name: 'Icon',
  props: {
    iconClass: { // svg类名
      type: String,
      default: ''
    },
    type: { // icon类型
      type: String,
      required: true
    },
    size: {
      type: String,
      default: 'medium' // small 12、medium 14、large 16
    },
    component: { // 组件库没有包含的icon图标，可以通过这个props传入。后面版本更新的时候再统一添加到组件库中。antd的扩展方式更好，可以参考antd。
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    iconName () {
      return `#icon-${this.type}`
    },
    svgClass () {
      return `svg-icon ${this.iconClass}`
    }
  },
  render (h) {
    if (this.component) { // 如果有自定义图标
      return h('svg', { // 这里svg嵌套了svg，我目前没有什么好方法。
        class: {
          [this.svgClass]: true,
          [`svg-icon-${this.size}`]: true
        },
        domProps: {
          innerHTML: this.component // 这样写是不是不好。。
        }
      })
    }
    return h('svg', {
      ...this.$listeners,
      attrs: {
        'aria-hidden': true
      },
      class: {
        [this.svgClass]: true,
        [`svg-icon-${this.size}`]: true,
        'svg-icon-loading': this.loading
      }
    }, [h('use', {
      attrs: {
        'xlink:href': this.iconName
      }
    })])
  }
}
</script>

<style>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  font-size: 14px;
}
.svg-icon-small {
  font-size: 12px;
}
.svg-icon-medium {
  font-size: 14px;
}
.svg-icon-large {
  font-size: 16px;
}
.svg-icon-loading {
  animation: rotating 2s linear infinite;
}
@keyframes rotating {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg);
  }
}
</style>
```

使用：
```
<template>
  <div id="app">
    <Icon type="love" size="small"/>
    <Icon type="love" size="medium"/>
    <Icon type="love" size="large"/>
    <Icon type="loading" loading/>
    
    <Icon type="peigen" :component="HeartSvg" size="large" />
  </div>
</template>

<script>
const HeartSvg = `
  <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
    <path d="M432 709.248l-166.624-166.624 45.248-45.248 121.376 121.376 281.376-281.376 45.248 45.248L432 709.248zM512 64C264.576 64 64 264.576 64 512s200.576 448 448 448 448-200.576 448-448S759.424 64 512 64z" fill="#181818" p-id="3178"></path>
  </svg>
`
export default {
  data () {
    return {
      HeartSvg
    }
  }
}
</script>
```

## form组件
> form组件包含的组件太多，input、button、select....，这里先搞个简单的

包含内容：form、form-item、input，校验。校验使用的`async-validator`

```
// form
<template>
  <form class="i-form"
    :class="[{
      'el-form--inline': layout === 'inline',
      'el-form--vertical': layout === 'vertical',
      'el-form--horizontal': layout === 'horizontal'
    }]"
  >
    <slot></slot>
  </form>
</template>
<script>
export default {
  name: 'i-form',
  provide () {
    return {
      'iForm': this
    }
  },
  props: {
    model: Object,
    rules: Object,
    layout: {
      type: String,
      default: 'horizontal' // 'horizontal'|'vertical'|'inline'
    },
    hideRequiredMark: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    validate (cb) { // validate要校验完所有需要校验的，统一返回结果
      const fail = false
      const tasks = this.$children
        .filter(item => {
          return item.prop
        })
        .map(item => {
          return item.validate()
        })
      Promise.all(tasks)
        .then((res) => {
          console.log(res)
          cb(res.every(item => item === '' || item === true)) // item是校验完的error message，校验通过为空字符串。true是没定义rules返回的。
        })
        .catch(() => cb(fail))
    }
  }
}
</script>
```

```
// form-item，校验是在这个组件做的
<template>
  <div class="i-form-item"
    :class="[{
      'is-required': isRequired || required,
      'is-no-mark': iForm && iForm.hideRequiredMark,
      'with-help': validateMessage
    }]"
  >
    <label class="i-form-item__label" :style="labelStyle" v-if="label || $slots.label">
      <slot name="label">{{ label }}</slot>
    </label>
    <div class="i-form-item__control">
      <slot></slot>
      <p
        v-if="validateState === 'error' && validateMessage"
        class="i-form-item__error"
      >{{ validateMessage }}</p>
    </div>
  </div>
</template>
<script>
import Schema from 'async-validator'
export default {
  name: 'i-form-item',
  __I_FOEM_ITEM: true,
  inject: ['iForm'],
  props: {
    label: String,
    labelStyle: Object,
    for: String,
    prop: String,
    required: {
      type: Boolean,
      default: undefined
    }
  },
  data () {
    return {
      validateMessage: '',
      validateState: ''
    }
  },
  mounted () {
    this.$on('validate', this.validate)
  },
  computed: {
    isRequired () {
      let rules = this.getRules()
      let isRequired = false

      if (rules && rules.length) {
        rules.every(rule => {
          if (rule.required) {
            isRequired = true
            return false
          }
          return true
        })
      }

      return isRequired
    }
  },
  methods: {
    validate (callback = () => {}) {
      const propKey = this.prop
      if (!propKey) return true
      const rules = this.getRules()
      if (!rules || rules.length === 0) {
        console.warn(`你定义了prop属性，如果想做校验，请传入rules。如果不想用校验，我建议删除prop属性。`)
        return true
      }

      const value = this.iForm.model[propKey]

      if (rules && rules.length > 0) {
        rules.forEach(rule => {
          delete rule.trigger
        })
      }

      const validator = new Schema({ [propKey]: rules })
      return new Promise((resolve) => {
        validator.validate({ [propKey]: value }, { firstFields: true, suppressWarning: false }, (errors, fields) => {
          this.validateState = !errors ? 'success' : 'error'
          this.validateMessage = errors ? errors[0].message : ''

          resolve(this.validateMessage)
        })
      })
      // 上面自己定义Promise和下面的2种方式都可以
      // return validator.validate({ [propKey]: value }).then(() => {
      //   this.validateMessage = ''
      //   console.log('校验通过')
      //   return true
      // }).catch(({ errors, fields }) => {
      //   console.log(errors[0])
      //   this.validateMessage = errors[0].message
      //   return false
      // })
    },
    getRules () {
      let rules = []
      const propKey = this.prop
      if (!propKey) return rules
      return this.iForm.rules[propKey] || rules
    }
  }
}
</script>
```

```
// input
<template>
  <div class="i-input-wrap">
    <template v-if="type !== 'textarea'">
      <input
        :type="type"
        :value="value"
        v-on="inputListeners"
        v-bind="$attrs"
        class="i-input"
      />
    </template>

    <textarea
      v-else
      :value="value"
      v-on="inputListeners"
      v-bind="$attrs"
      class="i-input i-textarea"
    />
  </div>
</template>

<script>
export default {
  name: 'i-input',
  inheritAttrs: false,
  props: {
    value: [String, Number],
    type: {
      type: String,
      default: 'text'
    }
  },
  computed: {
    inputListeners () {
      const vm = this
      return Object.assign({}, this.$listeners, {
        input: function (event) {
          vm.$emit('input', event.target.value)
          let parent = vm.$parent
          while (!parent.$options.__I_FOEM_ITEM) { // 找到form-item，触发validate校验
            parent = parent.parent
          }
          parent.$emit('validate')
        }
      })
    }
  }
}
</script>
```

```
// 样式 ，后面会写一个组件库工程化的文章，这里暂时这么写。
.el-form--inline {
  display: flex;
  align-items: center;
  justify-items: center;
  flex-wrap: wrap;
}
.el-form--inline .i-form-item {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-right: 16px;
}
.i-form-item__control {
  flex: 1;
}
.el-form--inline .i-form-item__control {
  display: flex;
  align-items: center;
  justify-items: center;
}
.el-form--horizontal .i-form-item {
  display: flex;
}
.el-form--vertical .i-form-item__label {
  text-align: left;
}
.el-form--inline .i-form-item__label {
  text-align: left;
  width: auto;
  min-width: auto;
}

.i-form-item {
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  font-feature-settings: "tnum";
  margin: 0;
  vertical-align: top;
  margin-bottom: 6px;
  &__label {
    display: inline-block;
    overflow: hidden;
    line-height: 39.9999px;
    white-space: nowrap;
    text-align: right;
    vertical-align: middle;
    min-width: 80px;
  }
  &__control {
    &:before {
      display: table;
      content: "";
    }
    &:after {
      clear: both;
    }
  }
  &__error {
    margin: 0;
    color: #f5222d;
    min-height: 22px;
    margin-top: -2px;
    font-size: 14px;
    line-height: 1.5;
    transition: color .3s cubic-bezier(.215,.61,.355,1);
  }
}
.i-form:not(.el-form--inline) {
  margin-bottom: 24px;
}
.i-form:not(.el-form--inline) .i-form-item.with-help {
  margin-bottom: 4px;
}
.i-form-item.is-required:not(.is-no-mark) .i-form-item__label {
  &:before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
}

.i-input-wrap {
  line-height: 40px;
}
.i-input {
  box-sizing: border-box;
  margin: 0;
  font-variant: tabular-nums;
  list-style: none;
  font-feature-settings: "tnum";
  position: relative;
  display: inline-block;
  width: 100%;
  height: 32px;
  padding: 4px 11px;
  color: rgba(0,0,0,.65);
  font-size: 14px;
  line-height: 1.5;
  background-color: #fff;
  background-image: none;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: all .3s;
}
.i-textarea {
  max-width: 100%;
  height: auto;
  min-height: 32px;
  line-height: 1.5;
  vertical-align: bottom;
  transition: all .3s,height 0s;
}
```

## skeleton组件
[借鉴](http://danilowoz.com/create-content-loader/)

```
// skeleton.js
import { createChildren, createLinearGradient, createRect, uid } from '../utils.js'
import presets, { presetHeight } from './presets'

export default {
  name: 'ik-skeleton',
  functional: true,
  props: {
    type: { // 类型[ code | list ] 不传就用'default',后期补充
      type: String,
      default: 'default'
    },
    width: { // svg viewBox的宽，类似于一个画布
      type: Number,
      default: 1000
    },
    height: { // svg viewBox的高
      type: Number,
      default: 400
    },
    time: { // 动画时长，需要animate为true是才有动画
      type: Number,
      default: 2
    },
    primaryColor: { // 底色
      type: String,
      default: '#EAEDF1'
    },
    secondaryColor: { // 动画的颜色
      type: String,
      default: 'rgba(255, 255, 255, 0.3)'
    },
    loading: { // 当slot='content'，loading为true时，页面显示content元素。loading为false时，显示默认slot或传入的data
      type: Boolean,
      default: false
    },
    animate: { // 是否开启动画
      type: Boolean,
      default: true
    },
    preserveAspectRatio: { // svg显示方式
      type: String,
      default: 'xMinYMin meet'
    },
    data: { // 可以传入一组数据或slot生成svg，数据格式见presets.js
      type: Array,
      default: undefined
    }
  },
  render (h, c) {
    const slotMap = c.slots()
    let props = c.props
    let data = c.data
    let id = uid() // 生成id，用于填充
    let idGradient = uid() // 生成id，用于动画
    let height = presetHeight[props.type] ? presetHeight[props.type].height : props.height // 预设高度
    if (props.loading) { // 如果loading为true，则渲染slot为content的子组件
      return h('div', {
        class: {
          'ik-skeleton-slot-content': true
        }
      }, slotMap.content || '')
    }
    const baseRect = createRect(h, { // 创建一个基础的矩形
      idGradient: idGradient,
      id: id,
      width: props.width,
      height: height
    })
    const noChildrenRect = createRect(h, { // 创建一个矩形
      radius: 5,
      width: props.width,
      height: height
    })
    const createLinearGradientElement = createLinearGradient(h, { // 赋予颜色或动画
      primaryColor: props.primaryColor,
      secondaryColor: props.secondaryColor,
      animate: props.animate,
      time: props.time,
      idGradient: idGradient
    })
    return h('svg', {
      ...data,
      attrs: {
        viewBox: '0 0 ' + props.width + ' ' + height,
        preserveAspectRatio: props.preserveAspectRatio
      }
    }, [baseRect, h('defs', [h('clipPath', { // 先创建了一个矩形，再通过defs填充
      attrs: {
        id: id
      }
    }, [(c.props.data ? createChildren(h, c.props.data) : (props.type && presets[props.type] ? createChildren(h, presets[props.type]) : slotMap.default)) || noChildrenRect]), createLinearGradientElement])])
  }
}
```

```
// presets.js
// 各类型必传的字段
// [
//   {
//     type: 'polygon', // 多边形
//     points: '100 300, 210 170, 100 300'
//   },
//   {
//     type: 'rect', // 矩形
//     x: 0,
//     y: 0,
//     width: 10,
//     height: 10
//   },
//   {
//     type: 'circle', // 圆
//     x: 0,
//     y: 0,
//     r: 10
//   }
// ]

const code = [
  {
    type: 'rect',
    x: 20,
    y: 10,
    width: 150,
    height: 20
  },
  {
    type: 'rect',
    x: 180,
    y: 10,
    width: 220,
    height: 20
  },
  {
    type: 'rect',
    x: 420,
    y: 10,
    width: 24,
    height: 20
  },
  {
    type: 'rect',
    x: 464,
    y: 10,
    width: 400,
    height: 20
  },
  {
    type: 'rect',
    x: 65,
    y: 54,
    width: 300,
    height: 20
  },
  {
    type: 'rect',
    x: 350,
    y: 54,
    width: 295,
    height: 20
  },
  {
    type: 'rect',
    x: 40,
    y: 98,
    width: 295,
    height: 20
  },
  {
    type: 'rect',
    x: 256,
    y: 98,
    width: 130,
    height: 20
  },
  {
    type: 'rect',
    x: 410,
    y: 98,
    width: 135,
    height: 20
  },
  {
    type: 'rect',
    x: 30,
    y: 142,
    width: 64,
    height: 20
  },
  {
    type: 'rect',
    x: 84,
    y: 142,
    width: 120,
    height: 20
  }
]

const list = [
  {
    type: 'circle',
    x: 38,
    y: 38,
    r: 18
  },
  {
    type: 'rect',
    x: 76,
    y: 28,
    width: 900,
    height: 20
  },
  {
    type: 'circle',
    x: 38,
    y: 94,
    r: 18
  },
  {
    type: 'rect',
    x: 76,
    y: 84,
    width: 900,
    height: 20
  },
  {
    type: 'circle',
    x: 38,
    y: 150,
    r: 18
  },
  {
    type: 'rect',
    x: 76,
    y: 140,
    width: 900,
    height: 20
  },
  {
    type: 'circle',
    x: 38,
    y: 206,
    r: 18
  },
  {
    type: 'rect',
    x: 76,
    y: 196,
    width: 900,
    height: 20
  }
]

export const presetHeight = {
  code: {
    height: 174
  },
  list: {
    height: 240
  }
}

export default {
  code,
  list
}
```

```
// utils.js
export function createChildren (h, presetData) {
  return presetData.map(item => {
    return h(item.type, {
      'attrs': {
        'x': item.x || 0, // x轴坐标
        'y': item.y || 0, // y轴坐标
        'cx': item.x || 0, // 圆的x轴坐标
        'cy': item.y || 0, // 圆的y轴坐标
        'r': item.r || 0, // 圆的半径
        'width': item.width || 0, // 矩形的宽
        'height': item.height || 0, // 矩形的高
        'rx': item.radius || item.rx || (typeof item.radius === 'undefined' && typeof item.rx === 'undefined' ? 4 : 0), // 矩形x轴的圆角，优先使用radius统一圆角
        'ry': item.radius || item.ry || (typeof item.radius === 'undefined' && typeof item.ry === 'undefined' ? 4 : 0), // 矩形y轴的圆角
        'points': item.points || '' // 多边形的坐标点
      }
    })
  })
}

const stop = [
  {
    'offset': '0%',
    'values': '-2; 1'
  },
  {
    'offset': '50%',
    'values': '-1.5; 1.5'
  },
  {
    'offset': '100%',
    'values': '-1; 2'
  }
]
export function createLinearGradient (h, props) {
  let stopElement = stop.map((item, index) => {
    return h('stop', {
      'attrs': {
        'offset': item.offset,
        'stop-color': index === 1 ? props.secondaryColor : props.primaryColor,
        'stop-opacity': 1
      }
    }, [props.animate ? h('animate', {
      'attrs': {
        'attributeName': 'offset',
        'values': item.values,
        'dur': props.time + 's',
        'repeatCount': 'indefinite'
      }
    }) : null])
  })
  return h('linearGradient', {
    'attrs': {
      'id': props.idGradient
    }
  }, stopElement)
}

export function createRect (h, props) {
  return h('rect', {
    style: {
      'fill': props.idGradient ? 'url(' + '#' + props.idGradient + ')' : ''
    },
    attrs: {
      'clip-path': props.id ? 'url(' + '#' + props.id + ')' : '',
      'x': props.x ? props.x : '0',
      'y': props.y ? props.y : '0',
      'rx': props.radius ? props.radius : 0,
      'ry': props.radius ? props.radius : 0,
      'width': props.width,
      'height': props.height
    }
  })
}

export function uid () {
  return Math.random().toString(36).substring(2)
}

```

## result组件

> 展示操作结果

```
<template>
  <div class="ik-result" :class="'ik-result-' + status">
    <div class="ik-result-icon" :style="iconStyle">
      <slot name="icon"><Icon :type="iconType" isIk /></slot>
    </div>
    <div class="ik-result-title" v-if="title || $slots.title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="ik-result-subTitle" v-if="subTitle || $slots.subTitle">
      <slot name="subTitle">{{ subTitle }}</slot>
    </div>
    <div class="ik-result-content" v-if="$slots.default">
      <slot></slot>
    </div>
    <div class="ik-result-extra" v-if="$slots.extra">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<script>
import Icon from '../../icon/'
export default {
  name: 'ik-result',
  components: { Icon },
  data () {
    return {
      iconMap: {
        success: 'iconsuccess',
        error: 'iconclear-or-error',
        info: 'iconinfo',
        warning: 'iconwarn'
      },
      iconColor: {
        success: '#48bc81',
        error: '#f2613c',
        info: '#1890ff',
        warning: '#f1a82f'
      }
    }
  },
  props: {
    title: {
      default: '' // String | vnode | slot='title'
    },
    subTitle: {
      default: '' // String | vnode slot='subTitle'
    },
    status: {
      type: String,
      default: 'info' // 'success' | 'error' | 'info' | 'warning'| '404' | '403' | '500'
    }
  },
  computed: {
    iconType () {
      return this.iconMap[this.status]
    },
    iconStyle () {
      return {
        color: this.iconColor[this.status]
      }
    }
  }
}
</script>
```

```
// css
.ik-result {
  padding: 48px 32px
}
.ik-result-icon {
  i {
    font-size: 95px;
  }
  text-align: center;
}
.ik-result-title {
  font-size:17px;
  font-weight:500;
  color:rgba(66,71,84,1);
  line-height:22px;
  text-align: center;
  margin: 18px 0 0;
}
.ik-result-subTitle {
  font-size: 13px;
  font-weight: 400;
  color: rgba(174,174,174,1);
  line-height: 15px;
  text-align: center;
  margin: 8px 0 0;
}
.ik-result-content {
  margin-top: 24px;
  padding: 24px 40px;
  background-color: #fafafa;
}
.ik-result-extra {
  margin-top: 32px;
  text-align: center;
}
.ik-result-extra > * {
  margin-right: 8px;
}
.ik-result-extra>:last-child {
  margin-right: 0;
}

```
