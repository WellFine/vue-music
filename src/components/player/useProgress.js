import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default function useProgress (audioRef) {
  let isTouchAndChangeProgress = false
  const currentTime = ref(0)

  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  const progress = computed(() => currentTime.value / currentSong.value.duration)

  // updateTime 是 audio 标签的 timeupdate 事件处理函数
  const updateTime = e => {
    // 当触摸并拖动进度条时不处理时间变化
    if (!isTouchAndChangeProgress) {
      currentTime.value = Math.floor(e.target.currentTime)
    }
  }

  const onProgressChanging = progress => {
    isTouchAndChangeProgress = true
    currentTime.value = currentSong.value.duration * progress
  }

  const onProgressChanged = progress => {
    const audioEl = audioRef.value
    currentTime.value = currentSong.value.duration * progress
    audioEl.currentTime = currentTime.value
    audioEl.play()
    isTouchAndChangeProgress = false
  }

  return {
    currentTime,
    progress,
    updateTime,
    onProgressChanging,
    onProgressChanged
  }
}
