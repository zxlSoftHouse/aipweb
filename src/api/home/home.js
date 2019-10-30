import request from '@/utils/request'

export default{
  getData() {  //查询
    return request({
      url: 'api/SERVICE-AIP/aipIndex/getIndexData',
      method: 'get'
    })
  }
}