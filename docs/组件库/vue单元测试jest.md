# vue单元测试jest

[参考官网](https://vue-test-utils.vuejs.org/zh/)

[参考博客](https://holylovelqq.github.io/vue/VueUnitTest.html)

运行`vue ui`，在插件中添加插件`@vue/cli-plugin-unit-jest`，项目里会生成相应命令和`tests`文件夹。

如果运行`npm run test:unit`报错，错误信息如下：
```js
FAIL  src/App.test.js
  ● Test suite failed to run

    ReferenceError: [BABEL] C:\Users\htbst\Desktop\woyin-h5\src\App.test.js: Unknown option: base.configFile. Check out http://babeljs.io/docs/usage/options/ for more information about options.

    A common cause of this error is the presence of a configuration options object without the corresponding preset name. Example:

    Invalid:
      `{ presets: [{option: value}] }`
    Valid:
      `{ presets: [['presetName', {option: value}]] }`
```
可以使用 `"babel-core": "7.0.0-bridge.0"` 代替 `"babel-core": "^6.26.3"`

## 单元测试jest配置
```js
module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  moduleNameMapper: {
    // eslint-disable-next-line no-useless-escape
    '^@\/(.*?\.?(js|vue)?|)$': '<rootDir>/packages/$1'
  },
  coverageDirectory: '<rootDir>/tests/unit/coverage', // 覆盖率报告的目录
  // collectCoverage: true,
  collectCoverageFrom: [ // 测试报告想要覆盖那些文件，目录，前面加！是避开这些文件
    // 'src/components/**/*.(js|vue)',
    'packages/**/*.js',
    // '!packages/**/src/*.(js|vue)'
  ],
  // testMatch: [ //匹配测试用例的文件
  //   // '<rootDir>/tests/unit/spec/CartTotal.spec.js'
  // ],
}
```

## 封装一个测试实例

```js
// tests/unit/util.js
import { createLocalVue, mount } from '@vue/test-utils'

import ddUi from '../../src/index.js'

const localVue = createLocalVue()

localVue.use(ddUi);

/**
 * 创建一个 wrapper
 * @param {Object} Comp 组件对象
 * @param {Object} propsData props 数据
 * @return {Object} wrapper
 */
export const createWrapper = function (Comp, propsData = {}) {
  const wrapper = mount(Comp, { // 有element-ui，必须用mount，不能用shallowMount，不然找不到element-ui元素
    localVue,
    ...propsData
  })

  return wrapper
}
```

## 测试button组件
```js
// tests/unit/specs/button.spec.js
import { createWrapper } from '../util'
import Button from '@/button'

describe('Button', () => {
  let wrapper
  afterEach(() => {
    wrapper.destroy()
  })

  it('create', () => {
    wrapper = createWrapper(Button)
    expect(wrapper.classes()).toContain('d-button')
    expect(wrapper.classes()).toContain('d-button--primary')
  })
  it('slots', () => {
    const wrapper = createWrapper(Button, {
      slots: {
        default: '按钮'// 自定义slots内容
      }
    })
    const button = wrapper.find('button')
    expect(button.text()).toBe('按钮')
  
    wrapper.destroy()
  })
  it('click', async () => {
    const stub = jest.fn()
    wrapper.vm.$on('click', stub)
    // wrapper.setMethods({ // setMethods是即将移除的方法，不建议使用
    //   handleClick: stub
    // })
    // const wrapper = createWrapper(Button, { // methods覆盖会报警告
    //   methods: {
    //     handleClick: stub
    //   }
    // })
    wrapper.trigger('click')
    // await wrapper.vm.$nextTick()
    expect(stub).toBeCalled()
    expect(stub).toHaveBeenCalledTimes(1) // 只触发一次

    wrapper.trigger('click')
    expect(stub).toBeCalled()
    expect(stub).toHaveBeenCalledTimes(2) // 只触发一次
  })
})
```

