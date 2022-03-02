const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // 暴露token，任意组件快速访问token
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name
}
export default getters
