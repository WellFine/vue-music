<template>
  <div class="singer" v-loading="singers.length === 0">
    <index-list :data="singers" @select="onSelectSinger" />

    <!-- router-view 内嵌套 transition，transition 内嵌套 component 是 vue 官方推荐的嵌套顺序 -->
    <router-view v-slot="{ Component }">
      <!-- slide 的 transition 类定义在 @/assets/scss/base.scss 中 -->
      <transition name="slide">
        <component :is="Component" :data="selectedSinger"></component>
      </transition>
    </router-view>

    <!-- 这种嵌套方式也能使 transition 动画生效，但还是使用官方推荐的嵌套顺序比较好 -->
    <!-- <transition name="slide">
      <router-view :singer="selectedSinger"></router-view>
    </transition> -->
  </div>
</template>

<script>
import IndexList from '@/components/index-list/index-list'
import { getSingerList } from '@/service/singer'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'

export default {
  name: 'singer',
  components: {
    IndexList
  },
  data () {
    return {
      singers: [],
      selectedSinger: null
    }
  },
  async created () {
    const result = await getSingerList()
    this.singers = result.singers
  },
  methods: {
    onSelectSinger (singer) {
      this.selectedSinger = singer
      this.cacheSinger(singer)
      this.$router.push(`/singer/${singer.mid}`)
    },
    cacheSinger (singer) {
      storage.session.set(SINGER_KEY, singer)
    }
  }
}
</script>

<style lang='scss' scoped>
  .singer {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;

    // 下面这段提取到了 @/assets/scss/base.scss 中，因为很多页面使用了这段动画
    // .v-enter-from,
    // .v-leave-to {
    //   transform: translateX(100%);
    // }

    // .v-enter-to,
    // .v-leave-from {
    //   transform: translateX(0);
    // }

    // .v-enter-active,
    // .v-leave-active {
    //   transition: transform 1s;
    // }
  }
</style>
