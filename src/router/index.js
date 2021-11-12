import { createRouter, createWebHashHistory } from 'vue-router'

import Recommend from '@/views/recommend'
import Singer from '@/views/singer'
import TopList from '@/views/top-list'
import Search from '@/views/search'

const routes = [
  {
    path: '/',
    // 路径为 / 时重定向到 /recommend
    redirect: '/recommend'
  }, {
    path: '/recommend',
    component: Recommend
  }, {
    path: '/singer',
    component: Singer
  }, {
    path: '/top-list',
    component: TopList
  }, {
    path: '/search',
    component: Search
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
