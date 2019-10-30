import request from '@/utils/request'

export default{

  getList(pageNum,pageSize,projectName,projectId) {  //查询
    return request({
      url: 'api/SERVICE-AIP/project/queryPageProject',
      method: 'post',
      data: {pageNum: pageNum,pageSize: pageSize,projectName:projectName}
    })
  },

  queryList() {  //查询
    return request({
      url: 'api/SERVICE-AIP/project/queryList',
      method: 'post',
      data: {}
    })
  },
  
  doDelete(ids) {  //删除
    return request({
      url: 'api/SERVICE-AIP/project/deleteByIdList',
      method: 'post',
      data: ids 
    })
  },
  
  addOrEdit(data) { //新增编辑
    return request({
      url: 'api/SERVICE-AIP/project/update',
      method: 'put',
      data: data
    })
  },
  bindPro(data) { //绑定项目 （切换项目时）
    return request({
      url: 'api/SERVICE-AIP/project/bindProject',
      method: 'post',
      data: data
    })
  }
}