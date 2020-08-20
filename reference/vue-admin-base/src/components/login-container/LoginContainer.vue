<template>
  <div class="login-box">
    <div class="login-box__center-box">
      <div class="center-box__input-box">
        <div class="input-box__logo">
          <img src="@/assets/images/common/logo.svg" />
        </div>
        <h1 class="input-box__title">
          {{title}}
        </h1>
        <div class="input-box__form">
          <slot>
            此处slot：default
            添加自定义登录表单
          </slot>
        </div>
      </div>
      <div class="center-box__img-box" :style="bgImg?`background: url(${bgImg}) no-repeat center center`:''"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login-container',
  props: {
    title: {
      default: '请传入props：title',
      isrequired: true
    },
    bgImg: {
      default: null
    }
  },
  data () {
    return {
    }
  },
  beforeCreate () {
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
@import './login-container.less';
</style>
