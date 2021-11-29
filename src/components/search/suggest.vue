<template>
  <div
    class="suggest" ref="rootRef"
    v-loading:[loadingText]="loading"
    v-no-result:[noResultText]="noResult"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-if="singer" @click="selectSinger(singer)">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="tex">{{ singer.name }}</p>
        </div>
      </li>
      <li
        class="suggest-item"
        v-for="song in songs" :key="song.id"
        @click="selectSong(song)"
      >
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{ song.singer }} - {{ song.name }}</p>
        </div>
      </li>
      <div class="suggest-item" v-loading:[loadingText]="pullupLoading"></div>
    </ul>
  </div>
</template>

<script>
  import { ref, watch, computed, nextTick } from 'vue'
  import { search } from '@/service/search'
  import { processSongs } from '@/service/song'
  import usePullUpLoad from '@/components/search/usePullUpLoad'

  export default {
    name: 'suggest',
    props: {
      query: String,
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    emits: ['select-singer', 'select-song'],
    setup (props, { emit }) {
      const singer = ref(null)
      const songs = ref([])
      const hasMore = ref(true)
      const page = ref(1)
      const loadingText = ref('')
      const noResultText = ref('抱歉，暂无搜索结果')
      const manualLoading = ref(false)

      const loading = computed(() => !singer.value && !songs.value.length)
      const noResult = computed(() => {
        return !singer.value && !songs.value.length && !hasMore.value
      })

      const pullupLoading = computed(() => isPullUpLoad.value && hasMore.value)

      const preventPullUpLoad = computed(() => {
        return loading.value || manualLoading.value
      })

      const { scroll, rootRef, isPullUpLoad } = usePullUpLoad(searchMore, preventPullUpLoad)

      // watch 需要是响应式遍历，而 props.query 只是 String 类型，使用 getter 函数返回可以包装成响应式变量
      watch(() => props.query, async (newQuery) => {
        if (!newQuery) return

        await searchFirst()
      })

      async function searchFirst () {
        if (!props.query) return

        // 第一次搜索初始化状态
        singer.value = null
        songs.value = []
        hasMore.value = true
        page.value = 1

        const res = await search(props.query, page.value, props.showSinger)
        // 获取出来的歌曲列表并没有播放 url，调用 processSongs 获取歌曲播放 url
        songs.value = await processSongs(res.songs)
        singer.value = res.singer
        hasMore.value = res.hasMore

        // 保证请求数据足够多，可以撑满一屏
        await nextTick()
        await makeItScrollable()
      }

      async function searchMore () {
        // 当没有更多数据或请求时点击了搜索框的删除按钮导致 query 为空，都不继续加载
        if (!hasMore.value || !props.query) return

        page.value++
        const result = await search(props.query, page.value, props.showSinger)
        songs.value = songs.value.concat(await processSongs(result.songs))
        hasMore.value = result.hasMore

        // 保证请求数据足够多，可以撑满一屏
        await nextTick()
        await makeItScrollable()
      }

      // 请求出来的数据如果不够一屏，，则继续加载直至数据撑满一屏
      // 因为过滤掉了付费歌曲，所以过滤后数据不够一屏的情况下，用户可能无法感知还可以上拉加载歌曲，所以这里继续加载直至一屏
      async function makeItScrollable () {
        // 如果 scroll 不可滚动，证明数据不够撑满一屏，则继续加载
        if (scroll.value.maxScrollY >= -1) {
          manualLoading.value = true
          await searchMore()
          manualLoading.value = false
        }
      }

      function selectSinger (singer) {
        emit('select-singer', singer)
      }

      function selectSong (song) {
        emit('select-song', song)
      }

      return {
        singer,
        songs,
        loading,
        loadingText,
        noResult,
        noResultText,
        pullupLoading,
        selectSinger,
        selectSong,
        // pull up load
        rootRef,
        isPullUpLoad
      }
    }
  }
</script>

<style lang='scss' scoped>
  .suggest {
    height: 100%;
    overflow: hidden;

    .suggest-list {
      padding: 0 30px;

      .suggest-item {
        display: flex;
        align-items: center;
        padding-bottom: 20px;

        .icon {
          flex: 0 0 30px;
          width: 30px;

          [class^="icon-"] {
            font-size: 14px;
            color: $color-text-d;
          }
        }

        .name {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-d;
          overflow: hidden;

          .text {
            @include no-wrap();
          }
        }
      }
    }
  }
</style>
