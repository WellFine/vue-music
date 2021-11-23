import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

BScroll.use(Slide)

export default function useMiniSlider () {
  const sliderWrapperRef = ref(null)
  const slider = ref(null)

  const store = useStore()
  const fullScreen = computed(() => store.state.fullScreen)
  const playlist = computed(() => store.state.playlist)
  const currentIndex = computed(() => store.state.currentIndex)

  const isSliderShow = computed(() => !fullScreen.value && playlist.value.length > 0)

  /**
   * 在 mounted 时用 BScroll 初始化 sliderWrapperRef
   * 但是要注意 player.vue 使用 v-show="playlist.length" 控制，mini-player.vue 使用 v-show="!fullScreen" 控制
   * 所以需要在 playlist 有内容，fullScreen 为 false 时初始化，否则此时 player.vue 和 mini-player.vue 没有渲染，则获取不到 sliderWrapperRef DOM
   */
  onMounted(() => {
    let sliderVal

    watch(isSliderShow, async isShow => {
      if (isShow) {
        // isSliderShow 变为 true 代表 mini-player.vue 会渲染，可以获取 sliderWrapperRef DOM，但此时只是数据变化，渲染还没有完成，需要使用 nextTick 等待下一次 DOM 更新
        await nextTick()
        // BScroll 只需要初始化一次
        if (!sliderVal) {
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true
            }
          })

          // 滑动切换歌曲
          sliderVal.on('slidePageChanged', page => {
            store.commit('setCurrentIndex', page.pageX)
          })
        } else {
          // 让 BScroll 实例自动重新计算
          sliderVal.refresh()
        }

        // sliderWrapperRef 中根据 playlist 渲染了列表，然后这里根据 currentIndex 当前歌曲下标自动滚动到对应播放歌曲处
        sliderVal.goToPage(currentIndex.value, 0, 0)
      }
    })

    // 监听歌曲是否切换歌曲
    watch(currentIndex, newIndex => {
      // 当 BScroll 初始化了且 mini-player.vue 显示时
      if (sliderVal && isSliderShow.value) {
        sliderVal.goToPage(newIndex, 0, 0)
      }
    })

    // 在 playlist.vue 中删除歌曲改变 state.playlist 后，需要重新计算 mini-player.vue 的横向滚动 DOM，以防止删除歌曲还存在
    watch(playlist, async (newList) => {
      // newList.length 的判断是因为如果播放列表为空，那么 slider 的滑动 DOM 为空，此时调用 refresh 会报错
      if (sliderVal && isSliderShow.value && newList.length) {
        await nextTick()
        sliderVal.refresh()
      }
    })
  })

  onUnmounted(() => {
    // 如果有初始化 BScroll，那么销毁它
    if (slider.value) slider.value.destroy()
  })

  return {
    slider,
    sliderWrapperRef
  }
}
