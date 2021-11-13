import { ref, onMounted, onUnmounted } from 'vue'
import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'

// 使用插件
BScroll.use(ObserveDOM)

export default function useScroll (wrapperRef, options) {
  const scroll = ref(null)

  onMounted(() => {
    // BetterScroll 判断能否滚动（内容高度是否大于容器高度）是在初始化 BScroll 时，而在初始化时是还没有内容的，所以无法滚动
    // 引入 observe-dom 使 BScroll 自动探测 DOM 变化，实现 refresh 自动刷新
    scroll.value = new BScroll(wrapperRef.value, {
      ...options,
      observeDOM: true
    })
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })

  return {
    scroll
  }
}
