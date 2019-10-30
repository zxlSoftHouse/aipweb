import request from '@/utils/request'

export default{

  getList(pageNum, pageSize, cameraName, storageType, projectId) {  //查询
    return request({
      url: '/api/SERVICE-AIP/camera/queryCameraList',
      method: 'post',
      data: {pageNum: pageNum, pageSize: pageSize, cameraName: cameraName, storageType: storageType, projectId: projectId}
    })
  },

  getNVRList(nvr) {
    return request({
      url: '/api/SERVICE-AIP/camera/queryList',
      method: 'post',
      data: {nvr: nvr}
    })
  },

  getItem(id) {  //查询单条记录
    return request({
      url: '/api/SERVICE-AIP/camera/queryByRowId',
      method: 'post',
      data: {rowId: id}
    })
  },
  
  doDelete(ids) {  //删除
    return request({
      url: '/api/SERVICE-AIP/camera/deleteCamera',
      method: 'post',
      data: {ids: ids} 
    })
  },
  
  addOrEdit(data) { //新增编辑
    return request({
      url: '/api/SERVICE-AIP/camera/editCamera',
      method: 'post',
      data: data
    })
  },

  batchEdit(data) { //批量新增编辑
    return request({
      url: '/api/SERVICE-AIP/camera/bushEditCamera',
      method: 'post',
      data: data
    })
  },

  getTenderInfo() {
    return request({
      url: '/api/SERVICE-AIP/deviceTender/queryList',
      method: 'post',
      data: {deviceType: '07'}
    })
  },

  getLiveUrl(accessToken, deviceSerial) {
    return request({
      url: '/hkvsapi/api/lapp/live/video/list',
      method: 'post',
      params: {accessToken: accessToken, deviceSerial: deviceSerial}
    })
  }
}