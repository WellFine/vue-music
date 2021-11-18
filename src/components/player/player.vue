<template>
  <div class="player">
    <div class="normal-player" v-show="fullScreen">
      <template v-if="currentSong">
        <div class="background">
          <img :src="currentSong.pic" />
        </div>
        <div class="top">
          <div class="back" @click="goBack">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="singer">{{ currentSong.singer }}</h2>
        </div>
        <div class="bottom">
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlay"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </template>
    </div>
    <!--
      当音乐播放完毕，设备待机或睡眠时，会触发 audio 标签的 pause 事件，此时需要更改播放状态以避免数据状态不一致
      音乐是流式加载的，每加载一段内容就会缓冲下来，只有当有缓冲内容时才会播放音乐，缓冲内容更新会触发 canplay 事件
      歌曲播放有问题时会触发 error 事件
    -->
    <audio
      ref="audioRef"
      @play="play"
      @pause="pause"
      @canplay="ready"
      @error="error"
    ></audio>
  </div>
</template>

<script>
  import { computed, watch, ref } from 'vue'
  import { useStore } from 'vuex'

  export default {
    name: 'player',
    setup () {
      const audioRef = ref(null)
      // songReady 是歌曲缓冲标识，为 false 时将无法上下切换歌曲，也无法暂停或播放歌曲
      const songReady = ref(false)

      const store = useStore()

      const fullScreen = computed(() => store.state.fullScreen)
      const currentSong = computed(() => store.getters.currentSong)

      const playing = computed(() => store.state.playing)
      const playIcon = computed(() => playing.value ? 'icon-pause' : 'icon-play')

      const currentIndex = computed(() => store.state.currentIndex)
      const playlist = computed(() => store.state.playlist)

      const disableCls = computed(() => songReady.value ? '' : 'disable')

      watch(currentSong, song => {
        if (!song.id || !song.url) return

        // 切换歌曲时将重置缓冲标志
        songReady.value = false
        const audioEl = audioRef.value
        audioEl.src = song.url // 设置音频链接
        audioEl.play() // 播放
      })

      watch(playing, bool => {
        // 歌曲还没有缓冲内容时暂时不播放
        if (!songReady.value) return

        bool ? audioRef.value.play() : audioRef.value.pause()
      })

      const goBack = () => {
        store.commit('setFullScreen', false)
      }

      const togglePlay = () => {
        // 如果歌曲还没有加载好，那么直接返回
        if (!songReady.value) return
        store.commit('setPlayingState', !playing.value)
      }

      const play = () => {
        store.commit('setPlayingState', true)
      }

      const pause = () => {
        // 当 audio 触发了 pause 事件时，需要进行数据状态的统一
        store.commit('setPlayingState', false)
      }

      const ready = () => {
        // 歌曲已经有缓冲内容就不需要重复设置了
        if (songReady.value) return
        songReady.value = true
      }

      const error = () => {
        // 歌曲出错时如果 songReady 为 false，那么会卡在播放页面，无法切换歌曲和暂停或播放
        songReady.value = true
      }

      const prev = () => {
        const list = playlist.value

        // 播放歌曲还没有缓冲内容或播放歌曲列表为空时直接返回
        if (!songReady.value || !list.length) return

        // 如果列表只有一首歌，那么切歌就等于重新播放
        if (list.length === 1) {
          replay()
          return
        }

        let index = currentIndex.value - 1

        if (index < 0) index = list.length - 1

        store.commit('setCurrentIndex', index)
      }

      const next = () => {
        const list = playlist.value

        // 播放歌曲还没有缓冲内容或播放歌曲列表为空时直接返回
        if (!songReady.value || !list.length) return

        // 如果列表只有一首歌，那么切歌就等于重新播放
        if (list.length === 1) {
          replay()
          return
        }

        let index = currentIndex.value + 1

        if (index >= list.length) index = 0

        store.commit('setCurrentIndex', index)
      }

      // 重播歌曲
      function replay () {
        const audioEl = audioRef.value
        audioEl.currentTime = 0
        audioEl.play()
      }

      return {
        fullScreen,
        currentSong,
        playIcon,
        disableCls,
        audioRef,
        goBack,
        togglePlay,
        play,
        pause,
        ready,
        error,
        prev,
        next
      }
    }
  }
</script>

<style lang='scss' scoped>
  .player {
    .normal-player {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background: $color-background;

      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: .6;
        filter: blur(20px);

        img {
          width: 100%;
          height: 100%;
        }
      }

      .top {
        position: relative;
        margin-bottom: 25px;

        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;

          .icon-back {
            display: block;
            padding: 9px;
            font-size: $font-size-large-x;
            color: $color-theme;
            transform: rotate(-90deg);
          }
        }

        .title {
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          @include no-wrap();
          font-size: $font-size-large;
          color: $color-text;
        }

        .singer {
          line-height: 20px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text;
        }
      }

      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;

        .operators {
          display: flex;
          align-items: center;

          .icon {
            flex: 1;
            color: $color-theme;

            &.disable {
              color: $color-theme-d;
            }

            i {
              font-size: 30px;
            }
          }

          .i-left {
            text-align: right;
          }

          .i-center {
            padding: 0 20px;
            text-align: center;

            i {
              font-size: 40px;
            }
          }

          .i-right {
            text-align: left;

            .icon-favorite {
              color: $color-sub-theme;
            }
          }
        }
      }
    }
  }
</style>
