<template>
  <div ref="rootRef">
    <!-- BetterScroll 只针对第一个子元素生效，所以套一层 div -->
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import { ref } from 'vue'
  import useScroll from './useScroll'

  export default {
    name: 'Scroll',
    props: {
      click: {
        type: Boolean,
        default: true
      },
      probeType: {
        type: Number,
        default: 0
      }
    },
    emits: ['scroll'],
    setup (props, { emit }) {
      const rootRef = ref(null)
      useScroll(rootRef, props, emit)

      return {
        rootRef
      }
    }
  }
</script>

<style lang='scss' scoped>

</style>
