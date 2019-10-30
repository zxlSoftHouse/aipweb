import request from '@/utils/request'

export default{

  getList(pageNum,pageSize) {  //查询
    return request({
      url: 'api/SERVICE-AIP/ledResource/queryPage',
      method: 'post',
      data: {pageNum: pageNum,pageSize: pageSize}
    })
  },
  
  doDelete(ids) {  //删除
    return request({
      url: 'api/SERVICE-AIP/ledResource/deleteResource',
      method: 'post',
      data: ids 
    })
  },
  
  ledResourceShow(id){
    return request({
      url: 'api/SERVICE-AIP/ledResource/public/ledResourceShow',
      method: 'get',
      params: {idStr:id}
    })
  },

  ledResourceDownload(id){
    return request({
      url: 'api/SERVICE-AIP/ledResource/resource/ledResourceDownload',
      method: 'get',
      params: {id:id},      
      responseType:"blob"
    })
  },
  
}

