import request from '@/utils/request'
import qs from 'qs'

export default{
  addjob(info) {//新增任务
    return request({
      url: '/api/SERVICE-SCHEDULER/job/addjob/',
      method: 'post',
      params: info
    })
  },
  
  deletejob(info) { //删除任务
    return request({
      url: '/api/SERVICE-SCHEDULER/job/deletejob',
      method: 'post',
      params: info
    })
  },
  
  pausejob(info) { //暂停任务
    return request({
      url: '/api/SERVICE-SCHEDULER/job/pausejob',
      method: 'post',
      params:info
    })
  },
  
  queryjob(info) { //查询任务
    return request({
      url: '/api/SERVICE-SCHEDULER/job/queryjob',
      method: 'get',
      params: info
    })
  },

  reschedulejob(data) { //更新任务执行计划
    return request({
      url: '/api/SERVICE-SCHEDULER/job/reschedulejob',
      method: 'post',
      params: data
    })
  },
  
  
  resumejob(data) { //恢复执行任务
    return request({
        url: '/api/SERVICE-SCHEDULER/job/resumejob',
        method: 'post',
        params: data
    })
  },

}

