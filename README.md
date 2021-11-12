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

## 路由相关

## 路由重定向

首页 `/` 和某个路由如 `/recommend` 展示同一个视图组件时，可以使用 `redirect` 将 `/` 重定向到 `/recommend`

## vue-router 自带 .router-link-active 链接激活 class

vue-router 自带了 `.router-link-active` 这个 active-class，用于 `router-link` 在选中激活时方便的设置样式


















