const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  // visitedViews: state => state.app.visitedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  resource: state => state.user.resource,
  setting: state => state.user.setting,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  headerMenu: state => state.permission.headerMenu,
  alarmInfo: state => state.alarm.alarmInfo,
  websocketData: state => state.websock.websocketData,
  deviceType: state => state.baseData.deviceType,
  lampList: state => state.baseData.lampList
}
export default getters
