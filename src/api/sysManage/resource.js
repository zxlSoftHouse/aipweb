import request from '@/utils/request'

export default {
  getResourcePageLsit(queryList) { //获取带有分页的资源列表
    return request({
      url: '/api/SERVICE-AUTH/resource/queryPage',
      method: 'post',
      data: queryList
    })
  },

  saveAddOrUpdate(data) { //资源新增或修改
    return request({
      url: '/api/SERVICE-AUTH/resource/update',
      method: 'put',
      data: data
    })
  },

  delResourceRow(resouceId) { //资源删除
    return request({
      url: '/api/SERVICE-AUTH/resource/delete/'+resouceId, 
      method: 'delete'
    })
  },

  getResourceHasRole(resourceId) { //查询资源已有的角色
    return request({
      url: '/api/SERVICE-AUTH/role/resource/queryList',
      method: 'post',
      data: {resourceId: resourceId}
    })
  },

  saveByResourceId(data) { //将资源赋给多个角色
    return request({
      url: '/api/SERVICE-AUTH//role/resource/saveByResourceId/'+data.resourceId,
      method: 'post',
      data: data.roleIds
    })
  } 
}

