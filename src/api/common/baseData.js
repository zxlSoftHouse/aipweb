import request from '@/utils/request'

export default {
  getdeviceType() {//1. 获取设备类型
    return request( {
      url:'api/SERVICE-AIP/sysDeviceModel/getDeviceTypeMap', 
      method:'get', 
      data: {}
    })
  },
  getLampList(data){ //2. 灯杆列表 入参：projectId-项目ID, roadId-路段ID
    return request( {
        url:'api/SERVICE-AIP/sysLampPost/queryLampPostList', 
        method:'post', 
        data: data
    })
  }
}

