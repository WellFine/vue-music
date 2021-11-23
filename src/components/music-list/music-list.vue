<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgImageStyle" ref="bgImage">
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div class="play-btn" v-show="songs.length > 0" @click="randomPlayMusicList">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <!-- 背景头图的半透明蒙层 -->
      <div class="mask-filter" :style="filterStyle"></div>
    </div>
    <com-scroll
      class="list" :style="scrollStyle"
      :probe-type="3" @scroll="onScroll"
      v-loading="loading" v-no-result:[noResultInfo]="noResult"
    >
      <div class="list-wrapper">
        <song-list
          :songs="songs"
          @select="onSelectSong"
        ></song-list>
      </div>
    </com-scroll>
  </div>
</template>

<script>
  import Scroll from '@/components/wrap-scroll'
  import SongList from '@/components/base/song-list/song-list'

  import { mapActions, mapState } from 'vuex'

  // 滚动歌曲列表时，顶部歌手名字和返回图标 fixed 的高度
  const TOP_FIXED_HEIGHT = 40

  export default {
    name: 'music-list',
    props: {
      songs: { // 歌曲列表
        type: Array,
        default () {
          return []
        }
      },
      title: String, // 列表标题
      pic: String, // 列表头图,
      loading: Boolean, // 是否加载数据
      noResultInfo: {
        type: String,
        default: '抱歉，没有找到可播放的歌曲'
      }
    },
    components: {
      ComScroll: Scroll,
      SongList
    },
    data () {
      return {
        // 背景图片高度
        imageHeight: 0,
        // 歌曲列表滚动的 y 值
        scrollY: 0,
        // 歌曲列表最大可以滚动的距离
        maxTranslateY: 0
      }
    },
    computed: {
      ...mapState(['playlist']),
      // 动态设置背景图高度，滚动歌曲列表会随之隐藏或放大背景图
      bgImageStyle () {
        const scrollY = this.scrollY
        let zIndex = 0
        let paddingTop = '70%'
        let height = 0
        let translateZ = 0 // iphone 兼容

        // 如果歌曲列表滚动的距离超过了设置的最大可滚动距离，列表会停止移动
        if (scrollY > this.maxTranslateY) {
          zIndex = 10
          paddingTop = 0
          height = `${TOP_FIXED_HEIGHT}px`
          translateZ = 1 // 设置 translateZ 是为了 iphone 的兼容，如果不设置图片会遮不住歌手列表
        }

        let scale = 1
        // 向下拉动歌曲列表，背景图片会放大
        if (scrollY < 0) {
          scale = 1 + Math.abs(scrollY / this.imageHeight)
        }

        return {
          zIndex,
          paddingTop,
          height,
          backgroundImage: `url(${this.pic})`,
          transform: `scale(${scale}) translateZ(${translateZ}px)` // 设置 translateZ 是为了 iphone 的兼容
        }
      },
      // 根据背景图片高度动态设置歌曲滚都列表的定位 top 和 bottom 值
      scrollStyle () {
        const bottom = this.playlist.length ? '60px' : '0px'
        return {
          top: `${this.imageHeight}px`,
          bottom
        }
      },
      // 上拉歌曲列表时背景图蒙层模糊处理
      filterStyle () {
        let blur = 0
        const scrollY = this.scrollY

        if (scrollY > 0) blur = Math.min(this.maxTranslateY / 30, scrollY / 30)

        return {
          backdropFilter: `blur(${blur}px)`
        }
      },
      // 随机播放按钮上拉歌曲列表后，需要改变 bottom 距离底部的距离，以免出现在歌手名字上方
      playBtnStyle () {
        let visibility = 'visible' // 默认情况下元素正常显示

        if (this.scrollY >= this.maxTranslateY) {
          visibility = 'hidden' // 当歌曲列表顶到顶部时隐藏
        }

        return {
          visibility
        }
      },
      noResult () {
        return !this.songs.length && !this.loading
      }
    },
    mounted () {
      // 拿到图片高度，imageHeight 变化会动态设置歌曲列表 list 的定位 top 值
      this.imageHeight = this.$refs.bgImage.clientHeight

      // 设置歌曲列表可以滚动的最大距离，滚动到这个距离列表就会停止上移，继续滚动内容超出
      this.maxTranslateY = this.imageHeight - TOP_FIXED_HEIGHT
    },
    methods: {
      goBack () {
        // this.$router.go(-1)
        this.$router.back()
      },

      onScroll (position) {
        this.scrollY = -position.y
      },

      /**
       * 用 vuex 提供的语法糖将 selectPlay 这个 action 注册到当前组件的 methods 中
       * 在组件中使用 this.$store.dispatch('xxx') 分发 action，或者使用 mapActions 辅助函数将组件的 methods 映射为 store.dispatch 调用
       */
      ...mapActions(['selectPlay', 'randomPlay']),

      onSelectSong ({ song, index }) {
        this.selectPlay({
          list: this.songs,
          index
        })
      },

      randomPlayMusicList () {
        this.randomPlay(this.songs)
      }
    }
  }
</script>

<style lang='scss' scoped>
  .music-list {
    position: relative;
    height: 100%;

    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 20;
      transform: translateZ(2px); // iphone 兼容

      .icon-back {
        display: block;
        padding: 10px;
        color: $color-theme;
        font-size: $font-size-large-x;
      }
    }

    .title {
      position: absolute;
      top: 0;
      left: 10%;
      width: 80%;
      z-index: 20;
      transform: translateZ(2px); // iphone 兼容
      @include no-wrap();
      text-align: center;
      line-height: 40px;
      font-size: $font-size-large;
      color: $color-text;
    }

    .bg-image {
      position: relative;
      width: 100%;
      transform-origin: top;
      background-size: cover;

      .play-btn-wrapper {
        position: absolute;
        bottom: 30px;
        z-index: 10;
        width: 100%;
        .play-btn {
          box-sizing: border-box;
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid $color-theme;
          color: $color-theme;
          border-radius: 100px;
          font-size: 0;
        }
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }

      .mask-filter {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(7, 17, 27, .4);
      }
    }

    .list {
      position: absolute;
      bottom: 0;
      width: 100%;
      z-index: 0;

      &-wrapper {
        padding: 16px 30px 20px;
        background: $color-background;
      }
    }
  }
</style>
