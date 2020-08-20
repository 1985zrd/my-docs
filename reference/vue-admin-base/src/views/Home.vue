<template>
  <div class="home">
    <ThemeSetting/>
    <h1 @click="modifyTitle">{{ title }}</h1>
    <img alt="Vue logo"
         src="@/assets/images/common/logo.svg">

    <HelloWorld msg="Welcome to Your Vue.js App" />

     <ik-button type="primary"
                 shape="circle"
                 :loading="true"/>
    <ik-button type="primary"
                shape="round"
                icon="download"
                ghost>Download</ik-button>
    <h3 style="margin-top: 20px;">align(vertical垂直|horizontal默认水平)</h3>
    <ik-button
                align='vertical'
                icon="download">医学影像</ik-button>
  </div>

</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import ThemeSetting from '@/components/ThemeSetting.vue'
import * as types from '../store/demo/types'

export default {
  name: 'Home',
  components: {
    HelloWorld,
    ThemeSetting
  },
  computed: {
    title: function () {
      return this.$store.state.demo.title
    },
    colors: function () {
      return this.$store.getters.themeColor
    }
  },
  methods: {
    modifyTitle () {
      this.$store.dispatch(types.SET_TITLE, 'haha' + Math.random())
    },
    a () {
      // console.log('ssssss')
    }
  }
}
</script>
<style lang="scss">
.home{
  text-align: center;
}
</style>
