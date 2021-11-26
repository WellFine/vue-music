import { createRouter, createWebHashHistory } from 'vue-router'

import Recommend from '@/views/recommend'
import Album from '@/views/album'
import Singer from '@/views/singer'
import SingerDetail from '@/views/singer-detail'
import TopList from '@/views/top-list'
import TopDetail from '@/views/top-detail'
import Search from '@/views/search'

const routes = [
  {
    path: '/',
    // 路径为 / 时重定向到 /recommend
    redirect: '/recommend'
  }, {
    path: '/recommend',
    component: Recommend,
    children: [{ path: ':id', component: Album }]
  }, {
    path: '/singer',
    component: Singer,
    children: [{ path: ':id', component: SingerDetail }]
  }, {
    path: '/top-list',
    component: TopList,
    children: [{ path: ':id', component: TopDetail }]
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
