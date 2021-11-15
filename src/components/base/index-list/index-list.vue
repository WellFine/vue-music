<template>
  <com-scroll
    class="index-list"
    :probe-type="3"
    ref="scrollRef"
    @scroll="onScroll"
  >
    <!-- 歌手滚动列表 -->
    <ul ref="groupRef">
      <li v-for="group in data" :key="group.title" class="group">
        <h2 class="group__title">{{ group.title }}</h2>
        <ul>
          <li v-for="item in group.list" :key="item.id" class="group__item">
            <img class="group__item__avatar" v-lazy="item.pic" />
            <span class="group__item__name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 固定在滚动列表顶部的 title -->
    <div class="fixed" v-show="fixedTitle" :style="fixedStyle">
      <div class="fixed__title">{{ fixedTitle }}</div>
    </div>
    <!--
      一旁的 title 短列
      给 shortcut 绑定事件进行事件委托，点击 li 时冒泡触发 shortcut 上的事件，通过 event.target 判断是哪个 li
    -->
    <div
      class="shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      @touchend.stop.prevent
    >
      <ul>
        <li
          v-for="(item, index) in shortcutList" :key="item"
          class="shortcut__item"
          :class="{ 'shortcut__item--active': currentIndex === index }"
          :data-index="index"
        >{{ item }}</li>
      </ul>
    </div>
  </com-scroll>
</template>

<script>
  import Scroll from '@/components/base/scroll/scroll'

  import useFixed from './useFixed'
  import useShortcut from './useShortcut'

  export default {
    name: 'index-list',
    props: {
      data: {
        type: Array,
        default () {
          return []
        }
      }
    },
    components: {
      ComScroll: Scroll
    },
    setup (props) {
      const { groupRef, onScroll, fixedTitle, fixedStyle, currentIndex } = useFixed(props)

      const { scrollRef, shortcutList, onShortcutTouchStart, onShortcutTouchMove } = useShortcut(props, groupRef)

      return {
        // fixed
        groupRef,
        onScroll,
        fixedTitle,
        fixedStyle,
        currentIndex,
        // shortcut
        scrollRef,
        shortcutList,
        onShortcutTouchStart,
        onShortcutTouchMove
      }
    }
  }
</script>

<style lang='scss' scoped>
  .index-list {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: $color-background;

    .group {
      padding-bottom: 30px;

      &__title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-highlight-background;
      }

      &__item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;

        &__avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }

        &__name {
          margin-left: 20px;
          color: $color-text-l;
          font-size: $font-size-medium;
        }
      }
    }

    .fixed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;

      &__title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-highlight-background;
      }
    }

    .shortcut {
      position: absolute;
      right: 6px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      padding: 10px 0;
      border-radius: 10px;
      text-align: center;
      background: $color-background-d;
      font-family: Helvetica;

      &__item {
        padding: 4px;
        line-height: 1;
        color: $color-text-l;
        font-size: $font-size-small;
      }

      &__item--active {
        color: $color-theme;
      }
    }
  }
</style>
