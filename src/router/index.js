import { createRouter, createWebHashHistory } from 'vue-router'
import Recommend from '@/views/recommend'
import Singer from '@/views/singer'
import TopList from '@/views/top-list'
import Search from '@/views/search'
import SingDetail from '@/views/singer-detail'

const routes = [ 
  {
    path: '/',
    redirect:'/recommend'
  },
  {
    path: '/recommend',
    component: Recommend
  },
  {
    path: '/singer',
    component: Singer,
    children:[
      {
        path:':id',
        component:SingDetail
      }
    ]
  },
  {
    path: '/top-list',
    component: TopList
  },
  {
    path: '/search',
    component: Search
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
