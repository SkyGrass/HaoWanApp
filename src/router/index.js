import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import { constantRouterMap } from './router.config.js'

// hack router push callback
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const createRouter = () =>
  new Router({
    mode: 'history', // 如果你是 history模式 需要配置vue.config.js publicPath
    base: process.env.BASE_URL,
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
  })

const router = createRouter()

router.beforeEach((to, from, next) => {
  store.dispatch('setTargetUrl', '')
  if (to.meta != void 0) {
    if (to.meta.redblue && to.query.redblue == void 0) {
      store.dispatch('setShowRedBlue', to.meta.redblue)
      store.dispatch('setTargetUrl', to.name)
      return false
    } else {
      next()
    }
  }
  if (from.meta.keepAlive) {
    const $content = document.querySelector('.list') // 列表的外层容器
    const scrollTop = $content ? $content.scrollTop : 0
    from.meta.scrollTop = scrollTop
  }
  next()

})

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
