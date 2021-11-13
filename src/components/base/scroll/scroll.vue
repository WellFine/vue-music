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
      }
    },
    setup (props) {
      const rootRef = ref(null)
      useScroll(rootRef, props)

      return {
        rootRef
      }
    }
  }
</script>

<style lang='scss' scoped>

</style>
