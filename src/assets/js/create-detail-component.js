import MusicList from '@/components/music-list/music-list'
import storage from 'good-storage'
import { processSongs } from '@/service/song'

export default function createDetailComponent (name, key, fetch) {
  return {
    name,
    props: {
      data: Object
    },
    components: {
      MusicList
    },
    computed: {
      computedData () {
        let res = null
        const data = this.data

        if (data) res = data
        else {
          const cached = storage.session.get(key)
          // singer 有 mid 就用 mid，album 没有 mid 就用 id，且需要字符串类型，因为 this.$route.params.id 是字符串类型
          if (cached && (cached.mid || cached.id + '') === this.$route.params.id) {
            res = cached
          }
        }

        return res
      },
      title () {
        const data = this.computedData
        // data.name 是 singer 才有的属性，album 没有就用 data.title
        return data && (data.name || data.title)
      },
      pic () {
        const data = this.computedData
        return data && data.pic
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
      const computedData = this.computedData

      // 当没有传 data prop 且缓存中没有 data 或缓存中 data.mid 与当前路由的动态参数 id 不匹配时，返回上一级路由歌手详情页
      if (!computedData) {
        const path = this.$route.matched[0].path
        this.$router.push(path)
        return
      }

      const detail = await fetch(computedData)

      // getSingerDetail 获取出来的歌手歌曲列表详情是不包含歌曲播放 url 的，下面根据歌曲 mid 来获取 url
      this.songs = await processSongs(detail.songs)
    }
  }
}
