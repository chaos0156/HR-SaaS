const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // 暴露token，任意组件快速访问token
  token: state => state.user.token,
  // 快速获取用户头像
  avatar: state => state.user.userBasicInfo.staffPhoto,
  // 快速访问用户名
  name: state => state.user.userBasicInfo.username,
  userId: state => state.user.userBasicInfo.userId
}
export default getters
