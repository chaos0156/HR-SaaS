import Cookies from 'js-cookie'

const TokenKey = 'hrsass_token'
const TimeKey = 'hrsass_timestamp'
// 获取token
export function getToken() {
  return Cookies.get(TokenKey)
}

// 设置token
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// 删除token
export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 设置时间戳
export function setTimeStamp() {
  return Cookies.set(TimeKey, Date.now())
}

// 读取时间戳
export function getTimeStamp() {
  return Cookies.get(TimeKey)
}
