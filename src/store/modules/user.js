// 引入对本地缓存处理的API
import { getToken, setToken, removeToken } from '@/utils/auth'
// 引入发起登录请求，异步获取token的API
import { login } from '@/api/user'
// 存放token。在初始化时，先从本地缓存中读取token
const state = {
  token: getToken()
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
  }
}

const actions = {
  async login(context, data) {
    const res = await login(data)
    // 将token传递给mutations
    context.commit('setToken', res)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

