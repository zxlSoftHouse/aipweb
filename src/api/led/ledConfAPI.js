import request from '@/utils/request'

export default{

  getList(pageNum,pageSize) {  //查询
    return request({
      url: 'api/SERVICE-AIP/ledScreen/queryPage',
      method: 'post',
      data: {pageNum: pageNum,pageSize: pageSize}
    })
  },

  getItem(id) {  //查询单条记录
    return request({
      url: '/api/SERVICE-AIP/ledScreen/queryById/'+id,
      method: 'get',
    })
  },
  
  doDelete(ids) {  //删除
    return request({
      url: 'api/SERVICE-AIP/ledScreen/deleteLEDScreen',
      method: 'post',
      data: ids 
    })
  },
  
  addOrEdit(data) { //新增编辑
    return request({
      url: 'api/SERVICE-AIP/ledScreen/update',
      method: 'put',
      data: data
    })
  },

  queryScreenInfo(idList, actionType) {
    return request({
      url:'api/SERVICE-AIP/ledScreen/queryScreenInfo',
      method:'post', 
      data: {idList: idList, actionType: actionType}
    })
  },

  getScreenInfo(idList, actionType) {
    return request({
      url:'api/SERVICE-AIP/ledScreen/queryScreenInfo',
      method:'post', 
      data: {idList: idList, actionType: actionType}
    })
  },

  ctrlScreen(idList, actionType, arg1) {
    return request({
      url: "api/SERVICE-AIP/ledScreen/screesnControl",
      method: "post",
      data: {idList: idList, actionType: actionType, arg1: arg1}
    })
  },

  // 实时消息
  ctrlRealTimeMsg(data) {
    return request({
      url: "api/SERVICE-AIP/ledScreen/invokeBuildInJs",
      method: "post",
      data: data
    })
  },

  // 同步设置
  ctrlSyncSet(data) {
    return request({
      url: "api/SERVICE-AIP/ledScreen/setTimeSync",
      method: "post",
      data: data
    })
  },

  getDeviceTypeCode () {
    return request({
      url: '/api/SERVICE-AIP/ledScreen/getDeviceTypeCode',
      method: 'get',
      data: {}
    })
  },

  getTenderInfo(deviceType){  //获取厂家下拉信息
    return request({
      url:'api/SERVICE-AIP/sysDeviceTender/queryDeviceTenderList',
      method:'get', 
      params: {deviceType: deviceType}
    })
  },

  ledCtrl(ip, data) {
    return request({
      url: "ledapi/command/"+ip,
      method: "post",
      data: data
    })
  },
}

