<template>
  <div class="loading">
    <!--
      vue3 有了 teleport 后，一般加载组件都会用 teleport 瞬移到 body 下
      使用自定义指令来使用该组件的情况下
      自定义指令的实现是通过 mounted 时将该组件挂载到使用指令的 DOM 上，updated 时将该组件从 DOM 上移除
      此时如果使用 teleport，就会导致要移除的 DOM 有误，导致该组件无法正确 remove
    -->
    <div class="loading__circle"></div>
    <p v-if="info" class="loading__info">{{ info }}</p>
  </div>
</template>

<script>
  export default {
    name: 'loading',
    data () {
      return {
        info: '正在载入...'
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
  .loading {
    position: fixed; // 显示在视口中间
    // position: absolute; // 显示在 v-loading 作用的 DOM 中间
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: $color-background-d;
    border-radius: 10px;

    @keyframes load {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    &__circle {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid $color-text-d;
      border-top: 3px solid $color-theme;
      border-bottom: 3px solid $color-sub-theme;
      animation: load linear 1s infinite;
    }

    &__info {
      margin-top: 12px;
      color: $color-text-ll;
      font-size: $font-size-medium;
    }
  }
</style>
