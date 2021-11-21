<template>
  <div class="progress-circle">
    <!-- viewBox 中定义了 100 的宽和高，但实际上渲染的宽高还是由 width 和 height 决定的 -->
    <svg
      :width="radius"
      :height="radius"
      viewBox="0 0 100 100"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- circle 的 r 定义半径 -->
      <circle
        class="progress-background"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
      />
      <!--
        stroke-dasharray 控制圆的周长
        stroke-dashoffset 控制圆的偏移，如果值为 0 说明没有偏移，那么圆就是完整的，这个值越大说明偏移量越大，圆显示的越少
       -->
      <circle
        class="progress-bar"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <!-- slot 可以渲染圆圈内的图标 -->
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'progress-circle',
    props: {
      radius: {
        type: Number,
        default: 100
      },
      progress: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        // dashArray 用于设置 stroke-dasharray，是圆的周长，所以是 Math.PI * 2 * 50，50 为 circle 设置的半径
        dashArray: Math.PI * 100
      }
    },
    computed: {
      /**
       * dashOffset 用于设置 stroke-dashoffset 的值
       * stroke-dasharray 控制圆的周长
       * stroke-dashoffset 控制圆的偏移，如果值为 0 说明没有偏移，那么圆就是完整的，这个值越大说明偏移量越大，圆显示的越少
       */
      dashOffset() {
        return (1 - this.progress) * this.dashArray
      }
    }
  }
</script>

<style lang="scss" scoped>
  .progress-circle {
    position: relative;
    circle {
      stroke-width: 8px;
      transform-origin: center;
      &.progress-background {
        transform: scale(0.9);
        stroke: $color-theme-d;
      }
      &.progress-bar {
        transform: scale(0.9) rotate(-90deg);
        stroke: $color-theme;
      }
    }
  }
</style>
