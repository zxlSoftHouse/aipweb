import request from '@/utils/request'

export default{

  getList(pageNum, pageSize, sensorName) {  //查询
    return request({
      url: '/api/SERVICE-AIP/sensorManage/queryPage',
      method: 'post',
      data: {pageNum: pageNum, pageSize: pageSize, sensorName: sensorName}
    })
  },

  getSensor() {  //查询
    return request({
      url: '/api/SERVICE-AIP/sensorManage/queryList',
      method: 'post',
      data: {}
    })
  },

  getItem(id) {  //查询单条记录
    return request({
      url: '/api/SERVICE-AIP/sensorManage/queryOne',
      method: 'post',
      data: {rowId: id}
    })
  },

  doDelete(ids) {  //删除
    return request({
      url: '/api/SERVICE-AIP/sensorManage/deleteSensorManage',
      method: 'post',
      data: {ids: ids} 
    })
  },
  
  addOrEdit(data) { //新增编辑
    return request({
      url: '/api/SERVICE-AIP/sensorManage/update',
      method: 'put',
      data: data
    })
  },

  getLampPostInfo() {
    return request({
      url: '/api/SERVICE-AIP/lampPost/queryList',
      method: 'post',
      data: {}
    })
  },

  getDeviceTypeCode () {
    return request({
      url: '/api/SERVICE-AIP/sensorManage/getDeviceTypeCode',
      method: 'get',
      data: {}
    })
  },

  getTenderInfo(deviceType) {
    return request({
      url:'api/SERVICE-AIP/sysDeviceTender/queryDeviceTenderList',
      method:'get', 
      params: {deviceType: deviceType}
    })
  },

  getSensorModel(deviceType, tenderId) {
    return request({
      url: '/api/SERVICE-AIP/sysDeviceModel/queryDeviceModelByTenderId',
      method: 'post',
      data: {deviceType: deviceType, tenderId: tenderId}
    })
  }
}