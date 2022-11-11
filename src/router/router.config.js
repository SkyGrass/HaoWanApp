import Home from '@/views/home'
import SubHome from '@/views/home/subIndex'

/**
 * 基础路由
 * @type { *[] }
 */
const routerMap = [
  {
    path: '/',
    component: Home,
    redirect: '/home',
    meta: { title: '主页', keepAlive: false }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { title: '主页', keepAlive: false }
  },
  {
    path: '/subhome',
    name: 'SubHome',
    component: SubHome,
    meta: { title: '主页', keepAlive: false }
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

const dynamicRouterMap = [
  {
    path: '/xx',
    name: 'xx',
    component: () => import('@/views/xx'),
    meta: {
      title: '下线采集',
      redblue: false,
      keepAlive: false
    }
  },
  {
    path: '/xx_form',
    name: 'xx_form',
    component: () => import('@/views/xx/form'),
    meta: {
      title: '下线采集',
      redblue: false,
      keepAlive: false
    }
  },
  {
    path: '/xx_form_cancel',
    name: 'xx_form_cancel',
    component: () => import('@/views/xx/form_cancel'),
    meta: {
      title: '下线采集取消',
      redblue: false,
      keepAlive: false,
    }
  },
  {
    path: '/qc_form',
    name: 'qc_form',
    component: () => import('@/views/qc/form'),
    meta: {
      title: '质检采集',
      redblue: false,
      keepAlive: false
    }
  },
  {
    path: '/qc_form_cancel',
    name: 'qc_form_cancel',
    component: () => import('@/views/qc/form_cancel'),
    meta: {
      title: '质检采集取消',
      redblue: false,
      keepAlive: false,
    }
  },
  {
    path: '/pin_form',
    name: 'pin_form',
    component: () => import('@/views/pin/form'),
    meta: {
      title: '产成品入库',
      redblue: true,
      keepAlive: false
    }
  },
  {
    path: '/so',
    name: 'so',
    component: () => import('@/views/so'),
    meta: {
      title: '销售出库',
      redblue: true,
      keepAlive: false
    }
  },
  {
    path: '/so_form',
    name: 'so_form',
    component: () => import('@/views/so/form'),
    meta: {
      title: '销售出库',
      keepAlive: false
    }
  },
  {
    path: '/stock',
    name: 'stock',
    component: () => import('@/views/stock'),
    meta: {
      title: '库存查询',
      redblue: false,
      keepAlive: false
    }
  }
]

export const constantRouterMap = routerMap.concat(dynamicRouterMap)
