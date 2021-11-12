/**
 * vue-cli 已经对 webpack 进行了一层封装，内部已经有 webpack.config.js 文件
 * vue.config.js 就是 vue-cli 脚手架提供的可以修改 webpack 配置的入口文件
 */
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        /**
         * 全局引入 variable 变量和 mixin 混入函数
         * 因为 variable 变量和 mixin 函数都不是实体的样式，而是类似一种定义，是给 sass 用的，所以在 main.js 引入是没有意义的
         * 在 sass-loader 这里进行全局配置，全局引入后在编译阶段就知道全局变量和 mixin 是在哪里定义的
         *
         * Vue Loader 官方说明：sass-loader 也支持一个 additionalData 选项，这个选项允许你在所有被处理的文件之间共享常见的变量，而不需要显式地导入它们
         */
        additionalData: `
          @import "@/assets/scss/variable.scss";
          @import "@/assets/scss/mixin.scss";
        `
      }
    }
  }
}
