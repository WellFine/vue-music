import { h, mergeProps, withCtx, renderSlot, ref, computed, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import Scroll from '@/components/base/scroll/scroll'

// 高阶 Scroll 组件，可以用 https://vue-next-template-explorer.netlify.app 这个网站在线将 template 转换为 render 函数
// 以下就是借助网站转换后的 render 实现的
export default {
  name: 'wrap-scroll',
  props: Scroll.props,
  emits: Scroll.emits,
  render (ctx) {
    // mergeProps 合并 props，将组件 props 和要派发的 scroll 事件合并在一起
    const props = mergeProps({
      ref: 'scrollRef'
    }, ctx.$props, {
      onScroll: e => ctx.$emit('scroll', e)
    })

    const slot = {
      // withCtx 保证执行上下文也就是 this 的正确，renderSlot 渲染一个 default 的 slot
      default: withCtx(() => renderSlot(ctx.$slots, 'default'))
    }

    return h(Scroll, props, slot)
  },
  setup () {
    const scrollRef = ref(null)
    // 不直接在 return 的对象中写 scroll: scrollRef.value.scroll 是因为 setup 执行时组件还没有挂载，此时 scrollRef 为 null，拿不到 scroll 值，所以用 computed 包裹
    const scroll = computed(() => scrollRef.value.scroll)

    const store = useStore()
    const playlist = computed(() => store.state.playlist)

    watch(playlist, async () => {
      await nextTick()
      scroll.value.refresh()
    })

    return {
      scrollRef,
      scroll
    }
  }
}
