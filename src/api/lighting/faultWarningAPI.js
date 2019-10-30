import request from '@/utils/request'

export default{
  
  getList(data) {  //查询
    return request({
      url: 'api/SERVICE-AIP/sysAlarm/queryAlarmPage',
      method: 'post',
      data: data
    })
  },

  queryProjectOptions() { //获取项目下拉框数据
      return request({
          url: 'api/SERVICE-AIP/project/queryList',
          method: 'post',
          data: {}
      })
  },
  
  queryRoadOptions(projectId) { //获取路段下拉框数据
      return request({
          url: 'api/SERVICE-AIP/road/queryList',
          method: 'post',
          data: {projectId:projectId}
      })
  },
  alarmResolved(data) { //获取路段下拉框数据
      return request({
          url: 'api/SERVICE-AIP/sysAlarm/alarmResolved',
          method: 'post',
          data: data
      })
  },
}