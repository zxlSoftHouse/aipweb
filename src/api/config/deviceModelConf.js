import request from '@/utils/request'

export default{

  getList(data) {  //查询
    return request({
      url: 'api/SERVICE-AIP/sysDeviceModel/queryDeviceModelPage',
      method: 'post',
      data:data
    })
  },
  
  doDelete(ids) {  //删除
    return request({
      url: 'api/SERVICE-AIP/sysDeviceModel/deleteDeviceModelByIds/',
      method: 'post',
      data: ids
    })
  },
  
  update(data) { //新增
    return request({
      url: 'api/SERVICE-AIP/sysDeviceModel/update',
      method: 'put',
      data: data
    })
  },
  
  queryDeviceParams(deviceModelId) { //查询设备参数
    return request({
      url: 'api/SERVICE-AIP/deviceModel/queryDeviceModel',
      method: 'get',
      params: {deviceModelId:deviceModelId}
    })
  },

  edit(data){  //更新
    return request({
      url: 'api/SERVICE-AIP/deviceModel/updateDeviceModel',
      method: 'post',
      data: data
    })
  },

  checkDeviceBinding(data){  //检查设备是否被绑定
    return request({
      url: 'api/SERVICE-AIP/deviceModel/checkDeviceBinding',
      method: 'post',
      data: data
    })
  },
  queryDeviceTenderList(){ //3. 获取设备厂家
    return request( {
        url:'api/SERVICE-AIP/sysDeviceTender/queryDeviceTenderList', 
        method:'get', 
        data: {}
    })
  }
}

