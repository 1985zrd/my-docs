# vue单元测试jest

## 单元测试jest配置
```
module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  moduleNameMapper: { // 别名
    // eslint-disable-next-line no-useless-escape
    '^@\/(.*?\.?(js|vue)?|)$': '<rootDir>/src/$1',
    '^@assets\/(.*?\.?(js|vue)?|)$': '<rootDir>/src/assets/$1',
    '^@api\/(.*?\.?(js|vue)?|)$': '<rootDir>/src/api/$1',
    '^@components\/(.*?\.?(js|vue)?|)$': '<rootDir>/src/components/$1',
    '^@config\/(.*?\.?(js|vue)?|)$': '<rootDir>/src/config/$1',
    '^@store\/(.*?\.?(js|vue)?|)$': '<rootDir>/src/store/$1',
    '^@theme\/(.*?\.?(js|vue)?|)$': '<rootDir>/src/theme/$1',
    '^@utils\/(.*?\.?(js|vue)?|)$': '<rootDir>/src/utils/$1'
  },
  coverageDirectory: '<rootDir>/tests/unit/coverage', // 覆盖率报告的目录
  // collectCoverage: true, // 是否开启测试覆盖率输出
  collectCoverageFrom: [ // 测试报告想要覆盖那些文件，目录，前面加！是避开这些文件
    // 'src/components/**/*.(js|vue)',
    'src/**/*.(vue)',
    '!src/main.js',
    '!src/router/index.js',
    '!**/node_modules/**'
  ],
  testMatch: [ //匹配测试用例的文件，只需测试单个时配置
    '<rootDir>/tests/unit/spec/CartTotal.spec.js'
  ],
}

```

来一个例子
```
import { shallowMount } from '@vue/test-utils'
import App from '@/app.vue'

import global from '@config/index'

import Customer from '@/components/common/customer.vue'
import PageHeader from '@/components/common/header/page-header.vue'
import Breadcrumb from '@/components/common/breadcrumb.vue'
import Notice from '@/components/common/header/notice.vue'

// const localVue = createLocalVue()

const $route = {
  path:'/',
  name: 'index',
  meta: {
    keepAlive: true
  }
  // ...其他属性
}
const mockPush = jest.fn()
const $router = {
  push:mockPush
  // ... 其他属性
}

describe('App组件基本检测', () => {
  // wrapper.vm是组件实例，包含该实例的所有方法和属性
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(App, {
      stubs: ['router-link', 'router-view'],
      mocks: {
        $route,
        $router
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('组件的data必须为函数', () => {
    expect(typeof wrapper.vm.$options.data).toBe('function')
  })

  it('组件的data.isRouterAlive默认为true', () => {
    expect(wrapper.vm.isRouterAlive).toBeTruthy()
  })

  it('methods reload()执行this.isRouterAlive值变化', async () => { // 不明白为什么要置成false，再true
    wrapper.vm.reload()
    expect(wrapper.vm.isRouterAlive).toBeFalsy()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isRouterAlive).toBeTruthy()
  })

  it('index页面footer必须显示', async () => {
    wrapper.setData({ global: {
      deviceType: 'mobile'
    } })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.footerShow).toBeTruthy()
    wrapper.setData({ global: {
      deviceType: 'pc'
    } })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.footerShow).toBeTruthy()
    expect(wrapper.contains('footer')).toBeTruthy()
    // expect(wrapper.find('footer').exists()).toBe(true)
  })

  it('index页面PageHeader必须显示', async () => {
    expect(wrapper.vm.fullScreenWhite).toBeFalsy()
    expect(wrapper.contains(PageHeader)).toBe(true)
    // expect(wrapper.find('footer').exists()).toBe(true)
  })

  it('pc端和移动端index页面Breadcrumb必须隐藏', async () => {
    expect(wrapper.vm.breadcrumbNotShow).toBeTruthy()
    wrapper.setData({ global: {
      deviceType: 'pc'
    } })
    await wrapper.vm.$nextTick()
    expect(wrapper.contains(Breadcrumb)).toBe(false)
    wrapper.setData({ global: {
      deviceType: 'mobile'
    } })
    await wrapper.vm.$nextTick()
    expect(wrapper.contains(Breadcrumb)).toBe(false)
  })

  it('index页面Customer必须显示', async () => {
    expect(wrapper.vm.customerShow).toBeFalsy()
    expect(wrapper.contains(Customer)).toBe(true)
  })

  it('index页面Notice必须显示', async () => {
    expect(wrapper.contains(Notice)).toBe(true)
  })
  
})
```

再来一个例子
```
import { shallowMount, createLocalVue, mount } from '@vue/test-utils'
import sinon from 'sinon'
import ElementUI from 'element-ui'

import CartTotal from '@components/cart/cart-total'

const localVue = createLocalVue()

localVue.use(ElementUI)

let cartValidList = [{
  activityDescription: null,
  activityPrice: null,
  activityPriceTotal: null,
  activityType: "0",
  checkState: "1",
  count: 3,
  createTime: 1588145855537,
  endDatetime: null,
  imageUrl: "http://uat.vmall.ikang.com/image/data/201908/1565774425-632762.jpg",
  limitFlag: null,
  limitNum: null,
  marketPrice: 3332,
  productId: 20892,
  productName: "爱康国宾 怡然中老年深度体检（男女单人使用）体检套餐",
  productSpecId: 1040,
  productSpecName: "虚卡（电子卡密）",
  productStatus: "1",
  sellingPrice: 1688,
  subtotal: 5064,
  useActivity: "0",
  userId: null
}]

let cartInfo = {
  cartItemList: [{
    activityDescription: null,
    activityPrice: null,
    activityPriceTotal: null,
    activityType: "0",
    checkState: "1",
    count: 3,
    createTime: 1588145855537,
    endDatetime: null,
    imageUrl: "http://uat.vmall.ikang.com/image/data/201908/1565774425-632762.jpg",
    limitFlag: null,
    limitNum: null,
    marketPrice: 3332,
    productId: 20892,
    productName: "爱康国宾 怡然中老年深度体检（男女单人使用）体检套餐",
    productSpecId: 1040,
    productSpecName: "虚卡（电子卡密）",
    productStatus: "1",
    sellingPrice: 1688,
    subtotal: 5064,
    useActivity: "0",
    userId: null
  }],
  checkTotal: 0,
  checkTotalActivityPrice: 5064,
  checkTotalMarketPrice: 9996,
  checkTotalSellingPrice: 5064,
  discountsPrice: 0,
  total: 3
}

describe('CartTotal组件——购物车计算总价组件，点击按钮去结算。', () => {
  let wrapper
  const clickHandler = jest.fn()
  beforeEach(() => {
    wrapper = mount(CartTotal, { // 有element-ui，必须用mount，不能用shallowMount，不然找不到element-ui元素
      localVue,
      propsData: {
        cartSelectAll: false, // 是否全选了
        cartValidList: cartValidList, // 购物车里的商品列表
        totalNum: 0, // 选了几件商品
        totalPrice: 0, // 选择商品的总价
        cartInfo: cartInfo, // 购物车信息
        deleteSelect: clickHandler
      }
    })
  })

  // it('购物车计算总价组件，点击按钮去结算。', () => {

  // })
  it('组件的data必须为函数', () => {
    expect(typeof wrapper.vm.$options.data).toBe('function')
  })

  it('组件mounted钩子函数执行', async () => {
    expect(wrapper.vm.totalSelect).toBeFalsy()
  })

  it('删除选中商品', async () => {
    wrapper.setData({ global: {
      deviceType: 'mobile'
    } })
    await wrapper.vm.$nextTick()
    expect(wrapper.contains('.cart-total_btn--delete')).toBeFalsy()

    wrapper.setData({ global: {
      deviceType: 'pc'
    } })
    wrapper.setProps({cartSelectAll: false})
    await wrapper.vm.$nextTick()
    expect(wrapper.contains('.cart-total_btn--delete')).toBeTruthy()

    wrapper.setProps({cartSelectAll: true})
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.totalSelect).toBeTruthy()

    // wrapper.find('.cart-total_btn--delete').trigger('click');

    // await wrapper.vm.$nextTick()
    // wrapper.vm.$emit('deleteSelect')
    // // 查看是否有回调
    // expect(clickHandler.called).toBe(true)
    // // 回调次数
    // expect(clickHandler).toHaveBeenCalledTimes(1)
  })

  it('点击删除选中商品按钮，没选择商品时', async () => {
    wrapper.setData({ global: {
      deviceType: 'pc'
    }, cartInfo: {
      ...wrapper.vm.cartInfo,
      checkTotal: 0
    } })
    const stub = jest.fn()
    wrapper.setMethods({ deleteSelect: stub })
    await wrapper.vm.$nextTick()
    wrapper.find('.cart-total_btn--delete').trigger('click');
    expect(stub).not.toBeCalled() // 不触发
  })
  it('点击删除选中商品按钮，有选择商品时', async () => {
    wrapper.setData({ global: {
      deviceType: 'pc'
    }, cartInfo: {
      ...wrapper.vm.cartInfo,
      checkTotal: 3
    } })
    const stub = jest.fn()
    wrapper.setMethods({ deleteSelect: stub })
    await wrapper.vm.$nextTick()
    wrapper.find('.cart-total_btn--delete').trigger('click');
    expect(stub).toBeCalled()
    expect(stub).toHaveBeenCalledTimes(1) // 只触发一次

  })

  it('checkbox change', async () => {
    const stub = jest.fn()
    wrapper.setMethods({ changeSelectAll: stub })
    wrapper.find('.el-checkbox').trigger('click');
    expect(stub).toBeCalled()
    expect(stub).toHaveBeenCalledTimes(1) // 只触发一次
  })

  it('点击结算按钮选择的商品为0', async () => {
    wrapper.setData({ cartInfo: {
      ...wrapper.vm.cartInfo,
      checkTotal: 0
    }})
    const stub = jest.fn()
    wrapper.setMethods({ toSettlement: stub })
    await wrapper.vm.$nextTick()
    wrapper.find('.cart-total_btn--save').trigger('click');
    expect(stub).not.toBeCalled() // 不触发
  })

  it('点击结算按钮选择的商品为3', async () => {
    wrapper.setData({ cartInfo: {
      ...wrapper.vm.cartInfo,
      checkTotal: 3
    }})
    const stub = jest.fn()
    wrapper.setMethods({ toSettlement: stub })

    await wrapper.vm.$nextTick()

    wrapper.find('.cart-total_btn--save').trigger('click');
    expect(stub).toBeCalled()
    expect(stub).toHaveBeenCalledTimes(1) // 只触发一次

    wrapper.find('.cart-total_btn--save').trigger('click');
    expect(stub).toBeCalled()
    expect(stub).toHaveBeenCalledTimes(2) // 只触发一次

    let strongList = wrapper.findAll('.cart-total_right strong')
    let strong1 = strongList.at(0)
    let strong2 = strongList.at(1)

    expect(strong1.text()).toBe('3')
    let price = wrapper.vm.cartInfo.checkTotalActivityPrice.toFixed(2) + ''
    expect(strong2.text()).toContain(price)

  })
})

```