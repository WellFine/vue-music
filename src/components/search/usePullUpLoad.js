import { ref, onMounted, onUnmounted } from 'vue'

import BScroll from '@better-scroll/core'
import PullUp from '@better-scroll/pull-up'
import ObserveDOM from '@better-scroll/observe-dom'

// pull-up 实现上拉加载
BScroll.use(PullUp)
BScroll.use(ObserveDOM)

export default function usePullUpLoad (requestData, preventPullUpLoad) {
  const scroll = ref(null)
  const rootRef = ref(null)
  // 是否正在上拉加载中
  const isPullUpLoad = ref(false)

  onMounted(() => {
    const scrollVal = scroll.value = new BScroll(rootRef.value, {
      pullUpLoad: true, // 开启上拉加载
      observeDOM: true, // 实现自动刷新
      click: true
    })

    // BScroll 实例监听上拉加载动作，执行 pullingUpHandler 回调
    scrollVal.on('pullingUp', pullingUpHandler)

    async function pullingUpHandler () {
      if (preventPullUpLoad.value) {
        scrollVal.finishPullUp()
        return
      }

      // 开启上拉加载标志位，用于设置 loading 效果
      isPullUpLoad.value = true
      // 加载数据
      await requestData()
      // 数据加载完成后，结束上拉加载
      scrollVal.finishPullUp()
      scrollVal.refresh()
      isPullUpLoad.value = false
    }
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })

  return {
    scroll,
    rootRef,
    isPullUpLoad
  }
}
