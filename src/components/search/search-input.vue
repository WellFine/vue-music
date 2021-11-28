<template>
  <div class="search-input">
    <i class="icon-search"></i>
    <input
      class="input-inner"
      type="text" :placeholder="placeholder"
      v-model="query"
    />
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script>
  import { debounce } from 'throttle-debounce'

  export default {
    name: 'search-input',
    props: {
      modelValue: String,
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data () {
      return {
        query: this.modelValue
      }
    },
    created () {
      // watch query 当内部修改值时通知外部
      this.$watch('query', debounce(300, newQuery => {
        this.$emit('update:modelValue', newQuery.trim())
      }))
      // 这两步实现了 v-model 在自定义组件上的双向绑定
      // watch modelValue 用于外部修改内部的值
      this.$watch('modelValue', newValue => {
        this.query = newValue
      })
    },
    methods: {
      clear () {
        this.query = ''
      }
    }
  }
</script>

<style lang='scss' scoped>
  .search-input {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 32px;
    background: $color-highlight-background;
    border-radius: 6px;

    .icon-search {
      font-size: 24px;
      color: $color-text-d;
    }

    .input-inner {
      flex: 1;
      margin: 0 5px;
      line-height: 18px;
      background: $color-highlight-background;
      color: $color-text;
      font-size: $font-size-medium;
      outline: 0;
      &::placeholder {
        color: $color-text-d;
      }
    }

    .icon-dismiss {
      font-size: 16px;
      color: $color-text-d;
    }
  }
</style>
