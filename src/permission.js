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
        await store.dispatch('user/getUserBasicInfo')
        // 如果后续要执行的代码中 需要根据用户的基本资料的话，这里必须改成同步，添加await
      }
      // 如果不是访问登陆页面直接放行
      next()
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
