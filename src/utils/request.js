import axios from 'axios'
import { Message } from 'element-ui'
const service = axios.create({
  // 执行 npm run dev时，从.env.development中找到VUE_APP_BASE_API==/api，触发跨域
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 设置超时时间，单位时毫秒
})
service.interceptors.request.use()
// 封装响应拦截器
service.interceptors.response.use(function(response) {
  const { data, success, message } = response.data
  if (success) {
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, function(error) {
  Message.error(error.message)
  // 要返回一个失败状态的promise，进入catch()，而不在进入then()
  return Promise.reject(error)
  // $message所有带$的属性都只可以在组件中调用，这些属性都是Vue的原型方法。
})
// login().then().catch()
export default service
