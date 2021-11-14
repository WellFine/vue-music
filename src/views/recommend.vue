<template>
  <div class="recommend">
    <com-scroll class="recommend__scroll">
      <div class="slider-wrapper">
        <div class="slider-content">
          <!-- slider 在使用时要求至少有一条数据，而 sliders 数组初始化时为空，所以需要 v-if 判断 -->
          <com-slider v-if="sliders.length > 0" :sliders="sliders" />
        </div>
      </div>
      <div class="recommend__list">
        <h2 class="recommend__list__title">热门歌单推荐</h2>
        <ul>
          <li v-for="item in albums" :key="item.id" class="recommend__list__item">
            <img v-lazy="item.pic" width="60" height="60" />
            <div class="item__info">
              <h3 class="item__info__name">{{ item.username }}</h3>
              <p class="item__info__description">{{ item.title }}</p>
            </div>
          </li>
        </ul>
      </div>
    </com-scroll>
  </div>
</template>

<script>
import Scroll from '@/components/base/scroll/scroll'
import Slider from '@/components/base/slider/slider'

import { getRecommend } from '@/service/recommend'

export default {
  name: 'recommend',
  components: {
    ComScroll: Scroll,
    ComSlider: Slider
  },
  data () {
    return {
      sliders: [],
      albums: []
    }
  },
  async created () {
    const { sliders, albums } = await getRecommend()
    this.sliders = sliders
    this.albums = albums
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
