# vue-music

vue 音乐 web app，项目原作者 [ustbhuangyi](https://github.com/ustbhuangyi)

安装：`npm install`，运行：`npm run serve`

[TOC]

# 项目知识点

## 图片 @2x 和 @3x 与 dpi

@2x: iPhone4/4S/5/5S/6/6S/7 对应尺寸，这就是我们通常所说的 2 倍图

@3x: iPhone6P/6SP/7P 使用的尺寸，这就是 3 倍图

@2x 和 @3x 的图片应用在不同 dpi 的浏览器上，dpi 为 2 的浏览器用 @2x 就够了，@3x 是浪费，如果 dpi 为 3 就用 @3x 的图片

```scss
@mixin bg-image($url) {
  background-image: url($url + "@2x.png");
  @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3) {
    background-image: url($url + "@3x.png");
  }
}
```

```scss
.img {
  @include bg-image('./logo');
}
```



## 图片懒加载

图片懒加载是很常见的功能，当图片出现在页面视口中时才按需加载，这样会大大节约带宽，是一种常见的性能优化手段

vue 项目可以使用插件来完成这一功能，[vue-lazyload](https://github.com/hilongjw/vue-lazyload) 目前只支持 vue2.x 版本，vue3 可以使用 [vue3-lazy](https://github.com/ustbhuangyi/vue3-lazy)

vue3-lazy 配置使用见下方第三方库/vue3-lazy



## sass 全局变量和混入函数的全局引入，关于样式引入的问题

在 `main.js` 中引入的样式，只有是实际的 CSS 样式才会在整个项目中生效，而 variable 变量和 mixin 函数都不是实体的 CSS 样式，而是一种 sass 定义，是给 sass 用的，所以在 main.js 引入是没有意义的

可以在需要用到 sass 变量和函数的地方用 `@import` 引入，也可以在 `vue.config.js` 文件中配置 `sass-loader` 进行全局引入，全局引入后在编译阶段 sass-loader 就知道全局变量和 mixin 是在哪里定义的

> Vue Loader 官方说明：sass-loader 也支持一个 `additionalData` 选项，这个选项允许你在所有被处理的文件之间共享常见的变量，而不需要显式地导入它们

**使用 `additionalData` 需要 sass-loader 版本大于 8，如果 sass-loader 版本 = 8，则使用 `prependData` 字段，如果 sass-loader 版本 < 8，则使用 `data` 字段**



## vue.config.js 文件配置 webpack

vue-cli 已经对 webpack 进行了一层封装，内部已经有 `webpack.config.js` 文件，而 `vue.config.js` 就是 vue-cli 脚手架提供的可以修改 webpack 配置的入口文件

### 配置本地 node server 以解决请求跨域

因为项目的数据是第三方服务接口提供的，而因为浏览器跨域限制所以前端并不能直接请求接口获取数据（第三方服务接口一般也不可能让我们能跨域请求数据）

解决方法：接口代理，自己搭建一个 Node Server，前端页面请求自己的 Node Server，Node Server 再去请求第三方接口即可，因为后端之间的通信不存在跨域问题

webpack 中有 `devServer` 可以在本地启动一个 node server，其中 `before` 函数的 `app` 参数是 express 的一个实例，可以用这个实例搭建后端路由

```js
// vue.config.js
module.exports = {
  devServer: {
    before (app) {
      // 搭建后端路由，查看 ./backend/router.js 文件内容
      // router.js 文件主要就是注册了路由，并在对应路由命中时请求第三方接口，获取第三方接口数据后处理为前端所需数据并返回
      // 开启本地 node server 代理后，前端请求本地 server，本地 server 在 router.js 中注册的路由被前端请求命中后就会向对应的第三方接口发起请求，获取数据后判断并处理为前端所需的格式，最后返回给前端
    }
  }
}
```

搭建完本地 node server 代理后，前端只需请求本地接口即可，请求地址就是第三方服务接口的地址，因为本地接口收到前端请求后，会向第三方服务接口发送相同地址的请求，处理数据后返回给前端



## 移动端事件

* touchstart: 手指触摸到屏幕会触发
* touchmove: 手指在屏幕上移动时触发
* touchend: 手指离开屏幕时触发

BetterScroll 也是基于 touch 类事件实现的滚动



## 手机调试

开发过程中想要用手机调试，手机和电脑在同一个局域网内时，可以用手机访问项目启动时的 ip 地址，如 `http://192.168.1.3:8080/`



## 事件委托

在一个长列表中, 如果每个列表元素都要绑定一个事件处理相同的逻辑, 可以给列表容器添加事件, 通过冒泡形式触发事件, 然后通过事件对象的 `target` 获取触发元素

这样绑定事件变少, 性能会更好

如 `./src/components/base/index-list/index-list.vue` 中侧边锚点列表绑定 touch 类事件



## 第三方库

### [BetterScroll](https://better-scroll.github.io/docs/zh-CN/guide/)

BetterScroll 是一款重点解决移动端（已支持 PC）各种滚动场景需求的插件，这里用来开发轮播图、上拉加载等

#### BetterScroll 滚动

一个高度固定的元素，其内容很长时，可以使用 `overflow: scroll` 开启滚动，还可以借助其他 CSS 开启回弹效果，不过兼容性不好

移动端可以考虑，也推荐使用 BetterScroll 来做滚动效果的实现，该项目封装了一个 Scroll 组件

**BetterScroll 只针对第一个子元素生效，所以封装的 Scroll 组件中多嵌套了一层 div**

**滚动的原理其实就是内容高度超出容器高度后，可以上下或左右拖拽内容，所以一定要确保内容高度比容器高度大**

**BetterScroll 判断能否滚动（内容高度是否大于容器高度）是在初始化 BScroll 时，而在初始化时如果没有内容或内容还没加载完成，是无法滚动的**

可以在内容加载完成后调用 BetterScroll 实例的 `refresh()` 方法重新计算内容高度，DOM 结构发生变化的时候务必要调用确保滚动的效果正常

但每次都调用比较麻烦，官方提供了 `observe-dom` 插件实现自动探测 DOM 变化并自动刷新

#### ObserveDOM 自动探测 DOM 变化实现自动 refresh 刷新

BetterScroll use 插件后，别忘了开启配置项 `observeDOM: true`

#### Slide 轮播图

Slide 轮播图在使用时需要至少一条数据，所以采用数组循环时需要判断数组长度，否则数组最开始为空会报错


### [vue3-lazy](https://github.com/ustbhuangyi/vue3-lazy) 图片懒加载

vue3-lazy 作为插件使用方便，在 main.js 中 use 插件并配置 loading 时默认图片，然后 img 标签使用 `v-lazy` 指令代替 src 属性即可

```js
import lazyPlugin from 'vue3-lazy'
app.use(lazyPlygin, {
  /**
   * require 是 webpack 可以识别的语法，可以找到对应的图片，然后使用相应的 loader 来处理
   * 最终将图片处理为 base64 或把图片变为外链，然后通过外链加载图片
   */
  loading: require('default.png')
})
```

```html
<img v-lazy="img.png" />
```



### [good-storage](https://github.com/ustbhuangyi/storage)

库内部进行了序列化操作，使用这个库可以存储对象格式，该库使用相同 api 支持 sessionStorage 和 localStorage 的存储库



## vue 的使用及 API

### Composition API watch

`watch` 可以直接监听一个 ref，也可以监听一个 getter 函数的返回值。如果监听不是 ref 响应式的数据，应该使用 getter 函数返回

### nextTick 回调延迟

> 官方文档：将回调推迟到下一个 DOM 更新周期之后执行。在更改了一些数据以等待 DOM 更新后立即使用它。

一般在数据变化后，如果想做的操作需要 DOM 更新后才能实现，那么可以使用 `nextTick()` 等待 DOM 更新完成，回调使用 `async await` 更加方便

如 `./src/components/base/index-list/useFixed.js` 中监听数据变化后重新计算 DOM 高度

### 依赖收集与临时变量

使用 computed 计算属性时，如果响应式变量使用次数超过 1 次，应该使用一个临时变量缓存起来，这是 vue 常用的性能优化技巧

原因：每次取 `this.响应式变量` 时，实际上会执行响应式变量的[依赖收集](https://zhuanlan.zhihu.com/p/45081605)，依赖收集过程中会执行变量的 `getter` 等进行一系列 JS 操作，如果多次使用 this.响应式变量，就会执行多次依赖收集，造成没必要的资源浪费



### 自定义指令

```js
// 全局注册
const directive = {
  mounted (el, binding) {} // 在指令绑定元素的父组件被挂载后调用
  updated (el, binding) {} // 在包含组件的 VNode 及其子组件的 VNode 更新后调用
}

app.directive('directiveName', directive)
```

#### v-loading 加载动画组件

加载动画非常常见，自定义组件后在需要使用的地方用 v-if 判断显示即可

但是这样做需要经过引入组件、声明组件、v-if 判断插入组件一系列操作，比较麻烦，不够优雅

可以自定义一个 `v-loading` 指令，在需要用到加载动画的地方用 v-loading 指令并传入一个布尔值，当布尔值为 true 时就会插入加载动画组件，还可以用动态参数来传入加载提示文字，详情查看 `./src/components/base/loading/directive.js`

#### v-no-result 没有结果时提示无结果

该指令作用和 v-loading 作用非常相像，所以将 v-loading 的 directive 自定义指令提取成公共的创建指令方法 `./src/assets/js/create-like-loading-directive.js`

定义指令时有为指令作用的 DOM 添加一个 relative 的定位，方便指令对应的 Component 能够使用 absolute 定位定位到指令作用的 DOM 元素中间

指令对应的 Component 只要加上 absolute 就能定位到指令作用的 DOM 元素中间，如 v-no-result 指令

而 v-loading 指令个人认为显示在屏幕中间会好看一点，所以为 v-loading 组件添加了 fixed 定位

**注意：需要处理一种情况，就是多个指令作用在同一个 DOM 元素上时，挂载在 el 上的 instance 会冲突，需要添加多一层组件 name 属性来防止后面的指令 instance 覆盖了前面指令的 instance，造成移除 el.instance 时找不到元素的错误**



### transition

vue3 的 transition 类名进行了升级，`v-enter` 和 `v-leave` 变为了 `v-enter-from` 和 `v-leave-from`，更加语义化了

#### transition 属性

* name：定义过渡类名前缀
* appear：过渡立即生效

#### transition 与其他组件（如 router-view）结合时的嵌套顺序

vue 提供了很多内置组件，这些内置组件相互结合嵌套使用是常见的情形，而这些组件的嵌套顺序对于它们的正确工作很重要，以下为官方推荐嵌套顺序

```html
<router-view v-slot="{ Component }">
  <template v-if="Component">
    <transition mode="out-in">
      <keep-alive>
        <suspense>
          <component :is="Component"></component>
          <template #fallback>
            <div>
              Loading...
            </div>
          </template>
        </suspense>
      </keep-alive>
    </transition>
  </template>
</router-view>
```



## vue-router 路由相关

### 路由重定向

首页 `/` 和某个路由如 `/recommend` 展示同一个视图组件时，可以使用 `redirect` 将 `/` 重定向到 `/recommend`

### vue-router 自带 .router-link-active 链接激活 class

vue-router 自带了 `.router-link-active` 这个 active-class，用于 `router-link` 在选中激活时方便的设置样式

### 二级路由

如果路由间有父子关系的话，使用嵌套路由会使路由更易于管理。通过配置 `children` 可以实现多层嵌套，children 是一个数组，数组元素就是路由项

注意使用嵌套路由时，记得在父级路由视图组件下放置 `router-view` 标签，这个标签将会承载子路由对应的视图组件

### 动态参数、路径参数

动态参数用 `:` 表示，当一个路由被匹配时，它的 params 的值将在每个组件中以 `this.$route.params` 的形式暴露出来

### 路由 API

* `this.$router.push(entry)` 在历史堆栈中推送一条记录，entry 可以是 String 也可以是一个路由配置项 Object，以编程方式（JS 调用）导航到一个新的 URL
* `this.$router.back()` 路由回退
* `this.$router.go(index)` 前进或后退 index 个页面



## vuex 全局状态管理工具

* State：全局数据仓库，存储数据
* Getters：可以理解成 state 的计算属性，基于多个 state 可以计算出新的数据。**注意：从 Vue 3.0 开始，getter 的结果不再像计算属性一样会被缓存起来。这是一个已知的问题，将会在 3.2 版本中修复。详情请看 PR #1878。**
* Mutations：commit 提交一个 mutation 来修改 state 数据，vuex 中只能通过这种方式修改数据，这是为了保证数据的可追踪性，且 mutation 只支持同步改变数据
* Actions：action 中可以提交一个或多个 mutation，也可以进行异步操作，所以适合对 mutation 进行封装
* Modules：Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块

### vuex 严格模式

开启严格模式后，vuex 会深度 watch 所有的 state，监测 state 状态是不是提交 mutation 修改的，如果不是会报警告

但深度 watch 肯定会带来性能损耗问题，所以一般只在开发环境下开启

```js
import { createStore } from 'vuex'
export default createStore({
  strict: process.env.NODE_ENV !== 'production'
})
```

### createLogger 插件查看提交状态

用这个插件，每次进行 vuex 操作都会在控制台打印日志信息

```js
import { createStore, createLogger } from 'vuex'

const debug = process.env.NODE_ENV !== 'production' // 开发环境进行 debug

export default createStore({
  plugins: debug ? [ createLogger() ] : [] // 开发环境下使用插件
})
```

### mapMutations 与 mapActions

在组件中提交 commit mutation 或分发 dispatch action 需要使用 `this.$store.commit` 或 `this.$store.dispatch`，如果嫌麻烦可以使用 `mapMutations` 和 `mapActions` 将组件中的 methods 映射为 `store.commit` 和 `store.dispatch` 调用

```js
import { mapMutations, mapActions } from 'vuex'
export default {
  methods: {
    ...mapMutations(['someMutation']), // 将 `this.someMutation` 映射为 `this.$store.commit('someMutation')`
    ...mapActions({
      thatAction: 'someAction' // 将 `this.thatAction` 映射为 `this.$store.dispatch('someAction')`
    })
  }
}
```




# vue 相关思考

## Options API 与 Composition API

`Options API` 和 `Composition API` 各有优点，就算是 vue3 也不应该无脑使用 Composition API

Options API 的优点是结构清晰，是一种描述型的结构，适用于逻辑较少的组件，这样看起来非常清晰。就像 SFC 中使用 template 而不使用 render function 一样，给人一种直观的感觉

Composition API 作为 vue3 一种新推出的开发模式，适用于逻辑复杂或逻辑可重用可抽离的场景。vue3.2 推出了 `<script setup>` 听说很香，总之具体场景具体分析，适合的才是最好的
