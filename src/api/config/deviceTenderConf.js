import request from '@/utils/request'

export default{

  getList(pageNum,pageSize) {  //查询
    return request({
      // url: 'api/SERVICE-AIP/deviceTender/queryPage',
      url: 'api/SERVICE-AIP/sysDeviceTender/queryPage',
      method: 'post',
      data: {pageNum: pageNum,pageSize: pageSize}
    })
  },
  
  doDelete(ids) {  //删除
    return request({
      // url: 'api/SERVICE-AIP/deviceTender/deleteByIdList',
      url: 'api/SERVICE-AIP/sysDeviceTender/deleteDeviceTenderByIds',
      method: 'post',
      data: ids 
    })
  },
  
  addOrEdit(data) { //新增编辑
    return request({
      // url: 'api/SERVICE-AIP/deviceTender/update',
      url: 'api/SERVICE-AIP/sysDeviceTender/update',
      method: 'put',
      data: data
    })
  },
}

