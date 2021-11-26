<template>
  <div class="top-list" v-loading="loading">
    <com-scroll class="top-list-content">
      <ul>
        <li
          class="item"
          v-for="item in topList" :key="item.id"
          @click="onSelectItem(item)"
        >
          <div class="icon">
            <img v-lazy="item.pic" />
          </div>
          <ul class="song-list">
            <li class="song" v-for="(song, index) in item.songList" :key="song.id">
              <span>{{ index + 1 }}</span>
              <span>{{ song.songName }} - {{ song.singerName }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </com-scroll>
    <router-view v-slot="{ Component }">
      <transition name="slide">
        <component :is="Component" :data="selectedTop"></component>
      </transition>
    </router-view>
  </div>
</template>

<script>
  import Scroll from '@/components/wrap-scroll'
  import { getTopList } from '@/service/top-list'

  import storage from 'good-storage'
  import { TOP_KEY } from '@/assets/js/constant'

  export default {
    name: 'top-list',
    components: {
      ComScroll: Scroll
    },
    data () {
      return {
        topList: [],
        loading: true,
        selectedTop: null
      }
    },
    async created () {
      const data = await getTopList()
      this.topList = data.topList
      this.loading = false
    },
    methods: {
      onSelectItem (item) {
        this.selectedTop = item
        this.cacheTop()
        this.$router.push(`/top-list/${item.id}`)
      },
      cacheTop () {
        storage.session.set(TOP_KEY, this.selectedTop)
      }
    }
  }
</script>

<style lang='scss' scoped>
  .top-list {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;

    .top-list-content {
      height: 100%;
      overflow: hidden;

      .item {
        display: flex;
        margin: 0 20px;
        padding-top: 20px;
        height: 100px;

        &:last-child {
          padding-bottom: 20px;
        }

        .icon {
          flex: 0 0 100px;
          width: 100px;
          height: 100px;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .song-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 20px;
          height: 100px;
          overflow: hidden;
          background: $color-highlight-background;
          color: $color-text-d;
          font-size: $font-size-small;

          .song {
            @include no-wrap();
            line-height: 26px;
          }
        }
      }
    }
  }
</style>
