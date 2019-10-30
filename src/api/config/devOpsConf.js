import request from '@/utils/request'

export default{

  getList(data) {  //查询
    return request({
      url: 'api/SERVICE-AIP/alarmNotice/queryPage',
      method: 'post',
      data: data
    })
  },

  getItem(id) {  //查询单条记录
    return request({
      url: '/api/SERVICE-AIP/alarmNotice/queryById/' + id,
      method: 'get'
    })
  },
  
  doDelete(ids) {  //删除
    return request({
      url: 'api/SERVICE-AIP/alarmNotice/deleteAlarmUser',
      method: 'post',
      data: ids 
    })
  },
  
  addOrEdit(data) { //新增编辑
    return request({
      url: 'api/SERVICE-AIP/alarmNotice/update',
      method: 'put',
      data: data
    })
  }
}