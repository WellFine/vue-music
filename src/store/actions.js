import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'

// 选择歌曲进行播放
export function selectPlay ({ commit }, { list, index }) {
  commit('setPlayMode', PLAY_MODE.sequence) // 设置播放模式为顺序播放
  commit('setSequenceList', list) // 设置原始播放列表
  commit('setPlaylist', list) // 设置真实播放列表，顺序播放和原始播放列表是一样的
  commit('setPlayingState', true) // 开始播放
  commit('setFullScreen', true) // 展开播放器
  commit('setCurrentIndex', index) // 设置播放歌曲索引
}

export function randomPlay ({ commit }, list) {
  commit('setPlayMode', PLAY_MODE.random) // 设置播放模式为随机播放
  commit('setSequenceList', list) // 设置原始播放列表
  commit('setPlaylist', shuffle(list)) // 设置真实播放列表，随机播放将原始播放列表用洗牌算法打乱
  commit('setPlayingState', true) // 开始播放
  commit('setFullScreen', true) // 展开播放器
  commit('setCurrentIndex', 0) // 播放随机列表第一首歌
}

export function changeMode ({ state, getters, commit }, mode) {
  const currentSongId = getters.currentSong.id

  if (mode === PLAY_MODE.random) {
    // 如果切换为随机播放，则将原始顺序播放列表打乱
    commit('setPlaylist', shuffle(state.sequenceList))
  } else {
    // 如果切换为顺序和循环播放，则播放原始播放列表
    commit('setPlaylist', state.sequenceList)
  }

  /**
   * 随机播放把列表打乱后，currentSong 当前播放歌曲因为 getters 中列表变化而索引没变，会导致 currentSong 大概率会变化
   * 在打乱后的列表中找到正在播放的歌曲下标，然后重新设置 currentIndex
   */
  const index = state.playlist.findIndex(song => song.id === currentSongId)
  commit('setCurrentIndex', index)
  commit('setPlayMode', mode)
}

export function removeSong ({ state, commit }, targetSong) {
  const sequenceList = state.sequenceList.slice()
  const playlist = state.playlist.slice()

  const sIndex = sequenceList.findIndex(song => song.id === targetSong.id)
  const pIndex = playlist.findIndex(song => song.id === targetSong.id)

  // 当歌曲不存在时直接返回
  if (sIndex < 0 || pIndex < 0) return

  sequenceList.splice(sIndex, 1)
  playlist.splice(pIndex, 1)

  let currentIndex = state.currentIndex
  // 如果删除的歌曲在正在播放歌曲前面或删除的是最后一首歌，那么 currentIndex 也要对应减一
  if (pIndex < currentIndex || currentIndex === playlist.length) currentIndex--

  commit('setSequenceList', sequenceList)
  commit('setPlaylist', playlist)
  commit('setCurrentIndex', currentIndex)

  if (!playlist.length) {
    commit('setPlayingState', false)
  }
}

export function clearSongList ({ commit }) {
  commit('setPlayingState', false)
  commit('setSequenceList', [])
  commit('setPlaylist', [])
  commit('setCurrentIndex', 0)
}

export function addSong ({ state, commit }, song) {
  const playlist = state.playlist.slice()
  const sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  const playIndex = playlist.findIndex(item => item.id === song.id)
  if (playIndex >= 0) {
    // playlist 中已经包含 song 这首歌曲，那么直接修改当前播放下标 currentIndex 即可
    currentIndex = playIndex
  } else {
    // playlist 中没有 song 这首歌，那么加入 playlist 末尾，修改播放下标至 song 下标
    playlist.push(song)
    currentIndex = playlist.length - 1
  }

  const sequenceIndex = sequenceList.findIndex(item => item.id === song.id)
  if (sequenceIndex === -1) sequenceList.push(song)

  commit('setSequenceList', sequenceList)
  commit('setPlaylist', playlist)
  commit('setCurrentIndex', currentIndex)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
}
