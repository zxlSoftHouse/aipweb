import request from '@/utils/request'

export default{
  getList(pageNum,pageSize){ //获取任务列表
    return request({
      url: 'api/SERVICE-AIP/ledTaskHisData/queryTaskHisData',
      method: 'post',
      data: {pageNum: pageNum,pageSize: pageSize}
    })
  }
}

