// vue-router通过提供导航守卫，来管理路由跳转(权限拦截)
import router from './router'
// 引入store实例(this.$store)，来判断其中token的值是否存在
import store from './store'
// 引入进度条
import NProgress from 'nprogress' // progress bar
// 引入进度条样式
import 'nprogress/nprogress.css' // progress bar style

// 定义一个白名单
const whiteList = ['/login', '/404'] // no redirect whitelist

// next是前置守卫必须执行的钩子函数，如果不执行，页面不会跳转
// next() 放过通行
// next(false) 跳转终止
// next(地址) 跳转到某个地址
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  if (store.getters.token) {
    // 有token
    if (to.path === '/login') {
      // 访问登录页面的话
      next('/')
    } else {
      if (!store.getters.userId) {
        const { roles: { menus }} = await store.dispatch('user/getUserBasicInfo')
        // 如果后续要执行的代码中 需要根据用户的基本资料的话，这里必须改成同步，添加await
        // 获取筛选用户的路由权限，添加到路由表中
        const routes = await store.dispatch('permission/filteRoutes', menus)
        // 添加到路由表中
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // 添加到路由表
        // 添加完动态路由之后
        // addRoutes  必须 用 next(地址) 不能用next()
        next(to.path) // 相当于跳到对应的地址  相当于多做一次跳转 为什么要多做一次跳转
        // 进门了，但是进门之后我要去的地方的路还没有铺好，
        // 直接走，掉坑里，多做一次跳转，再从门外往里进一次，跳转之前 把路铺好，再次进来的时候，路就铺好了
      } else {
        // 如果不是访问登陆页面直接放行
        next()
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      // 如果访问的是白名单上的地址,则直接放过通行
      next()
    } else {
      next('/login')
    }
  }
  NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})
// 后置路由
router.afterEach(() => {
  // finish progress bar
  // 关闭进度条
  NProgress.done()
})
