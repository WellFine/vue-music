import createLikeLoadingDirective from '@/assets/js/create-like-loading-directive'
import Loading from './loading.vue'

const loadingDirective = createLikeLoadingDirective(Loading)

export default loadingDirective

// 以下逻辑提取到了 @/assets/js/create-like-loading-directive.js 中
// /**
//  * 该指令将 loading 组件生成的 DOM 动态插入到指令作用的 DOM 对象上
//  */
// import { createApp } from 'vue'
// import { addClass, removeClass } from '@/assets/js/dom'
// import Loading from './loading.vue'

// const relativeClass = 'g-relative'

// const loadingDirective = {
//   // 在指令绑定元素的父组件被挂载后调用
//   mounted (el, binding) {
//     /**
//      * 创建一个新的 vue 实例，其根组件就是 loading 组件
//      * vue 并不是只能在 main.js 中创建一个 vue 实例
//      * main.js 中的 vue 实例，其根组件是 App.vue
//      * 开发过程中可以灵活的创建新的 vue 实例，然后使用实例的 mount 方法挂载实例组件
//      */
//     // app 是 loading 组件应用实例
//     const app = createApp(Loading)
//     // instance 是 loading 根组件实例，是将 loading 组件挂载到新创建的 div 后返回
//     const instance = app.mount(document.createElement('div'))

//     // 将 instance 实例存下来，方便 updated 函数中使用
//     el.instance = instance

//     setLoadingInfo(instance, binding.arg)

//     // v-loading=true
//     if (binding.value) {
//       append(el)
//     }
//   },

//   // 在包含组件的 VNode 及其子组件的 VNode 更新后调用
//   updated (el, binding) {
//     setLoadingInfo(el.instance, binding.arg)

//     // 如果 v-loading 指令的值改变
//     if (binding.value !== binding.oldValue) {
//       binding.value ? append(el) : remove(el)
//     }
//   }
// }

// function append (el) {
//   // 如果指令作用的 DOM 没有定位，则加上定位以便 loading 的 absolute 生效
//   // loading 使用 fixed 则不需要这段逻辑
//   // setRelative(el)

//   // instance 是 loading 根组件实例，instance.$el 就是 loading 组件对应的 DOM 对象
//   el.appendChild(el.instance.$el)
// }

// function remove (el) {
//   removeClass(el, relativeClass)
//   el.removeChild(el.instance.$el)
// }

// // eslint-disable-next-line no-unused-vars
// function setRelative (el) {
//   // Window.getComputedStyle() 方法返回 CSS 样式对象
//   const style = getComputedStyle(el)
//   // 如果指令作用的 DOM 没有定位，则加上定位以便 loading 的 absolute 生效
//   if (['fixed', 'relative', 'absolute'].indexOf(style.position) === -1) {
//     // g-relative 这个类已经在 @/assets/scss/base.scss 中定义了，作用就是加上 position: relative; 这个样式
//     addClass(el, relativeClass)
//   }
// }

// function setLoadingInfo (instance, info) {
//   // 如果 info 即 binding.arg 存在, 则通过 loading 实例 instance 调用 loading 的 setInfo method 设置 info data
//   if (typeof info !== 'undefined') {
//     instance.setInfo(info)
//   }
// }

// export default loadingDirective
