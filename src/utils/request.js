import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from './auth'
import router from '@/router'

const Timeout = 4800 // 定义超时时间 单位是秒
function checkTime() {
  const endTime = Date.now()
  const startTime = getTimeStamp()
  return (endTime - startTime) / 1000 >= Timeout
}

const service = axios.create({
  // 执行 npm run dev时，从.env.development中找到VUE_APP_BASE_API==/api，触发跨域
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 设置超时时间，单位时毫秒
})
// 封装请求拦截器：将axios请求中注入token
service.interceptors.request.use(function(config) {
  // config是请求的配置信息，这个config无论合适都有return回去。
  // 注入token
  if (store.getters.token) {
    // 只有在有token的情况下，在判断token是否超时
    if (!checkTime()) {
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    } else {
      // token过期后，删除token和用户基本资料。
      store.dispatch('user/logout')
      // 跳转至登录界面
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
  }
  // 必须return config
  return config
}, function(error) {
  Message.error(error.message)
  return Promise.reject(error)
})
// 封装响应拦截器：将axios返回的数据进行判断是否成功以及对数据进行解构。
service.interceptors.response.use(function(response) {
  const { data, success, message } = response.data
  if (success) {
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, function(error) {
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当等于10002的时候 表示 后端告诉我token超时了
    // token过期后，删除token和用户基本资料。
    store.dispatch('user/logout')
    // 跳转至登录界面
    router.push('/login')
  } else {
    Message.error(error.message)
  }
  // axios会返回一个promise对象
  // 要返回一个失败状态的promise，进入catch()，而不在进入then()
  // login().then().catch()或者是使用async/await时进入trt/catch的catch中
  return Promise.reject(error)
  // $message所有带$的属性都只可以在组件中调用，这些属性都是Vue的原型方法。
})
export default service
