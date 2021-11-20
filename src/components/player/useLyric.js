import { computed, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { getLyric } from '@/service/song'
import Lyric from 'lyric-parser'

export default function useLyric (songReady, currentTime) {
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)
  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  const pureMusicLyric = ref('')
  const playingLyric = ref('')

  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  watch(currentSong, async newSong => {
    // 如果是没有播放链接或 mid 的无效歌曲直接返回，如果已经有歌词了也直接返回
    if (!newSong.url || !newSong.mid) return

    // 歌曲切换时需要将歌词相关状态清空，以免上一首歌曲的歌词影响到当前歌曲歌词
    stopLyric()
    currentLyric.value = null
    currentLineNum.value = 0
    pureMusicLyric.value = ''
    playingLyric.value = ''

    const lyric = await getLyric(newSong)
    // 因为当前歌曲是 vuex 中播放列表的数据，所以无法直接设置 newSong.lyric，需要通过提交 mutation
    store.commit('addSongLyric', {
      song: newSong,
      lyric
    })

    /**
     * 因为 lyric 歌词的获取是异步的，如果还没获取出来就切换到下一首歌了，这种情况下就不需要执行下面的逻辑了
     * 否则当切换到下一首时歌曲的歌词先获取出来，然后上一首旧歌曲的歌词后获取出来，此时上一首旧歌曲歌词会顶掉下一首新歌曲的歌词，因为 currentLyric 是全局的
     */
    if (currentSong.value.lyric !== lyric) return

    // new Lyric 会返回一个歌词实例，_handleLyric 回调函数在一行歌词播放完成后触发
    currentLyric.value = new Lyric(lyric, _handleLyric)

    // 判断是否为纯音乐
    const isHasLyric = currentLyric.value.lines.length
    if (isHasLyric) {
      // 歌曲缓冲的过程也是一种异步过程，需要等待歌曲缓冲后，可以播放了再同步播放歌词
      if (songReady.value) {
        playLyric()
      }
    } else {
      playingLyric.value = pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
    }
  })

  // 播放歌词
  function playLyric () {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      // seek 寻找当前播放时间的歌词
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  // 暂停歌词的播放
  function stopLyric () {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      // stop 停止歌词播放
      currentLyricVal.stop()
    }
  }

  // _handleLyric 回调函数在一行歌词开始播放时触发，lineNum 是当前歌词的行号，txt 是当前歌词的文字
  function _handleLyric ({ lineNum, txt }) {
    currentLineNum.value = lineNum
    playingLyric.value = txt

    const lyricScrollComp = lyricScrollRef.value
    const lyricListEl = lyricListRef.value

    // 如果没有歌词，直接返回
    if (!lyricListEl) return

    if (lineNum > 5) {
      const lineEl = lyricListEl.children[lineNum - 5]
      lyricScrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      lyricScrollComp.scroll.scrollToElement(0, 0, 1000)
    }
  }

  return {
    lyricScrollRef,
    lyricListRef,
    currentLyric,
    currentLineNum,
    pureMusicLyric,
    playingLyric,
    playLyric,
    stopLyric
  }
}
