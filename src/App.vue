<template>
  <com-header />
  <com-tab />
  <router-view />
  <com-player />
</template>

<script>
  import Header from '@/components/header/header'
  import Tab from '@/components/tab/tab'
  import Player from '@/components/player/player'

  export default {
    components: {
      ComHeader: Header,
      ComTab: Tab,
      ComPlayer: Player
    }
  }
</script>

<style lang="scss">
</style>
