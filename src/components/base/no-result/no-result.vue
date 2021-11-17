<template>
  <div class="no-result">
    <div class="no-result-content">
      <div class="icon"></div>
      <p class="text">{{ info }}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'no-result',
    data () {
      return {
        info: '抱歉，没有结果'
      }
    },
    methods: {
      setInfo (info) {
        this.info = info
      }
    }
  }
</script>

<style lang='scss' scoped>
  .no-result {
    // absolute 定位可以借助指令作用到相应 DOM 时为 DOM 添加的 relative 定位来定位到 DOM 中间
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    .no-result-content {
      text-align: center;
      .icon {
        width: 86px;
        height: 90px;
        margin: 0 auto;
        @include bg-image('no-result');
        background-size: 86px 90px;
      }
      .text {
        margin-top: 30px;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
  }
</style>
