import { ref, computed, watch, nextTick } from 'vue'

export default function useFixed (props) {
  const groupRef = ref(null)
  const heightList = ref([]) // 歌手列表的高度区间
  const scrollY = ref(0) // 滚动高度，滚动时改变
  const currentIndex = ref(0) // 当前滚动高度所处歌手列表的区间下标
  const distance = ref(0) // 当前歌手列表区间底部距离滑动列表顶部的距离，如果距离小于列表 title 高度，实现把 fixed 的 title 顶上去的效果
  const TITLE_HEIGHT = 30 // 列表 title 高度

  // 但 currentIndex 歌手列表区间下标发生变化时，顶部显示的区间文字发生相应变化
  const fixedTitle = computed(() => {
    // 当 scrollY 的值小于 0 时，就是最顶部下拉时，这时设置 fixedTitle 为空，外面判断为空不显示
    if (scrollY.value < 0) return ''

    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })

  const fixedStyle = computed(() => {
    const distanceVal = distance.value

    // 当前歌手列表底部顶到 fixed title 时，fixed title 向上 translate
    const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT) ? distanceVal - TITLE_HEIGHT : 0

    return {
      transform: `translate(0, ${diff}px)`
    }
  })

  // 当 index-list 的 props.data 发生变化时，重新计算 list 的高度
  // watch 可以直接监听一个 ref，也可以监听一个 getter
  // props.data 不是 ref，所以使用 getter 函数返回
  watch(() => props.data, async () => {
    // 观测到数据变化后，在回调函数内部 DOM 是还没有发生变化的
    // DOM 的变化是在 nextTick() 之后，所以这里 await nextTick() 确保在 DOM 发生变化后再重新计算高度
    await nextTick()
    calculate()
  })

  function calculate () {
    const list = groupRef.value.children
    const heightListVal = heightList.value
    let height = 0

    // 每次计算时都先清空数组
    heightListVal.length = 0
    heightListVal.push(height)

    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
      heightListVal.push(height)
    }
  }

  // scrollY 在滚动时更新，监听它然后判断落在 heightList 的哪个区间内
  watch(scrollY, newY => {
    const heightListVal = heightList.value

    for (let i = 0; i < heightListVal.length - 1; i++) {
      const heightTop = heightListVal[i]
      const heightBottom = heightListVal[i + 1]

      if (newY >= heightTop && newY < heightBottom) {
        currentIndex.value = i
        distance.value = heightBottom - newY
        break
      }
    }
  })

  // scroll 组件 emit 的滚动事件，可以获取列表最新高度
  // 每次高度发生变化都会修改 scrollY 的值
  function onScroll (position) {
    // BetterScroll 内是向下滑动，y 递减，所以这里用 -y
    scrollY.value = -position.y
  }

  return {
    groupRef,
    onScroll,
    fixedTitle,
    fixedStyle,
    currentIndex
  }
}
