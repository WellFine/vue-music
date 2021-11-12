<template>
  <com-header />
  <com-tab />
  <router-view />
</template>

<script>
  import Header from '@/components/header/header'
  import Tab from '@/components/tab/tab'

  export default {
    components: {
      ComHeader: Header,
      ComTab: Tab
    }
  }
</script>

<style lang="scss">
</style>
