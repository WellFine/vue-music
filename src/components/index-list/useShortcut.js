import { ref, computed } from 'vue'

export default function useShortcut (props, groupRef) {
  const ANCHOR_HEIGHT = 20 // 侧边每个锚点高度
  const scrollRef = ref(null)

  // 侧边栏锚点文字列表
  const shortcutList = computed(() => {
    return props.data.map(item => item.title)
  })

  // 触摸位置高度、下标，移动位置高度
  const touch = {}

  // 开始触摸
  function onShortcutTouchStart (e) {
    // 触摸事件是委托在锚点列表父元素上的，靠触摸锚点冒泡触发
    // e.target 获取触摸的锚点元素，获取锚点元素的 data-index
    const anchorIndex = parseInt(e.target.dataset.index)

    // 将触摸起点的锚点元素高度和下标存起来
    touch.y1 = e.touches[0].pageY
    touch.anchorIndex = anchorIndex

    // BetterScroll 移动到下标对应的 DOM 元素
    scrollTo(anchorIndex)
  }

  // 触摸移动
  function onShortcutTouchMove (e) {
    touch.y2 = e.touches[0].pageY
    // 用触摸终点和触摸起点高度差除以锚点高度获取下标差
    // | 0 或 0 就是 Math.floor() 的简略写法
    const indexDiff = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
    // 触摸起点下标加上下标差获取新下标
    const anchorIndex = touch.anchorIndex + indexDiff

    // BetterScroll 移动到下标对应的 DOM 元素
    scrollTo(anchorIndex)
  }

  function scrollTo (index) {
    // 因为触摸事件是委托到锚点列表父元素的, 所以触摸锚点列表外的地方获取不到 data-index, index 经过 parseInt(undefined) 为 NaN
    if (isNaN(index)) return
    // 触摸移动过程中如果移动到锚点列表外部, index 会因为起点终点高度差太大而太大, 这里限制 index 在 0 到锚点列表长度之间
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const targetDOM = groupRef.value.children[index]
    const betterScroll = scrollRef.value.scroll
    betterScroll.scrollToElement(targetDOM, 0)
  }

  return {
    scrollRef,
    shortcutList,
    onShortcutTouchStart,
    onShortcutTouchMove
  }
}
