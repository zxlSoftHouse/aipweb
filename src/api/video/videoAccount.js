import request from '@/utils/request'

export default{
  getOne(data) {
    return request({
      url: '/api/SERVICE-AIP/cameraAccount/queryOne',
      method: 'post',
      data: data
    })
  },

  addOrEdit(data) { //新增编辑
    return request({
      url: '/api/SERVICE-AIP/cameraAccount/update',
      method: 'put',
      data: data
    })
  },

  getToken(data) {
    return request({
      url: '/api/SERVICE-AIP/cameraAccount/getAccessToken',
      method: 'post',
      data: data
    })
  }

}