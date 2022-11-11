//  进度条引入设置如上面第一种描述一样
import router from './router'
import store from './store'
import { getToken } from '@/utils/auth' // get token from cookie
import { getAsyncRoutes } from '@/utils/asyncRouter'
import { getMenu } from './api/home'

const whiteList = ['/login']
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  // 获取用户token，用来判断当前用户是否登录
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // debugger
      //异步获取store中的路由
      let route = store.getters.addRoutes
      const hasRouters = route && route.length > 0
      //判断store中是否有路由，若有，进行下一步
      if (hasRouters) {
        next()
      } else {
        //store中没有路由，则需要获取获取异步路由，并进行格式化处理
        try {
          getMenu().then(({ Data }) => {
            const accessRoutes = getAsyncRoutes(
              Data.map(m => {
                return {
                  path: m.FUrl,
                  component: m.FFileUrl,
                  redirect: 'noRedirect',
                  name: m.FName,
                  meta: {
                    title: m.FName,
                    keepAlive: true,
                    scrollTop: 0
                  }
                }
              })
            )
            store.dispatch('setMenus', accessRoutes)
            // 动态添加格式化过的路由
            accessRoutes.forEach(route => {
              router.addRoute(route)
            })
            next({ ...to, replace: true })
          })
        } catch (error) {
          // Message.error('出错了')
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})
