const mutations = {
  setPlayingState (state, playing) {
    state.playing = playing
  },
  setSequenceList (state, list) {
    state.sequenceList = list
  },
  setPlaylist (state, list) {
    state.playlist = list
  },
  setPlayMode (state, mode) {
    state.playMode = mode
  },
  setCurrentIndex (state, index) {
    state.currentIndex = index
  },
  setFullScreen (state, fullScreen) {
    state.fullScreen = fullScreen
  },
  setFavoriteList (state, list) {
    state.favoriteList = list
  },
  addSongLyric (state, { song, lyric }) {
    // sequenceList 和 playlist 中的对象是相同的引用，所以改 sequenceList 中的数据 playlist 中的也会变化
    state.sequenceList.map(item => {
      if (item.mid === song.mid) item.lyric = lyric
      return item
    })
  }
}

export default mutations
