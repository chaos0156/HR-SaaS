import Cookies from 'js-cookie'

const TokenKey = 'hrsass_token'

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
