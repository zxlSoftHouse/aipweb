import request from '@/utils/request'

export default{

  getList(data) {  //查询
    return request({
      url: '/api/SERVICE-AIP/callHelpDevice/queryCallHelpDeviceList',
      method: 'post',
      data: data
    })
  },

  getItem(id) {  //查询单条记录
    return request({
      url: '/api/SERVICE-AIP/callHelpDevice/queryByRowId',
      method: 'post',
      data: {rowId: id}
    })
  },
  
  doDelete(ids) {  //删除
    return request({
      url: '/api/SERVICE-AIP/callHelpDevice/deleteCallHelpDevice',
      method: 'post',
      data: {ids: ids} 
    })
  },
  
  addOrEdit(data) { //新增编辑
    return request({
      url: '/api/SERVICE-AIP/callHelpDevice/update',
      method: 'put',
      data: data
    })
  },

  getLampPostInfo() { //查询灯杠
    return request({
      url: '/api/SERVICE-AIP/sysLampPost/queryLampPostList',
      method: 'post',
      data: {}
    })
  },

  getDeviceTypeCode() { //查询一键报警设备分类编号
    return request({
      url: '/api/SERVICE-AIP/callHelpDevice/getDeviceTypeCode',
      method: 'get',
      data: {}
    })
  },

  //获取设备厂家
  getTenderInfo(data) {
    return request({
      url: '/api/SERVICE-AIP/sysDeviceTender/queryDeviceTenderList',
      method: 'get',
      params: data
    })
  },

  //获取设备型号
  queryDeviceModel(data) { //获取设备型号下拉框   设备分类(00:灯杆,01:灯,02:单灯控制器,03:集中控制器  06一键报警)
    return request({
        url: 'api/SERVICE-AIP/sysDeviceModel/queryDeviceModelByTenderId',
        method: 'post',
        data: data
    })
  },

  //获取报警记录
  getAlarmLogList(data){
    return request({
      url: 'api/SERVICE-AIP/callHelpData/queryCallHelpDataPage',
      method: 'post',
      data: data
    })
  },
  //OCX控件下载
  downloadOcx() { 
    return request({
        url: 'api/SERVICE-AIP/callHelpDevice/downloadPlug',
        method: 'get',
        responseType:"blob"
    })
  },
}