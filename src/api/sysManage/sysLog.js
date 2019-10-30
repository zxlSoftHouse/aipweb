import request from '@/utils/request'

export default{
    
    // 获取系统日志
    getSysLogList(data) { //新增或修改
      return request({
        url: '/api/SERVICE-AUTH/log/queryPage',
        method: 'post',
        data: data
      })
    }
}