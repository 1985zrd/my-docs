<template>
  <!-- <Layout :dark="false"> -->
  <Layout>
    <ik-empty :image="img">
      <span slot="description"> 啊啊啊！你要找的页面飞走了…. </span>
      <ik-button type="primary"
                 @click="goHome">返回首页</ik-button>
    </ik-empty>
  </Layout>
</template>

<script>
import Layout from '@layouts/index'
export default {
  name: 'errorPage',
  data () {
    return {
      img: require('@assets/images/common/404@2x.png')
    }
  },
  components: {
    Layout
  },
  methods: {
    goHome () {
      this.$router.replace('/')
    }
  }
}
</script>
<style lang="scss">
.ant-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  .ant-empty-image {
    height: 405px;
  }
}
</style>
