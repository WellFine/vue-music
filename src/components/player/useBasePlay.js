import { computed, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { PLAY_MODE } from '@/assets/js/constant'

export default function useBasePlay (audioRef, lyricFnRef) {
  // songReady 是歌曲缓冲标识，为 false 时将无法上下切换歌曲，也无法暂停或播放歌曲
  const songReady = ref(false)

  const store = useStore()

  const fullScreen = computed(() => store.state.fullScreen)
  const playMode = computed(() => store.state.playMode)
  const playing = computed(() => store.state.playing)
  const playIcon = computed(() => playing.value ? 'icon-pause' : 'icon-play')

  const currentIndex = computed(() => store.state.currentIndex)
  const playlist = computed(() => store.state.playlist)

  const disableCls = computed(() => songReady.value ? '' : 'disable')

  watch(playing, bool => {
    // 歌曲还没有缓冲内容时暂时不播放
    if (!songReady.value) return

    if (bool) {
      audioRef.value.play()
      lyricFnRef.value.playLyric()
    } else {
      audioRef.value.pause()
      lyricFnRef.value.stopLyric()
    }
  })

  const goBack = () => {
    store.commit('setFullScreen', false)
  }

  const togglePlay = () => {
    // 如果歌曲还没有加载好，那么直接返回
    if (!songReady.value) return
    store.commit('setPlayingState', !playing.value)
  }

  const play = () => {
    store.commit('setPlayingState', true)
  }

  const pause = () => {
    // 当 audio 触发了 pause 事件时，需要进行数据状态的统一
    store.commit('setPlayingState', false)
  }

  const ready = () => {
    // 歌曲已经有缓冲内容就不需要重复设置了
    if (songReady.value) return
    songReady.value = true
    // 歌曲缓冲后播放歌词
    lyricFnRef.value.playLyric()
  }

  const error = () => {
    // 歌曲出错时如果 songReady 为 false，那么会卡在播放页面，无法切换歌曲和暂停或播放
    songReady.value = true
  }

  const ended = () => {
    // 播放模式为循环播放则重新播放当前歌曲
    if (playMode.value === PLAY_MODE.loop) {
      replay()
    } else {
      next()
    }
  }

  const prev = () => {
    const list = playlist.value

    // 播放歌曲还没有缓冲内容或播放歌曲列表为空时直接返回
    if (!songReady.value || !list.length) return

    // 如果列表只有一首歌，那么切歌就等于重新播放
    if (list.length === 1) {
      replay()
      return
    }

    let index = currentIndex.value - 1

    if (index < 0) index = list.length - 1

    store.commit('setCurrentIndex', index)
  }

  const next = () => {
    const list = playlist.value

    // 播放歌曲还没有缓冲内容或播放歌曲列表为空时直接返回
    if (!songReady.value || !list.length) return

    // 如果列表只有一首歌，那么切歌就等于重新播放
    if (list.length === 1) {
      replay()
      return
    }

    let index = currentIndex.value + 1

    if (index >= list.length) index = 0

    store.commit('setCurrentIndex', index)
  }

  // 重播歌曲
  function replay () {
    const audioEl = audioRef.value
    audioEl.currentTime = 0
    audioEl.play()
  }

  return {
    fullScreen,
    songReady,
    playIcon,
    disableCls,
    goBack,
    togglePlay,
    play,
    pause,
    ready,
    error,
    ended,
    prev,
    next
  }
}
