import { PLAY_MODE, FAVORITE_KEY, SEARCH_KEY } from '@/assets/js/constant'
import { load } from '@/assets/js/array-store'

const state = {
  sequenceList: [], // 顺序的播放列表，作为歌曲列表的原始数据
  playlist: [], // 真实的播放列表，随着播放模式不同而改变原始顺序列表得来
  playing: false, // 播放状态
  playMode: PLAY_MODE.sequence, // 播放模式，顺序，循环，随机，默认顺序
  currentIndex: 0, // 当前播放歌曲索引
  fullScreen: false, // 播放器的状态，是全屏还是收缩，默认收缩
  favoriteList: load(FAVORITE_KEY), // 歌曲收藏列表，与本地缓存相结合使用
  searchHistory: load(SEARCH_KEY)
}

export default state
