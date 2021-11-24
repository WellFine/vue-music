<template>
  <div class="recommend" v-loading:[loadingInfo]="loading">
    <com-scroll class="recommend__scroll">
      <!-- BetterScroll 只针对第一个子元素生效，所以套一层 div -->
      <div>
        <div class="slider-wrapper">
          <div class="slider-content">
            <!-- slider 在使用时要求至少有一条数据，而 sliders 数组初始化时为空，所以需要 v-if 判断 -->
            <com-slider v-if="sliders.length > 0" :sliders="sliders" />
          </div>
        </div>
        <div class="recommend__list">
          <h2 class="recommend__list__title" v-show="!loading">热门歌单推荐</h2>
          <ul>
            <li
              class="recommend__list__item"
              v-for="item in albums" :key="item.id"
              @click="onSelectAlbum(item)"
            >
              <img v-lazy="item.pic" width="60" height="60" />
              <div class="item__info">
                <h3 class="item__info__name">{{ item.username }}</h3>
                <p class="item__info__description">{{ item.title }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </com-scroll>

    <!-- router-view 内嵌套 transition，transition 内嵌套 component 是 vue 官方推荐的嵌套顺序 -->
    <router-view v-slot="{ Component }">
      <!-- slide 的 transition 类定义在 @/assets/scss/base.scss 中 -->
      <transition name="slide">
        <component :is="Component" :data="selectedAlbum"></component>
      </transition>
    </router-view>
  </div>
</template>

<script>
import Scroll from '@/components/wrap-scroll'
import Slider from '@/components/base/slider/slider'

import { getRecommend } from '@/service/recommend'

import storage from 'good-storage'
import { ALBUM_KEY } from '@/assets/js/constant'

export default {
  name: 'recommend',
  components: {
    ComScroll: Scroll,
    ComSlider: Slider
  },
  computed: {
    loading () {
      return !this.sliders.length && !this.albums.length
    }
  },
  data () {
    return {
      sliders: [],
      albums: [],
      loadingInfo: '正在载入...',
      selectedAlbum: null
    }
  },
  async created () {
    const { sliders, albums } = await getRecommend()
    this.sliders = sliders
    this.albums = albums
  },
  methods: {
    onSelectAlbum (album) {
      this.selectedAlbum = album
      // 这里将数据缓存到 sessionStorage 中，用于 /recommend/:id 页面刷新取数据渲染
      this.cacheAlbum(album)
      this.$router.push(`/recommend/${album.id}`)
    },
    cacheAlbum (album) {
      storage.session.set(ALBUM_KEY, album)
    }
  }
}
</script>

<style lang='scss' scoped>
  .recommend {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    overflow: scroll;

    &__scroll {
      // 只有当内容高度超过容器高度才可能滚动，这里设置容器高度不随内容变化，这样内容高度超过容器高度后就能滚动
      height: 100%;
      overflow: hidden;
    }

    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%; // padding 百分数相对于父级宽度
      overflow: hidden;

      .slider-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }

    &__list {
      &__title {
        color: $color-theme;
        font-size: $font-size-medium;
        text-align: center;
        padding: 25px 0;
      }

      &__item {
        box-sizing: border-box;
        padding: 0 20px 20px;
        display: flex;
        align-items: center;

        .item__info {
          flex: 1;
          padding: 0 20px;
          display: flex;
          flex-direction: column;
          font-size: $font-size-medium;

          &__name {
            color: $color-text;
            margin-bottom: 14px;
          }

          &__description {
            width: 240px;
            @include no-wrap();
            color: $color-text-d;
          }
        }
      }
    }
  }
</style>
