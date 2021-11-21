import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default function useProgress (audioRef, lyricFnRef) {
  let isTouchAndChangeProgress = false
  const currentTime = ref(0)

  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  const progress = computed(() => currentTime.value / (currentSong.value ? currentSong.value.duration : 0))

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
    const lyricFn = lyricFnRef.value
    // 拖动进度条过程中 currentTime 变化,调用 playLyric 会将歌词同步到当前歌曲 currentTime 处
    lyricFn.playLyric()
    // 同步过后暂停歌词播放
    lyricFn.stopLyric()
  }

  const onProgressChanged = progress => {
    const audioEl = audioRef.value
    currentTime.value = currentSong.value.duration * progress
    audioEl.currentTime = currentTime.value
    audioEl.play()
    isTouchAndChangeProgress = false
    // 拖动进度条松手后同步歌词并播放
    lyricFnRef.value.playLyric()
  }

  return {
    currentTime,
    progress,
    updateTime,
    onProgressChanging,
    onProgressChanged
  }
}
