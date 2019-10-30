import request from '@/utils/request'

export default{
  getList(data) {  //查询
    return request({
      url: 'api/SERVICE-AIP/lightingCentralizedCon/queryLightingCentConPage',
      method: 'post',
      data: data
    })
  },
  doDelete(ids) {  //删除
    return request({
      url: 'api/SERVICE-AIP/lightingCentralizedCon/deleteLightingCentConByIds',
      method: 'post',
      data: ids 
    })
  },
  addOrEdit(data) { //新增编辑
    return request({
      url: 'api/SERVICE-AIP/lightingCentralizedCon/update',
      method: 'put',
      data: data
    })
  },
  queryOne(id) {  //查询单条数据
    return request({
      url: 'api/SERVICE-AIP/centralizedControl/queryById/'+id,
      method: 'get',
    })
  },

  getDeviceTypeCode(){
    return request({
      url: 'api/SERVICE-AIP/lightingCentralizedCon/getDeviceTypeCode',
      method: 'get',
    })
  },

  queryDeviceModel(data) { //获取设备型号下拉框   设备分类(00:灯杆,01:灯,02:单灯控制器,03:集中控制器)
   
    return request({
      url: 'api/SERVICE-AIP/sysDeviceModel/queryDeviceModelByTenderId',
      method: 'post',
      data: data
    })
  },

  queryTenderList(data){  //查询集控器厂家
    return request({
      url: 'api/SERVICE-AIP/sysDeviceTender/queryDeviceTenderList',
      method: 'get',
      params: data
    })
  },
  
  queryRoadOptions(data) { //获取路段下拉框数据
    return request({
        url: 'api/SERVICE-AIP/road/queryList',
        method: 'post',
        data: {projectId:data}
    })
  },
}