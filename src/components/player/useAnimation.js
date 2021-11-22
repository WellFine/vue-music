import { ref } from 'vue'
import animations from 'create-keyframe-animation'

// useAnimation 主要负责 player.vue 缩放到 mini-player.vue 时，player.vue 的 cd 向斜左下方 mini-player.vue 的小 cd 移动效果
export default function useAnimation () {
  const cdWrapperRef = ref(null)
  // 动画执行标志位
  let entering = false
  let leaving = false

  // el 就是 transition 包裹的 DOM，done 用于告知 vue 动画什么时候结束，执行 done 才能进入下一个钩子函数 afterEnter
  const enter = (el, done) => {
    // 执行 enter 动画时，如果 leave 动画正在执行，那么手动调用 afterLeave 让动画正常结束
    if (leaving) afterLeave()

    entering = true
    const { x, y, scale } = getPosAndScale()

    const animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      },
      100: {
        transform: 'translate3d(0, 0, 0) scale(1)'
      }
    }

    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 600, // 动画持续时间 600ms
        easing: 'cubic-bezier(.45, 0, .55, 1)'
      }
    })

    // 在 cdWrapperRef 上运行上面注册的 move animation，动画运行完成就执行 done 回调进入 afterEnter 钩子
    animations.runAnimation(cdWrapperRef.value, 'move', done)
  }

  const afterEnter = () => {
    // 卸载 move animation，并清空 after 中设置的 cdWrapperRef animation
    animations.unregisterAnimation('move')
    cdWrapperRef.value.animation = ''
    entering = false
  }

  const leave = (el, done) => {
    // 执行 leave 动画时，如果 enter 动画正在执行，那么手动调用 afterEnter 让动画正常结束
    if (entering) afterEnter()

    leaving = true
    const { x, y, scale } = getPosAndScale()
    const cdWrapperEl = cdWrapperRef.value

    cdWrapperEl.style.transition = 'all .6s cubic-bezier(.45, 0, .55, 1)'
    cdWrapperEl.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`

    // transition 过渡完毕，执行 done 解绑 transitionend 事件
    const next = () => {
      cdWrapperEl.removeEventListener('transitionend', next)
      done()
    }
    cdWrapperEl.addEventListener('transitionend', next)
  }

  const afterLeave = () => {
    const cdWrapperEl = cdWrapperRef.value
    cdWrapperEl.style.transition = ''
    cdWrapperEl.style.transform = ''
    leaving = false
  }

  function getPosAndScale () {
    const targetWidth = 40 // mini cd 的宽度
    const paddingLeft = 35 // mini cd 圆心距离屏幕左边界的距离
    const paddingBottom = 30 // mini cd 圆心距离屏幕底部的距离
    const paddingTop = 80 // player cd 距离屏幕顶部的距离
    const width = window.innerWidth * 0.8 // player cd 的宽度，css 为 width: 80%;
    const x = -(window.innerWidth / 2 - paddingLeft) // player cd 圆心偏移到 mini cd 的横坐标距离，因为向左偏移所以是负值
    const y = window.innerHeight - paddingBottom - (width / 2 + paddingTop) // player cd 圆心偏移到 mini cd 的纵坐标距离
    const scale = targetWidth / width

    return {
      x,
      y,
      scale
    }
  }

  return {
    cdWrapperRef,
    enter,
    afterEnter,
    leave,
    afterLeave
  }
}
