<template>
  <div class="search">
    <div class="search-input-wrapper">
      <!--
        search-input 内部提供 query 供外部使用，debounce 等操作都由 search-input 内部完成
        外部使用时只需要监听 query 变化即可
      -->
      <search-input v-model="query"></search-input>
    </div>
    <div class="search-content">
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
  </div>
</template>

<script>
  import { ref } from 'vue'
  import SearchInput from '@/components/search/search-input'
  import { getHotKeys } from '@/service/search'

  export default {
    name: 'search',
    components: {
      SearchInput
    },
    setup () {
      const query = ref('')
      const hotKeys = ref([])

      getHotKeys().then(res => {
        hotKeys.value = res.hotKeys
      })

      const addQuery = key => {
        query.value = key
      }

      return {
        query,
        hotKeys,
        addQuery
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
  }
</style>
