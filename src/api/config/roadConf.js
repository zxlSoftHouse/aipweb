import request from '@/utils/request'

export default{

  getList(pageNum,pageSize,projectId) {  //查询
    return request({
      url: 'api/SERVICE-AIP/road/queryPage',
      method: 'post',
      data: {pageNum: pageNum,pageSize: pageSize, projectId:projectId}
    })
  },
  
  doDelete(ids) {  //删除
    return request({
      url: 'api/SERVICE-AIP/road/deleteByIdList',
      method: 'post',
      data: ids 
    })
  },
  
  addOrEdit(data) { //新增编辑
    return request({
      url: 'api/SERVICE-AIP/road/update',
      method: 'put',
      data: data
    })
  },
  
  getProjectOptions(){  //获取项目下拉框信息
      return request({
          url: 'api/SERVICE-AIP/project/queryList',
          method: 'post',
          data: {}
      })
  }
}

