<template>
  <div class="tab">
    <router-link
      class="tab__item"
      v-for="tab in tabs" :key="tab.path"
      :to="tab.path"
    >
      <span class="tab__item__name">{{ tab.name }}</span>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'tab',
    data () {
      return {
        tabs: [
          { name: '推荐', path: '/recommend' },
          { name: '歌手', path: '/singer' },
          { name: '排行', path: '/top-list' },
          { name: '搜索', path: '/search' }
        ]
      }
    }
  }
</script>

<style lang='scss' scoped>
  .tab {
    display: flex;
    height: 44px;
    line-height: 44px;
    font-size: $font-size-medium;

    &__item {
      flex: 1;
      text-align: center;

      &__name {
        color: $color-text-l;
        padding-bottom: 5px;
      }

      // .router-link-active 是 vue-router 自带的一个激活类，是链接激活时，应用于渲染的 <a> 的 class
      &.router-link-active {
        .tab__item__name {
          color: $color-theme;
          font-weight: 600;
          border-bottom: 2px solid $color-theme;
        }
      }
    }
  }
</style>
