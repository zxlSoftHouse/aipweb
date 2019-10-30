import request from '@/utils/request'

export default{
  getList(pageNum,pageSize) {  //查询
    return request({
      url: 'api/SERVICE-AIP/lightingCentralizedCon/queryLightingCentConPage',
      method: 'post',
      data: {pageNum: pageNum,pageSize: pageSize}
    })
  },
}