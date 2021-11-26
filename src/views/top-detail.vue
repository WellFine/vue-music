<template>
  <div class="album">
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
      rank
    ></music-list>
  </div>
</template>

<script>
  import createDetailComponent from '@/assets/js/create-detail-component'
  import { TOP_KEY } from '@/assets/js/constant'
  import { getTopDetail } from '@/service/top-list'

  export default createDetailComponent('album', TOP_KEY, getTopDetail)
</script>

<style lang='scss' scoped>
  .album {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
  }
</style>
