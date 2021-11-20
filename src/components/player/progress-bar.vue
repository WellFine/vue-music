<template>
  <div class="progress-bar" @click="clickChangeProgress">
    <div class="bar-inner">
      <!-- 已播放的进度条 -->
      <div
        class="progress" :style="progressStyle"
        ref="progress"
      ></div>
      <div
        class="progress-btn-wrapper" :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  const progressBtnWidth = 16 // 进度条按钮宽度，用于计算进度条宽度

  export default {
    name: 'progress-bar',
    props: {
      progress: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        // 按钮偏移量，自动根据 props.progress 而变化
        offset: 0
      }
    },
    created () {
      // 存储 touch 事件相关的变量，因为只在函数内部使用了 touch 来存储数据，而不需要监听 touch 的变化，所以在 created 中挂到 vue 实例上即可，在 data 中返回的话会把 touch 变成响应式，是一种不必要的性能浪费
      this.touch = {}
    },
    mounted () {
      /**
       * mounted 执行时组件挂载了但还没有渲染完成，因为渲染是异步的
       * 所以要想获取准确的 clientWidth 需要等待组件渲染完成，所以这里使用 nextTick 等待下一次 DOM 更新
       */
      this.$nextTick(() => {
        // 进度条总长度，和 touch 一样不必在 data 中返回
        this.barWidth = this.$el.clientWidth - progressBtnWidth
      })
    },
    watch: {
      // 根据 props.progress 而自动计算 offset 偏移量
      progress (newProgress) {
        this.offset = this.barWidth * newProgress
      }
    },
    computed: {
      progressStyle () {
        return `width: ${this.offset}px;`
      },
      btnStyle () {
        return `transform: translate3d(${this.offset}px, 0, 0)`
      }
    },
    emits: ['progress-changing', 'progress-changed'],
    methods: {
      onTouchStart (e) {
        // 进度条按钮最开始时的位置
        this.touch.x1 = e.touches[0].pageX
        // 已播放部分进度条长度
        this.touch.beginWidth = this.$refs.progress.clientWidth
      },
      onTouchMove (e) {
        // 拖动过程中的偏移量
        const moveOffset = e.touches[0].pageX - this.touch.x1
        // 拖动后的播放进度条长度
        const tempWidth = this.touch.beginWidth + moveOffset

        // 控制播放进度条长度在 0 到总长度之间
        // this.offset = Math.min(this.barWidth, Math.max(0, tempWidth))

        // 已播放长度除以总长度得出播放比例，且控制在 0 和 1 之间
        const newProgress = Math.min(1, Math.max(0, tempWidth / this.barWidth))
        // 用总长度乘以播放比例得出实际拖动偏移量
        this.offset = this.barWidth * newProgress
        this.$emit('progress-changing', newProgress)
      },
      onTouchEnd () {
        const progress = this.$refs.progress.clientWidth / this.barWidth
        this.$emit('progress-changed', progress)
      },
      clickChangeProgress (e) {
        // e.offsetX 减去进度条按钮宽度的一半，让按钮更加的跟手
        const progress = (e.offsetX - progressBtnWidth / 2) / this.barWidth
        this.$emit('progress-changed', progress)
      }
    }
  }
</script>

<style lang='scss' scoped>
  .progress-bar {
    height: 30px;

    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, .3);

      .progress {
        position: absolute;
        height: 100%;
        background: $color-theme;
      }

      .progress-btn-wrapper {
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;

        .progress-btn {
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid $color-text;
          border-radius: 50%;
          background: $color-theme;
        }
      }
    }
  }
</style>
