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
