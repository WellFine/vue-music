<template>
  <div class="search">
    <div class="search-input-wrapper">
      <!--
        search-input 内部提供 query 供外部使用，debounce 等操作都由 search-input 内部完成
        外部使用时只需要监听 query 变化即可
      -->
      <search-input v-model="query"></search-input>
    </div>
    <div class="search-content" v-show="!query">
      <div class="hot-keys">
        <h1 class="title">热门搜索</h1>
        <ul>
          <li
            class="item"
            v-for="key in hotKeys" :key="key.id"
            @click="addQuery(key.key)"
          >
            <span>{{ key.key }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="search-history">
      <h1 class="title">
        <span class="text">搜索历史</span>
      </h1>
      <search-list :searches="searchHistory"></search-list>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query" @select-singer="selectSinger" @select-song="selectSong"></suggest>
    </div>

    <!-- router-view 内嵌套 transition，transition 内嵌套 component 是 vue 官方推荐的嵌套顺序 -->
    <router-view v-slot="{ Component }">
      <!-- slide 的 transition 类定义在 @/assets/scss/base.scss 中 -->
      <transition name="slide">
        <component :is="Component" :data="selectedSinger"></component>
      </transition>
    </router-view>
  </div>
</template>

<script>
  import { computed, ref } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  import { getHotKeys } from '@/service/search'
  import storage from 'good-storage'
  import { SINGER_KEY } from '@/assets/js/constant'
  import useSearchHistory from '@/components/search/useSearchHistory'

  import SearchInput from '@/components/search/search-input'
  import Suggest from '@/components/search/suggest'
  import SearchList from '@/components/search/search-list'

  export default {
    name: 'search',
    components: {
      SearchInput,
      Suggest,
      SearchList
    },
    setup () {
      const query = ref('')
      const hotKeys = ref([])

      const store = useStore()
      const searchHistory = computed(() => store.state.searchHistory)

      const { saveSearch } = useSearchHistory()

      getHotKeys().then(res => {
        hotKeys.value = res.hotKeys
      })

      const addQuery = key => {
        query.value = key
      }

      const selectedSinger = ref(null)
      const router = useRouter()
      const selectSinger = singer => {
        saveSearch(query.value)
        selectedSinger.value = singer
        // 将 singer 缓存下来，保证在 /search/:id 路由下也能成功刷新
        cacheSinger(singer)
        router.push(`/search/${singer.mid}`)
      }

      const cacheSinger = singer => {
        storage.session.set(SINGER_KEY, singer)
      }

      const selectSong = song => {
        saveSearch(query.value)
        store.dispatch('addSong', song)
      }

      return {
        query,
        hotKeys,
        searchHistory,
        addQuery,
        selectedSinger,
        selectSinger,
        selectSong
      }
    }
  }
</script>

<style lang='scss' scoped>
  .search {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    display: flex;
    flex-direction: column;

    .search-input-wrapper {
      margin: 10px 20px 20px;
    }

    .search-content {
      flex: 1;
      overflow: hidden;

      .hot-keys {
        margin: 0 20px 20px;

        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }

        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }
    }

    .search-history {
      position: relative;
      margin: 0 20px;
      .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: $font-size-medium;
        color: $color-text-l;
        .text {
          flex: 1;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
  }
</style>
