import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'

export default function useCD () {
  const store = useStore()
  const playingState = computed(() => store.state.playing)

  const rotateClass = computed(() => playingState.value ? 'playing' : '')

  const cdRef = ref(null)
  const cdImageRef = ref(null)

  watch(playingState, newPlayingState => {
    if (!newPlayingState) {
      _syncTransform(cdRef.value, cdImageRef.value)
    }
  })

  function _syncTransform (wrapper, inner) {
    const wrapperTransform = getComputedStyle(wrapper).transform
    const innerTransform = getComputedStyle(inner).transform
    /**
     * 如果外层还没有 transform，就是第一次暂停，此时内层相对于外层 0° 进行偏移
     * 但如果外层已经有了 transform，就是第二次及之后暂停，此时内层相对一外层偏移的角度进行偏移，所以需要在内层偏移量基础上加上外层的偏移量
     */
    wrapper.style.transform = wrapperTransform === 'none' ? innerTransform : innerTransform.concat(' ', wrapperTransform)
  }

  return {
    rotateClass,
    cdRef,
    cdImageRef
  }
}
