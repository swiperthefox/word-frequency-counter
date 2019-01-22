<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import store from './store'

export default {
  name: 'App',
  store,
  created () {
    this.$store.dispatch('fetchDocument')
  }
}
</script>

<style>
#q-app {
  overflow: auto;
}
</style>
