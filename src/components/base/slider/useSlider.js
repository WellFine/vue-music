import { ref, onMounted, onUnmounted } from 'vue'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

// 注册 Slide 轮播图插件
BScroll.use(Slide)

export default function useSlider (wrapperRef) {
  const slider = ref(null)
  const currentPageIndex = ref(0)

  onMounted(() => {
    slider.value = new BScroll(wrapperRef.value, {
      click: true, // BetterScroll 默认会阻止浏览器的原生 click 事件
      scrollX: true, // 开启横向滚动
      scrollY: false, // 默认开启纵向滚动，这里关闭
      momentum: false, // 关闭快速滑动时生成的滚动动画
      bounce: false, // 关闭滚动回弹动画
      probeType: 2, // 当手指按在滚动区域上，一直派发 scroll 事件
      slide: true // 开启轮播图
    })

    // slideWillChange 在 slide 的 currentPage 值将要改变时触发
    slider.value.on('slideWillChange', page => {
      currentPageIndex.value = page.pageX
    })

    // v2.1.0 后 slidePageChanged 在 slide 切换 page 之后触发
    // slider.value.on('slidePageChanged', page => {
    //   currentPageIndex.value = page
    // })
  })

  onUnmounted(() => {
    slider.value.destroy()
  })

  return {
    slider,
    currentPageIndex
  }
}
