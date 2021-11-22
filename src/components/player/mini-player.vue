<template>
  <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="showFullScreen">
      <!-- 这里用 v-show 控制 mini-player 和用 v-if 控制 currentSong 相关的区域是因为 currentSong 中用了 cd 相关的 ref，如果 mini-player 用 v-if，那么当全屏状态下 mini-player 将会销毁，获取不到 cd 相关 ref，那么 cd 的逻辑会报错 -->
      <template v-if="currentSong">
        <div class="cd-wrapper">
          <div class="cd" ref="cdRef">
            <img :class="rotateClass" :src="currentSong.pic" ref="cdImageRef" />
          </div>
        </div>
        <div class="slider-wrapper" ref="sliderWrapperRef">
          <div class="slider-group">
            <div class="slider-page" v-for="song in playlist" :key="song.id">
              <h2 class="name">{{ song.name }}</h2>
              <p class="desc">{{ song.singer }}</p>
            </div>
          </div>
        </div>
      </template>
      <div class="control">
        <progress-circle :radius="32" :progress="progress">
          <i class="icon-mini" :class="miniPlayIcon" @click.stop="togglePlay"></i>
        </progress-circle>
      </div>
    </div>
  </transition>
</template>

<script>
  import { computed } from 'vue'
  import { useStore } from 'vuex'
  import useCD from './useCD'
  import useMiniSlider from './useMiniSlider'
  import ProgressCircle from './progress-circle'

  export default {
    name: 'mini-player',
    components: { ProgressCircle },
    props: {
      progress: {
        type: Number,
        default: 0
      },
      togglePlay: Function
    },
    setup () {
      const store = useStore()
      const fullScreen = computed(() => store.state.fullScreen)
      const currentSong = computed(() => store.getters.currentSong)
      const playlist = computed(() => store.state.playlist)
      const playing = computed(() => store.state.playing)
      const miniPlayIcon = computed(() => playing.value ? 'icon-pause-mini' : 'icon-play-mini')

      const showFullScreen = () => {
        store.commit('setFullScreen', true)
      }

      const { rotateClass, cdRef, cdImageRef } = useCD()

      const { sliderWrapperRef } = useMiniSlider()

      // 这里不能用 useBasePlay 来获取 togglePlay，因为 togglePlay 中依赖了 songReady 这个值
      // 如果在这里重新调用 useBasePlay，那么 songReady 将永远为 false
      // songReady 只能从外层的 player.vue 中调用的 useBasePlay() 取值并通过传参的方式传入本组件
      // const { togglePlay } = useBasePlay()

      return {
        fullScreen,
        currentSong,
        playlist,
        miniPlayIcon,
        showFullScreen,
        // cd
        rotateClass,
        cdRef,
        cdImageRef,
        // mini-slider
        sliderWrapperRef
      }
    }
  }
</script>

<style lang='scss' scoped>
  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;

    .cd-wrapper {
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      padding: 0 15px 0 15px;

      .cd {
        width: 100%;
        height: 100%;

        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          &.playing {
            animation: rotate 10s linear infinite;
          }
          &.pause {
            animation-play-state: paused;
          }
        }
      }
    }

    .slider-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: 20px;
      overflow: hidden;
      .slider-group {
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        .slider-page {
          display: inline-block;
          width: 100%;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          .name {
            margin-bottom: 2px;
            @include no-wrap();
            font-size: $font-size-medium;
            color: $color-text;
          }
          .desc {
            @include no-wrap();
            font-size: $font-size-small;
            color: $color-text-d;
          }
        }
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;
      .icon-playlist {
        position: relative;
        top: -2px;
        font-size: 28px;
        color: $color-theme-d;
      }
      .icon-mini {
        position: absolute;
        left: 0;
        top: 0;
        color: $color-theme-d;
        font-size: 32px;
      }
    }

    &.mini-enter-active, &.mini-leave-active {
      transition: all .6s cubic-bezier(.45, 0, .55, 1);
    }
    &.mini-enter-from, &.mini-leave-to {
      opacity: 0;
      transform: translate3d(0, 100%, 0);
    }
  }
</style>
