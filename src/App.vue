<!--<template>-->
<!--  <div id="app">-->
<!--    <index msg="Welcome to Your Vue.js App"/>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import index from './views/index.vue'-->

<!--export default {-->
<!--  name: 'App',-->
<!--  components: {-->
<!--    index-->
<!--  }-->
<!--}-->
<!--</script>-->

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
