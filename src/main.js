import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import lazyPlugin from 'vue3-lazy'

// 引入全局实体样式文件
import '@/assets/scss/index.scss'

// v-loading 指令
import loadingDirective from '@/components/base/loading/directive'

createApp(App).use(store).use(router).use(lazyPlugin, {
  /**
   * require 是 webpack 可以识别的语法，可以找到对应的图片，然后使用相应的 loader 来处理
   * 最终将图片处理为 base64 或把图片变为外链，然后通过外链加载图片
   */
  loading: require('@/assets/images/default.png')
})
// app.directive 全局注册指令，但要注意，在这个 app 下注册的指令，只能这个 app 下的组件可以使用
.directive('loading', loadingDirective)
.mount('#app')
