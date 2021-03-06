<template>
  <div class="player" v-show="playlist.length">
    <transition
      name="normal"
      @enter="enter" @after-enter="afterEnter"
      @leave="leave" @after-leave="afterLeave"
    >
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
          <div
            class="middle"
            @touchstart.prevent="onMiddleTouchStart"
            @touchmove.prevent="onMiddleTouchMove"
            @touchend.prevent="onMiddleTouchEnd"
          >
            <div class="middle-l" :style="middleLeftStyle">
              <div class="cd-wrapper" ref="cdWrapperRef">
                <div class="cd" ref="cdRef">
                  <img
                    :src="currentSong.pic" class="image" :class="rotateClass"
                    ref="cdImageRef"
                  />
                </div>
              </div>
              <div class="playing-lyric-wrapper">
                <div class="playing-lyric">{{ playingLyric }}</div>
              </div>
            </div>
            <com-scroll
              class="middle-r" :style="middleRightStyle"
              ref="lyricScrollRef"
            >
              <div class="lyric-wrapper">
                <div v-if="currentLyric" ref="lyricListRef">
                  <p
                    class="text" :class="{ 'current': currentLineNum === index }"
                    v-for="(line, index) in currentLyric.lines" :key="line.num"
                  >{{ line.txt }}</p>
                </div>
                <div class="pure-music" v-show="pureMusicLyric">
                  <p>{{ pureMusicLyric }}</p>
                </div>
              </div>
            </com-scroll>
          </div>
          <div class="bottom">
            <div class="dot-wrapper">
              <span class="dot" :class="{ 'active': currentShow === 'cd' }"></span>
              <span class="dot" :class="{ 'active': currentShow === 'lyric' }"></span>
            </div>
            <div class="progress-wrapper">
              <span class="time time-left">{{ formatTime(currentTime) }}</span>
              <div class="progress-bar-wrapper">
                <progress-bar
                  :progress="progress"
                  @progress-changing="onProgressChanging"
                  @progress-changed="onProgressChanged"
                />
              </div>
              <span class="time time-right">{{ formatTime(currentSong.duration) }}</span>
            </div>
            <div class="operators">
              <div class="icon i-left">
                <i :class="modeIcon" @click="changeMode"></i>
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
                <i :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
              </div>
            </div>
          </div>
        </template>
      </div>
    </transition>
    <mini-player :progress="progress" :togglePlay="togglePlay"></mini-player>
    <!--
      当音乐暂停播放、播放完毕、设备待机或睡眠时，会触发 audio 标签的 pause 事件，此时需要更改播放状态以避免数据状态不一致
      音乐是流式加载的，每加载一段内容就会缓冲下来，只有当有缓冲内容时才会播放音乐，缓冲内容更新会触发 canplay 事件
      歌曲播放有问题时会触发 error 事件
      timeupdate 歌曲播放时长变化时触发
    -->
    <audio
      ref="audioRef"
      @play="play"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="ended"
    ></audio>
  </div>
</template>

<script>
  import { ref, computed, watch } from 'vue'
  import { useStore } from 'vuex'

  import { formatTime } from '@/assets/js/util'

  import useBasePlay from './useBasePlay'
  import useMode from './useMode'
  import useFavorite from './useFavorite'
  import useProgress from './useProgress'
  import useCD from './useCD'
  import useLyric from './useLyric'
  import useMiddleInteractive from './useMiddleInteractive'
  import useAnimation from './useAnimation'

  import ProgressBar from './progress-bar'
  import MiniPlayer from './mini-player'
  import Scroll from '@/components/base/scroll/scroll'

  export default {
    name: 'player',
    components: {
      ProgressBar,
      ComScroll: Scroll,
      MiniPlayer
    },
    setup () {
      const audioRef = ref(null)
      const lyricFn = ref(null)

      const {
        fullScreen,
        songReady,
        playlist,
        playIcon,
        disableCls,
        goBack,
        togglePlay,
        play,
        pause,
        ready,
        error,
        ended,
        prev,
        next
      } = useBasePlay(audioRef, lyricFn)

      const { modeIcon, changeMode } = useMode()

      const { getFavoriteIcon, toggleFavorite } = useFavorite()

      const { currentTime, progress, updateTime, onProgressChanging, onProgressChanged } = useProgress(audioRef, lyricFn)

      const { rotateClass, cdRef, cdImageRef } = useCD()

      const { lyricScrollRef, lyricListRef, currentLyric, currentLineNum, pureMusicLyric, playingLyric, playLyric, stopLyric } = useLyric(songReady, currentTime)

      const { currentShow, middleLeftStyle, middleRightStyle, onMiddleTouchStart, onMiddleTouchMove, onMiddleTouchEnd } = useMiddleInteractive()

      const { cdWrapperRef, enter, afterEnter, leave, afterLeave } = useAnimation()

      // 将播放歌词函数存在临时函数中，用于 useBasePlay() 中歌曲 ready 时播放歌词
      lyricFn.value = { playLyric, stopLyric }

      const store = useStore()
      const currentSong = computed(() => store.getters.currentSong)

      watch(currentSong, song => {
        if (!song.id || !song.url) return

        // 切换歌曲时将当前播放时长置为 0，且重置缓冲标志
        currentTime.value = 0 // 其实 audio 提供的 timeupdate 事件中，刚开始播放时长就是 0，而 updateTime 处理事件中已经设置了 currentTime
        songReady.value = false

        const audioEl = audioRef.value
        audioEl.src = song.url // 设置音频链接
        audioEl.play() // 播放
      })

      return {
        audioRef,
        currentSong,
        // util 工具函数
        formatTime,
        // base play 基础播放功能
        fullScreen,
        playlist,
        playIcon,
        disableCls,
        goBack,
        togglePlay,
        play,
        pause,
        ready,
        error,
        ended,
        prev,
        next,
        // mode 播放模式
        modeIcon,
        changeMode,
        // favorite 收藏歌曲
        getFavoriteIcon,
        toggleFavorite,
        // progress 进度条
        currentTime,
        progress,
        updateTime,
        onProgressChanging,
        onProgressChanged,
        // cd 唱片
        rotateClass,
        cdRef,
        cdImageRef,
        // lyric 歌词
        lyricScrollRef,
        lyricListRef,
        currentLyric,
        currentLineNum,
        pureMusicLyric,
        playingLyric,
        // cd 与歌词交互
        currentShow,
        middleLeftStyle,
        middleRightStyle,
        onMiddleTouchStart,
        onMiddleTouchMove,
        onMiddleTouchEnd,
        // player cd 与 mini cd 过渡 animation
        cdWrapperRef,
        enter,
        afterEnter,
        leave,
        afterLeave
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

      .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;

        .middle-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;

          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            height: 100%;

            .cd {
              width: 100%;
              height: 100%;
              border-radius: 50%;

              img {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                border: 10px solid rgba(255, 255, 255, .1);
                box-sizing: border-box;
              }

              .playing {
                animation: rotate 20s linear infinite;
                animation-fill-mode: forwards;
              }
            }
          }

          .playing-lyric-wrapper {
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric {
              height: 20px;
              line-height: 20px;
              font-size: $font-size-medium;
              color: $color-text-l;
            }
          }
        }

        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text {
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
              &.current {
                color: $color-theme;
              }
            }
            .pure-music {
              padding-top: 50%;
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
            }
          }
        }
      }

      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;

        .dot-wrapper {
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;
            &.active {
              width: 20px;
              border-radius: 5px;
              background: $color-text-ll;
            }
          }
        }

        .progress-wrapper {
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0px auto;
          padding: 10px 0;
          .time {
            color: $color-text;
            font-size: $font-size-small;
            flex: 0 0 40px;
            line-height: 30px;
            width: 40px;
            &.time-left {
              text-align: left;
            }
            &.time-right {
              text-align: right;
            }
          }
          .progress-bar-wrapper {
            flex: 1;
          }
        }

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

      &.normal-enter-active, &.normal-leave-active {
        transition: all .6s;
        .top, .bottom {
          transition: all .6s cubic-bezier(.45, 0, .55, 1);
        }
      }
      &.normal-enter-from, &.normal-leave-to {
        opacity: 0;
        .top {
          transform: translate3d(0, -100px, 0);
        }
        .bottom {
          transform: translate3d(0, 100px, 0);
        }
      }
    }
  }
</style>
