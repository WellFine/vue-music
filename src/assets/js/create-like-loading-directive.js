import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom'

const relativeClass = 'g-relative'

export default function createLikeLoadingDirective (Component) {
  return {
    // 在指令绑定元素的父组件被挂载后调用
    mounted (el, binding) {
      const app = createApp(Component)
      const instance = app.mount(document.createElement('div'))

      const name = Component.name
      if (!el[name]) el[name] = {}
      // 加了一层组件 name 属性，防止多个指令作用在同一个 DOM 上时，el.instance 会被覆盖掉
      el[name].instance = instance

      // 设置 Component 的提示信息
      setInfo(instance, binding.arg)

      if (binding.value) {
        append(el)
      }
    },

    // 在包含组件的 VNode 及其子组件的 VNode 更新后调用
    updated (el, binding) {
      // 设置 Component 的提示信息
      const name = Component.name
      setInfo(el[name].instance, binding.arg)

      // 如果指令的值变化了，根据新值判断添加或删除 Component
      if (binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el)
      }
    }
  }

  function append (el) {
    // 如果指令作用的 DOM 没有定位，则加上定位以便 Component 的 absolute 生效
    setRelative(el)

    // 在指令作用的 DOM 上添加 Component
    const name = Component.name
    el.appendChild(el[name].instance.$el)
  }

  function remove (el) {
    // 先移除 append 时设置的样式类
    removeClass(el, relativeClass)

    // 从指令作用的 DOM 上删除对应的 Component
    const name = Component.name
    el.removeChild(el[name].instance.$el)
  }
}

function setRelative (el) {
  // Window.getComputedStyle() 方法返回 CSS 样式对象
  const style = getComputedStyle(el)
  // 如果指令作用的 DOM 没有定位，则加上定位以便 Component 的 absolute 生效
  if (['fixed', 'relative', 'absolute'].indexOf(style.position) === -1) {
    // g-relative 这个类已经在 @/assets/scss/base.scss 中定义了，作用就是加上 position: relative; 这个样式
    addClass(el, relativeClass)
  }
}

function setInfo (instance, info) {
  // 如果 info 即 binding.arg 存在, 则通过 Component 实例 instance 调用 Component 的 setInfo method 设置 info data
  if (typeof info !== 'undefined') {
    instance.setInfo(info)
  }
}
