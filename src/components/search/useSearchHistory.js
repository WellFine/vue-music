import { useStore } from 'vuex'
import { save } from '@/assets/js/array-store'
import { SEARCH_KEY } from '@/assets/js/constant'

export default function useSearchHistory () {
  const maxLen = 100 // 最多保留 100 条历史记录
  const store = useStore()

  function saveSearch (query) {
    const searches = save(query, SEARCH_KEY, item => item === query, maxLen)
    store.commit('setSearchHistory', searches)
  }

  return {
    saveSearch
  }
}
