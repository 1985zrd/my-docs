<template>
  <div>
    <ik-menu mode="inline" :theme="theme">
      <template v-for="one in menuList">
        <ik-menu-item :key="one.label"
                      v-if="!one.children">
          <ik-icon type="pie-chart" />
          <span>{{one.label}}</span>
        </ik-menu-item>
        <ik-sub-menu :key="one.label"
                     v-else>
          <span slot="title">
            <ik-icon type="mail" />
            <span>{{one.label}}</span>
          </span>
          <template v-for="two in one.children">
            <ik-menu-item :key="two.label"
                          v-if="!two.children">
              {{two.label}}
            </ik-menu-item>
            <ik-sub-menu :key="two.label"
                         v-else>
              <span slot="title">
                <span>{{two.label}}</span>
              </span>
              <ik-menu-item v-for="three in two.children"
                            :key="three.label">
                {{three.label}}
              </ik-menu-item>
            </ik-sub-menu>
          </template>
        </ik-sub-menu>
      </template>
    </ik-menu>
  </div>
</template>
<script>
export default {
  name: 'Menu',
  props: {
    menuList: {
      type: Array,
      default: () => {
        return []
      }
    },
    theme: {
      type: String,
      default: 'dark'
    }
  }
}
</script>
<style lang="">
</style>
