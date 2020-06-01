# vue可复用组件开发基础

可复用组件，应该包含**输入**和**输出**。如果是纯展示组件，可以没有输出。

在vue中，输入的方式有很多：
1. props
2. v-model
3. provide/inject
4. slot
5. mixin
6. ...

输出一般都是用emit。

## props
在子组件中定义props
```
// Child
export default {
    props: {
        title: {
            type: String
        }
    }
}
```
父组件传入
```
// Parent
<Child title="标题" />
```
`props`的`type`可以设置多种类型，`type: [String, Number]`。也可以设置是否必传`required: true | false`，和默认值`default: '标题'`。如果默认值是引用类型，则：
```
default () {
    return {} || []
}
```
`props`应遵循**单向数据流**：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。这样会防止从子组件意外改变父级组件的状态，从而导致你的应用的数据流向难以理解。
## v-model
`v-model`一般用在输入型元素上，如：`input`和`textarea`。它也可以用在组件上。
```
// 父组件中绑定count值
<Test v-model="count" />
```
```
// 子组件中
<template>
  <div @click="clickHanler">{{ count }}</div>
</template>

<script>
export default {
  name: 'Test',
  model: {
    prop: 'count',
    event: 'change'
  },
  props: {
    count: {
      type: Number,
      default: 0
    }
  },
  methods: {
    clickHanler () {
      this.$emit('change', this.count + 1)
    }
  }
}
</script>
```
子组件`props`接收，然后在`model`中定义`prop`和`event`。`event`可以定义任意名称，只需`emit`触发的事件与之对应即可。
## provide/inject
>`provide` 和 `inject` 主要在开发高阶插件/组件库时使用。并不推荐用于普通应用程序代码中。

这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效。
```
// 父组件
provide: {
    a: 2
}
```
```
// 子孙组件
inject: {
    a: {
        default: 1
    }
}
```
在子孙组件中，可以通过`this.a`获取。
## slot 插槽
`Vue` 提供了一套内容分发`API`，用`slot`去承载分发的内容。
```
// 子组件
<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Test'
}
</script>
```
```
// 父组件
<Test>
    <p>我是默认slot</p>
</Test>
```
也可以使用具名插槽，还可以传递参数（作用域插槽）：
```
// 父组件
  <Test :obj="obj">
    <template v-slot:content="slotProps">
      <p>我是content {{ slotProps.obj.a }}</p>
    </template>
  </Test>
  
  data () {
    return {
      obj: {
        a: 12
      }
    }
  }
```
```
// 子组件
<template>
  <div>
    <slot :obj="obj" name="content"></slot>
  </div>
</template>

<script>
export default {
  name: 'Test',
  props: ['obj']
}
</script>
```
## mixin 混入
如果多个组件（2个或以上）有可复用的部分，可以考虑使用`mixin`。
```
// 定义一个mixin
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}
```
```
// 在组件中引用
export default {
  mixins: [myMixin]
}
```
选项合并方式参考`vue`官网。
## 递归组件
有时候我们需要递归组件，需确保递归能有终结，不要出现无限循环。

## 可复用组件开发原则
1. 组件的命名应该跟业务无关，跟功能相关。
2. 组件只实现UI界面和UI交互，不做数据交互。操作后通过`emit`返回。
3. 传入的参数尽量简单，尽量不要传入对象。
4. 组件功能尽量单一，可复用性高。
5. 尽量减少外部依赖。
6. 组件应该有一定的容错性。
7. 全局注册。
8. 样式尽量用`scoped`，以免相互污染。

## 可复用组件示例
```
<template>
  <div v-transfer-dom class="popup_box" v-show="show">
    <div class="popup_box_wrap">
      <h3 v-if="title" class="main_title">{{ title }}</h3>
      <i v-if="hasClose" class="close" @click="callback('close')"></i>
      <div class="popup_box_content">
        <slot>
          <p class="popup_message">{{ message }}</p>
        </slot>
      </div>
      <div v-if="btn.length" class="btn_group">
        <span @click="callback(item.value)" v-for="(item, index) in btn" :key="index">{{ item.lable }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { TransferDom } from 'vux'
export default {
  name: 'Popup',
  props: {
    show: {
      type: Boolean,
      default: true
    },
    message: String,
    time: {
      default: null
    },
    title: {
      type: String,
      default: ''
    },
    hasClose: {
      type: Boolean,
      default: false
    },
    btn: {
      type: Array,
      default () {
        return [{
          lable: '取消',
          value: 0
        }, {
          lable: '确定',
          value: 1
        }]
      }
    }
  },
  directives: {
    'transfer-dom': TransferDom
  },
  created () {
    this.$nextTick(() => {
      if (typeof this.time === 'number') {
        setTimeout(() => {
          this.$emit('back', 'close')
        }, this.time)
      }
    })
  },
  methods: {
    callback (val) {
      this.$emit('back', val)
    }
  }
}
</script>
<style scoped>
.popup_box {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(51, 51, 51, 0.43);
  text-align: center;
  z-index: 99;
}
.popup_box_wrap {
  padding: 46px 40px 40px;
  width: 560px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 1rem #999;
  box-sizing: border-box;
  position: relative;
}
.popup_box_content {
  text-align: left;
  max-height: 18rem;
  font-size: 0.8rem;
  overflow: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.popup_message {
  line-height: 60px;
  text-align: center;
}
.popup_box .close {
  position: absolute;
  right: 0;
  top: 15px;
  width: 40px;
  height: 40px;
  padding: 20px;
  background: url(../assets/imgs/close_btn.png) no-repeat center center;
  background-size: 40px 40px;
}
.popup_box h3 {
  line-height: 110px;
  text-align: left;
  height: 110px;
  background: #f7f7f7;
  font-size: 32px;
  font-weight: 400;
  padding-left: 1.7rem;
}
.popup_box .main_title {
  padding: 0;
  margin: 0;
  text-align: center;
  border-radius: 10px 10px 0 0;
  font-weight: bold;
}
.btn_group {
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  font-size: 30px;
  text-align: center;
  background: #fff;
}
.btn_group span {
  display: block;
  width: 45%;
  height: 60px;
  line-height: 60px;
  border-radius: 10px;
}
.btn_group span:nth-of-type(1) {
  border: 1px solid #ff5722;
  color: #ff5722;
}
.btn_group span:nth-of-type(2) {
  color: #fff;
  background-color: #ff5722;
}
</style>

```

