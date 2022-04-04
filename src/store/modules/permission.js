// 专门处理权限路由的模块
// 引入静态路由 // 引入所有动态路由
import { constantRoutes, asyncRoutes } from '@/router'
// state是用来显示左侧菜单用的
const state = {
  routes: constantRoutes // 路由表 表示当前用户所拥有的所有路由的数组   用户一开始一定拥有静态路由
}
const mutations = {
  // 定义修改routes的mutations
  setRoute(state, routes) {
    state.routes = [...constantRoutes, ...routes] // 每次要在静态路由的基础之上添加新的路由
  }
}
const actions = {
  // 筛选路由权限
  // 第二个参数为当前用户用于的权限标识
  filteRoutes(context, menus) {
    // routes中保存的是当前用户用于权限的路由数组
    const routes = []
    // 筛选去动态路由中与menus中能对上的路由
    menus.forEach(key => {
      // key就是标识
      // 在动态路由数组中找每一个路由对象中的name属性是否等于key的值，如果找不到就没有权限，如果找到了就筛选出来
      asyncRoutes.forEach(i => {
        if (i.name === key) routes.push(i)
      })
    })
    context.commit('setRoute', routes) // 将筛选出的路由提交给mutations
    return routes // 提交给路由表来动态添加路由
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
