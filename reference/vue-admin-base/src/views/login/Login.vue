<template>
  <div class="login">
    <LoginContainer title="这里假装有title"
                    :bgImg="bgImg">

    </LoginContainer>
  </div>
</template>

<script>
import LoginContainer from '@components/login-container/LoginContainer'
// 自定义背景圖
const bgImg = require('@assets/images/common/404@2x.png')
export default {
  name: 'login',
  data () {
    return {
      bgImg
    }
  },
  beforeCreate () {
  },
  mounted () {
  },
  components: { LoginContainer },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100vw;
  height: 100vh;
}
</style>
