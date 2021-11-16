<template>
  <div class="singer-detail">
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
    ></music-list>
  </div>
</template>

<script>
  import MusicList from '@/components/music-list/music-list'
  import { getSingerDetail } from '@/service/singer'
  import { processSongs } from '@/service/song'
  import { SINGER_KEY } from '@/assets/js/constant'
  import storage from 'good-storage'

  export default {
    name: 'singer-detail',
    props: {
      singer: Object
    },
    components: {
      MusicList
    },
    computed: {
      computedSinger () {
        let res = null
        const singer = this.singer

        if (singer) res = singer
        else {
          const cachedSinger = storage.session.get(SINGER_KEY)
          if (cachedSinger && cachedSinger.mid === this.$route.params.id) {
            res = cachedSinger
          }
        }

        return res
      },
      title () {
        const singer = this.computedSinger
        return singer && singer.name
      },
      pic () {
        const singer = this.computedSinger
        return singer && singer.pic
      },
      loading () {
        return !this.songs.length
      }
    },
    data () {
      return {
        songs: []
      }
    },
    async created () {
      const computedSinger = this.computedSinger

      // 当没有传 singer prop 且缓存中没有 singer 或缓存中 singer.mid 与当前路由的动态参数 id 不匹配时，返回上一级路由歌手详情页
      if (!computedSinger) {
        const path = this.$route.matched[0].path
        this.$router.push(path)
        return
      }

      const detail = await getSingerDetail(computedSinger.mid)

      // getSingerDetail 获取出来的歌手歌曲列表详情是不包含歌曲播放 url 的，下面根据歌曲 mid 来获取 url
      this.songs = await processSongs(detail.songs)
    }
  }
</script>

<style lang='scss' scoped>
  .singer-detail {
    position: fixed;
    z-index: 10;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: $color-background;
  }
</style>
