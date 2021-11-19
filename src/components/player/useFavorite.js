import { computed } from 'vue'
import { useStore } from 'vuex'
import { save, remove } from '@/assets/js/array-store'
import { FAVORITE_KEY } from '@/assets/js/constant'

export default function useFavorite () {
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList)
  const maxLen = 100 // 最多收藏多少条歌曲

  function toggleFavorite (song) {
    let list
    const compare = item => item.id === song.id

    if (_isFavorite(song)) {
      // 曾经是收藏的，现在取消
      list = remove(FAVORITE_KEY, compare)
    } else {
      list = save(song, FAVORITE_KEY, compare, maxLen)
    }

    store.commit('setFavoriteList', list)
  }

  function getFavoriteIcon (song) {
    return _isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  function _isFavorite (song) {
    return favoriteList.value.findIndex(item => item.id === song.id) >= 0
  }

  return {
    getFavoriteIcon,
    toggleFavorite
  }
}
