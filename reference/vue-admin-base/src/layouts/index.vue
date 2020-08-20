<template>
  <ik-layout id="components-layout-demo-side">
    <ik-layout-sider v-model="collapsed"
                     :width="width"
                     :collapsedWidth="collapsedWidth"
                     :theme="dark ? 'dark': 'light'">
      <div class="logo">
        <!-- LOGO -->
        <slot name='logo'></slot>
      </div>
      <!-- 菜单 -->
      <Menu :menuList="menuList" :theme="dark ? 'dark': 'light'"></Menu>
    </ik-layout-sider>
    <ik-layout style="padding: 0 16px 0 32px">
      <ik-layout-header>
        <!-- 头部 -->
        <Header />
      </ik-layout-header>
      <ik-layout-content>
        <!-- 内容 -->
        <slot></slot>
      </ik-layout-content>
    </ik-layout>
  </ik-layout>
</template>
<script>
import Menu from './Menu'
import Header from './Header'
export default {
  name: 'Layout',
  props: {
    width: { // 默认宽度
      type: Number,
      default: 192
    },
    collapsedWidth: { // 默认收缩宽度
      type: Number,
      default: 104
    },
    dark: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      collapsed: false,
      menuList: [{ // 案例数据
        label: '一级 1'
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1'
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }]
    }
  },
  components: {
    Menu, Header
  }
}
</script>

<style lang="scss">
#components-layout-demo-side {
  min-height: 100vh;
  .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }
  .operation-box {
    height: 100%;
    float: right;
  }
  .ant-layout-header {
    background: #eef1f5;
    padding: 0;
    height: 48px;
    line-height: 48px;
  }
  .ant-layout-content {
    margin-bottom: 8px;
    background: #fff;
    position: relative;
  }
  .ant-layout-sider {
  }
}
</style>
