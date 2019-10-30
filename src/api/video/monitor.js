import request from '@/utils/request'

export default{
  getList(pageNum, pageSize, cameraName) {  //查询
    return request({
      url: '/api/SERVICE-AIP/cameraMonitorGroup/queryMonitorList',
      method: 'post',
      data: {pageNum: pageNum, pageSize: pageSize, cameraName: cameraName}
    })
  },
  addOrEdit(data) { //新增编辑
    return request({
      url: '/api/SERVICE-AIP/cameraMonitorGroup/editCameraMonitorGroup',
      method: 'post',
      data: data
    })
  },
  doDelete(ids) {  //删除
    return request({
      url: '/api/SERVICE-AIP/cameraMonitorGroup/deleteCameraMonitorGroup',
      method: 'post',
      data: {ids: ids} 
    })
  },
}