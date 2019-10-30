import request from '@/utils/request'
import qs from 'qs'

export default{
  getList(data){ //获取任务列表
    return request({
      url: '/api/SERVICE-AIP/wifiConnectData/queryConnData',
      method: 'post',
      data: {dayAmount: '14'}
    })
  },
  getWifiConfigQuery(pageNum, pageSize,searchInfo, projectId) {  //查询
    return request({
      url: '/api/SERVICE-AIP/wifi/queryPage',
      method: 'post',
      data: {pageNum: pageNum, pageSize: pageSize, searchInfo: searchInfo, projectId: projectId}
    })
  },
  addOrEdit(data) { //新增编辑
    return request({
      url: '/api/SERVICE-AIP/wifi/update',
      method: 'put',
      data: data
    })
  },
  getItem(id) {  //查询单条记录
    return request({
      url: '/api/SERVICE-AIP/wifi/queryOne',
      method: 'post',
      data: {rowId: id}
    })
  },
  doDelete(ids) {  //删除
    return request({
      url: '/api/SERVICE-AIP/wifi/delete/',
      method: 'delete',
      data: {ids: ids} 
    })
  },
}