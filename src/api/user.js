import request from '@/utils/request'

// 登录接口封装
export function login(data) {
  // axios发起请求后会返回一个promise对象
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
