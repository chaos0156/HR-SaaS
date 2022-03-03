// 引入对本地缓存处理的API
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
// 引入发起登录请求，异步获取token的API
import { login, getUserBasicInfo, getEmployeeBasicInfo } from '@/api/user'

const state = {
  token: getToken(), // 存放token。在初始化时，先从本地缓存中读取token
  userBasicInfo: {} // 存放用户基本信息，不可以将初始值设置为null，要在全局getters中暴露信息
}

const mutations = {
  setToken(state, token) {
    // 修改本地缓存中的token
    setToken(token)
    // 修改vuex中的token
    state.token = token
  },
  removeToken(state) {
    // 删除本地缓存中的token，与vuex中的token
    removeToken()
    state.token = null
  },
  // 修改用户基本信息
  setUserBasicInfo(state, payload) {
    state.userBasicInfo = { ...payload }
  },
  // 删除用户基本信息
  removeUserBasicInfo(state) {
    state.userBasicInfo = {}
  }
}

const actions = {
  async login(context, data) {
    const res = await login(data)
    // 获取到token后立即存时间戳
    setTimeStamp()
    // 将token传递给mutations
    context.commit('setToken', res)
  },
  async getUserBasicInfo(context) {
    const res = await getUserBasicInfo()
    // 在确定获取用户ID后，获取用户的头像
    const baseInfo = await getEmployeeBasicInfo(res.userId)
    // 将两个接口获取的数据进行合并之后交给mutation，修改state
    context.commit('setUserBasicInfo', { ...res, ...baseInfo })
    // return为后期做权限的时候留下伏笔
    return res
  },
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户基本资料
    context.commit('removeUserBasicInfo')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

