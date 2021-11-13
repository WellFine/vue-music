# vue-music

vue 音乐 web app

安装：`npm install`，运行：`npm run serve`

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



## 路由相关

## 路由重定向

首页 `/` 和某个路由如 `/recommend` 展示同一个视图组件时，可以使用 `redirect` 将 `/` 重定向到 `/recommend`

## vue-router 自带 .router-link-active 链接激活 class

vue-router 自带了 `.router-link-active` 这个 active-class，用于 `router-link` 在选中激活时方便的设置样式



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





# vue 相关思考

## Options API 与 Composition API

`Options API` 和 `Composition API` 各有优点，就算是 vue3 也不应该无脑使用 Composition API

Options API 的优点是结构清晰，是一种描述型的结构，适用于逻辑较少的组件，这样看起来非常清晰。就像 SFC 中使用 template 而不使用 render function 一样，给人一种直观的感觉

Composition API 作为 vue3 一种新推出的开发模式，适用于逻辑复杂或逻辑可重用可抽离的场景。vue3.2 推出了 `<script setup>` 听说很香，总之具体场景具体分析，适合的才是最好的












