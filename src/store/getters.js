// 根据播放列表和歌曲下标计算出当前播放歌曲
export const currentSong = state => state.playlist[state.currentIndex]
