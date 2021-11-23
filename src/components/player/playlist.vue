<template>
  <teleport to="body">
    <transition name="list-fade">
      <div class="playlist" v-show="visible && playlist.length" @click="hide">
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <h1 class="title">
              <i class="icon" :class="modeIcon" @click.stop="changeMode"></i>
              <span class="text">{{ modeText }}</span>
              <span class="clear" @click="showClearConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
          </div>
          <com-scroll class="list-content" ref="scrollRef">
            <transition-group ref="ulRef" name="list" tag="ul">
              <li
                class="item"
                v-for="song in sequenceList" :key="song.id"
                @click="selectItemSong(song)"
              >
                <i class="current" :class="getCurrentIcon(song)"></i>
                <span class="text">{{ song.name }}</span>
                <span class="favorite" @click.stop="toggleFavorite(song)">
                  <i :class="getFavoriteIcon(song)"></i>
                </span>
                <span class="delete" :class="{ 'disable': removing }" @click.stop="removeSong(song)">
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
          </com-scroll>
          <div class="list-footer" @click.stop="hide">
            <span>关闭</span>
          </div>
        </div>
        <com-confirm
          ref="confirmRef"
          text="是否清空播放列表" confirm-btn-text="清空"
          @confirm="confirmClearPlaylist"
        ></com-confirm>
      </div>
    </transition>
  </teleport>
</template>

<script>
  import { ref, computed, watch, nextTick } from 'vue'
  import { useStore } from 'vuex'

  import Scroll from '@/components/base/scroll/scroll'
  import Confirm from '@/components/base/confirm/confirm'

  import useMode from './useMode'
  import useFavorite from './useFavorite'

  export default {
    name: 'playlist',
    components: {
      ComScroll: Scroll,
      ComConfirm: Confirm
    },
    setup () {
      const visible = ref(false)
      const removing = ref(false) // 是否正处于删除动画中

      const store = useStore()
      const playlist = computed(() => store.state.playlist)
      const sequenceList = computed(() => store.state.sequenceList)
      const currentSong = computed(() => store.getters.currentSong)

      watch(currentSong, async (newSong) => {
        // 如果 playlist 没有显示或切换的歌曲无效则什么也不做
        if (!visible.value || !newSong.id) return

        await nextTick()
        scrollToCurrent()
      })

      const { modeIcon, modeText, changeMode } = useMode()

      const { getFavoriteIcon, toggleFavorite } = useFavorite()

      const scrollRef = ref(null)
      const refreshScroll = () => {
        scrollRef.value.scroll.refresh()
      }

      const ulRef = ref(null)
      const scrollToCurrent = () => {
        const index = sequenceList.value.findIndex(song => song.id === currentSong.value.id)

        // 如果当前切换的歌曲不存在，可能已经被删了，那么直接返回
        if (index === -1) return

        const targetLi = ulRef.value.$el.children[index]

        scrollRef.value.scroll.scrollToElement(targetLi, 300)
      }

      const show = async () => {
        visible.value = true

        await nextTick()
        refreshScroll()
        scrollToCurrent()
      }
      const hide = () => {
        visible.value = false
      }

      const getCurrentIcon = song => song.id === currentSong.value.id ? 'icon-play' : ''

      const selectItemSong = targetSong => {
        const index = playlist.value.findIndex(song => song.id === targetSong.id)

        store.commit('setCurrentIndex', index)
      }

      const removeSong = song => {
        if (removing.value) return
        removing.value = true
        store.dispatch('removeSong', song)

        // 如果删除后歌曲列表为空，则隐藏 playlist 组件
        if (!playlist.value.length) hide()

        // 删除动画执行时间为 300ms，动画执行结束则恢复删除动画标识
        setTimeout(() => {
          removing.value = false
        }, 300)
      }

      const confirmRef = ref(null)
      const showClearConfirm = () => {
        if (confirmRef.value) confirmRef.value.show()
      }
      const confirmClearPlaylist = () => {
        store.dispatch('clearSongList')
        hide()
      }

      return {
        visible,
        removing,
        scrollRef,
        ulRef,
        confirmRef,
        playlist,
        sequenceList,
        show,
        hide,
        getCurrentIcon,
        selectItemSong,
        removeSong,
        showClearConfirm,
        confirmClearPlaylist,
        // mode
        modeIcon,
        modeText,
        changeMode,
        // favorite
        getFavoriteIcon,
        toggleFavorite
      }
    }
  }
</script>

<style lang='scss' scoped>
  .playlist {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: $color-background-d;

    &.list-fade-enter-active, &.list-fade-leave-active {
      transition: opacity .3s;
      .list-wrapper {
        transition: all .3s;
      }
    }
    &.list-fade-enter-from, &.list-fade-leave-to {
      opacity: 0;
      .list-wrapper {
        transform: translate3d(0, 100%, 0);
      }
    }

    .list-wrapper {
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 210;
      width: 100%;
      background-color: $color-highlight-background;

      .list-header {
        position: relative;
        padding: 20px 30px 10px 20px;

        .title {
          display: flex;
          align-items: center;

          .icon {
            margin-right: 10px;
            font-size: 24px;
            color: $color-theme-d;
          }

          .text {
            flex: 1;
            font-size: $font-size-medium;
            color: $color-text-l;
          }

          .clear {
            @include extend-click();
            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }

      .list-content {
        max-height: 240px;
        overflow: hidden;

        .item {
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 30px 0 20px;
          overflow: hidden;

          .current {
            flex: 0 0 20px;
            width: 20px;
            font-size: $font-size-small;
            color: $color-theme-d;
          }

          .text {
            flex: 1;
            @include no-wrap();
            font-size: $font-size-medium;
            color: $color-text-d;
          }

          .favorite {
            @include extend-click();
            margin-right: 15px;
            font-size: $font-size-small;
            color: $color-theme;
            .icon-favorite {
              color: $color-sub-theme;
            }
          }

          .delete {
            @include extend-click();
            font-size: $font-size-small;
            color: $color-theme;
            &.disable {
              color: $color-theme-d;
            }
          }
        }
      }

      .list-add {
        width: 140px;
        margin: 20px auto 30px auto;

        .add {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border: 1px solid $color-text-l;
          border-radius: 100px;
          color: $color-text-l;

          .icon-add {
            margin-right: 5px;
            font-size: $font-size-small-s;
          }

          .text {
            font-size: $font-size-small;
          }
        }
      }

      .list-footer {
        text-align: center;
        line-height: 50px;
        background: $color-background;
        font-size: $font-size-medium-x;
        color: $color-text-l;
      }
    }
  }
</style>
