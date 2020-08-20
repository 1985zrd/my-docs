<template>
  <div class="sketch-picker--box">
    <div class="change-color"
         @click="settingHandler">
      <span :style="{background: colors}"></span> 切换主题
    </div>
    <div class="sketch-picker"
         style="margin-bottom: 10px"
         v-show="visible">
      <sketch-picker v-model="colors"></sketch-picker>
      <!-- <h3 style="margin-top: 20px;">Menu风格</h3>
      <ik-radio-group v-model="theme">
        <ik-radio value="light">亮</ik-radio>
        <ik-radio value="dark">暗</ik-radio>
      </ik-radio-group> -->
    </div>
  </div>
</template>
<script>
import { Sketch } from 'vue-color'
import { updateTheme } from '@/utils/changeTheme/settingConfig'
export default {
  name: 'ThemeSetting',
  components: {
    'sketch-picker': Sketch
  },
  data () {
    return {
      visible: false
    }
  },
  mounted () {
    // console.log(this.colors, '=-------------mounted')
    this.colors && updateTheme(this.colors)
  },
  watch: {
    colors: (val) => {
      // console.log(val, '=-------------watch')
      updateTheme(val)
    }
  },
  computed: {
    theme: {
      get: function () {
        return this.$store.getters.theme
      },
      set: function (val) {
        this.$store.dispatch('SET_THEME', val)
      }
    },
    colors: {
      get: function () {
        return this.$store.getters.themeColor
      },
      set: function (val) {
        this.$store.dispatch('SET_THEME_COLOR', typeof val === 'string' ? val : val.hex)
        this.onClose()
      }
    }
  },
  methods: {
    settingHandler () {
      this.visible = true
    },
    onClose () {
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.sketch-picker--box {
  position: relative;
  display: inline-block;
  cursor: pointer;
}
.sketch-picker {
  position: absolute;
  top: 16px;
  z-index: 1;
}
.change-color {
  line-height: 24px;
  position: relative;
  padding-left: 24px;
  span {
    background: #ff6800;
    border-radius: 2px;
    width: 16px;
    height: 16px;
    position: absolute;
    top: 4px;
    left: 0;
  }
}
</style>
