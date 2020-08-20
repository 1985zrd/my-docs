<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h3>filter试验</h3>
    <p v-for="(item,index) in list"
       :key="index">{{item | fixNum(2)}}</p>
  </div>
</template>
<script>
export default {
  name: 'about',
  data () {
    return {
      list: [1, 2, 3, 4, 5, 6, 7]
    }
  }
}
</script>
