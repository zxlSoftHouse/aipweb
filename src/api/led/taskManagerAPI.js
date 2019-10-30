import request from '@/utils/request'

export default{

  getList(pageNum,pageSize){ //获取任务列表
    return request({
      url: 'api/SERVICE-AIP/ledTask/queryTaskPage',
      method: 'post',
      data: {pageNum: pageNum,pageSize: pageSize}
    })
  },

  doDelete(id) {  //删除
    return request({
      url: 'api/SERVICE-AIP/ledTask/deleteLEDTask',
      method: 'post',
      data: {id:id}
    })
  },
  
  addOrEdit(data) { //新增编辑
    return request({
      url: 'api/SERVICE-AIP/ledTask/updateLEDTask',
      method: 'post',
      data: data
    })
  },

  getItem(ledTaskId) { //按id查一条
    return request({
      url: 'api/SERVICE-AIP/ledTask/getLEDTask',
      method: 'get',
      params: {ledTaskId:ledTaskId}
    })
  },

  getLedList(filter){//根据条件查询led屏幕
    return request({
      url: 'api/SERVICE-AIP/ledScreen/queryPage',
      method: 'post',
      data: {pageNum: filter.pageNum,pageSize: filter.pageSize}
    })
  },

  getTaskDetail(ledTaskId){  //获取任务详细信息
    return request({
      url: 'api/SERVICE-AIP/ledTask/getLEDTaskHttpJson',
      method: 'GET',
      params: {ledTaskId:ledTaskId}
    })
  },

  sendTask(screenId, ledTaskId){  //发送任务
    return request({
      url: "api/SERVICE-AIP/ledScreen/setTaskToScreen",
      method: "post",
      data:{
        screenId: screenId,
        ledTaskId: ledTaskId,
      }
    })
  }

  // sendTask(controllerId,preDownloadURL,downloadProgressUri,task){  //发送任务
  //   return request({
  //     url: "ledapi/command/"+controllerId,
  //     method: "post",
  //     data:{
  //       type: "commandXixunPlayer",
  //       _id: "28dc5b76-51c9-11e9-9b24-4ccc6a85f6dc",
  //       command: {
  //         _type: "PlayXixunTask",
  //         id: "28dd5a80-51c9-11e9-9b24-4ccc6a95f6dc",
  //         preDownloadURL: preDownloadURL,
  //         notificationURL: downloadProgressUri,
  //         task:task
  //       }
  //     }
  //   })
  // }
}

