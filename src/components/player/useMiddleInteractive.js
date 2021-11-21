import { ref } from 'vue'

export default function useMiddleInteractive () {
  const currentShow = ref('cd')
  const middleLeftStyle = ref(null)
  const middleRightStyle = ref(null)

  const touch = {}
  // currentView 和 currentShow 不同，触摸过程中还没松手但满足切换条件时 currentShow 就切换了，而 currentView 需要等到松手才切换
  let currentView = 'cd'

  function onMiddleTouchStart (e) {
    touch.startX = e.touches[0].pageX
    touch.startY = e.touches[0].pageY
    touch.directionLocked = ''
  }

  function onMiddleTouchMove (e) {
    // 手指滑动距离
    const deltaX = e.touches[0].pageX - touch.startX
    const deltaY = e.touches[0].pageY - touch.startY

    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    /**
     * 开始触摸时如果横向滑动距离大于纵向滑动距离，则视为横向滑动，设置横向锁，视为松手前只能横向滑动
     * 否则设置纵向锁，只能纵向滑动
     */
    if (!touch.directionLocked) touch.directionLocked = absDeltaX >= absDeltaY ? 'horizontal' : 'vertical'

    // 如果是纵向滑动，那么不执行后面切换 cd 层和歌词层逻辑
    if (touch.directionLocked === 'vertical') return

    /**
     * 如果当前视图层为 cd，那么就是向左滑动切换歌词层，此时 cd 层和歌词层中线距离屏幕右边界距离为 0
     * 如果当前视图层为歌词层，那么就是向右滑动切换 cd 层，此时 cd 层和歌词层中线距离屏幕右边界距离为屏幕宽度
     */
    const left = currentView === 'cd' ? 0 : -window.innerWidth
    // cd 层和歌词层中线距离屏幕右边界的宽度，限制在屏幕宽度负值到 0 之间
    const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
    // 中线距离屏幕右边界宽度与屏幕宽度的比例
    touch.percent = Math.abs(offsetWidth / window.innerWidth)

    if (currentView === 'cd') {
      // 如果在 cd 层向左滑动的距离，使中线超过了从屏幕右边界开始的五分之一处，就切换为歌词层
      if (touch.percent > 0.2) currentShow.value = 'lyric'
      else currentShow.value = 'cd'
    } else {
      // 如果在歌词层向右滑动的距离，使中线进入了从屏幕右边界开始的五分之四处，就切换为 cd 层
      if (touch.percent < 0.8) currentShow.value = 'cd'
      else currentShow.value = 'lyric'
    }

    middleLeftStyle.value = {
      opacity: 1 - touch.percent
    }
    middleRightStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`
    }
  }

  function onMiddleTouchEnd () {
    let offsetWidth
    let opacity

    if (currentShow.value === 'cd') {
      // 如果松手时显示的是 cd 层，那么 cd opacity 设为 1，歌词层偏移量设为 0
      offsetWidth = 0
      opacity = 1
    } else {
      // 如果松手时显示的是歌词层，那么 cd opacity 设为 0，歌词层偏移量设为屏幕宽度的负值，因为歌词层是从右向左滑动的
      offsetWidth = -window.innerWidth
      opacity = 0
    }

    currentView = currentShow.value

    const duration = '300ms'
    middleLeftStyle.value = {
      opacity,
      transitionDuration: duration
    }
    middleRightStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: duration
    }
  }

  return {
    currentShow,
    middleLeftStyle,
    middleRightStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd
  }
}
