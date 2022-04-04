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

// 获取用户基本资料接口
export function getUserBasicInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

// 根据员工id，获取员工基本信息【用来获取头像】
export function getEmployeeBasicInfo(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

// 登出
export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

/** **
 *
 * 根据用户id获取用户的详情
 * ****/
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
