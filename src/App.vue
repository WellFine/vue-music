<template>
  <com-header />
  <com-tab />
  <router-view :style="viewStyle" />
  <com-player />
</template>

<script>
  import { mapState } from 'vuex'

  import Header from '@/components/header/header'
  import Tab from '@/components/tab/tab'
  import Player from '@/components/player/player'

  export default {
    components: {
      ComHeader: Header,
      ComTab: Tab,
      ComPlayer: Player
    },
    computed: {
      ...mapState(['playlist']),
      viewStyle () {
        // 当 mini-player.vue 出现时，将一级路由对应的页面向上移 mini-player.vue 的高度
        const bottom = this.playlist.length ? '60px' : '0px'
        return {
          bottom
        }
      }
    }
  }
</script>

<style lang="scss">
</style>
