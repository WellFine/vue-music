import { createStore, createLogger } from 'vuex'
import state from './state'
import * as getters from './getters'
import mutations from './mutations'
import * as actions from './actions'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  state,
  getters,
  mutations,
  actions,
  strict: debug, // 开发环境下开启严格模式
  plugins: debug ? [createLogger()] : [] // 开发环境下使用 createLogger 插件查看提交状态
})
