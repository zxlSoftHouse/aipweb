import request from '@/utils/request'

export default{

  getList(pageNum,pageSize){
    return request({
      url: 'api/SERVICE-AIP/ledItem/queryItemPage',
      method: 'post',
      data: {pageNum: pageNum,pageSize: pageSize}
    })
  },

  getSrcList(pageNum,pageSize,fileType) {  //查询
    return request({
      url: 'api/SERVICE-AIP/ledResource/queryResourcePage',
      method: 'post',
      data: {pageNum: pageNum,pageSize: pageSize,fileType:fileType}
    })
  },
  
  doDelete(id) {  //删除
    return request({
      url: 'api/SERVICE-AIP/ledItem/deleteLEDItem',
      method: 'post',
      data: {id:id}
    })
  },
  
  addOrEdit(data) { //新增编辑
    return request({
      url: 'api/SERVICE-AIP/ledItem/updateLEDItem',
      method: 'post',
      data: data
    })
  },

  getItem(ledItemId) { //按id查一条
    return request({
      url: 'api/SERVICE-AIP/ledItem/getLEDItem',
      method: 'get',
      params: {ledItemId:ledItemId}
    })
  },
  


}

