import request from '@/utils/request'

export default{

  getList(pageNum, pageSize, startTime, endTime) {  //查询
    return request({
      url: '/api/SERVICE-AIP/sensorRunData/queryPage',
      method: 'post',
      data: {pageNum: pageNum, pageSize: pageSize, startTime: startTime,  endTime: endTime}
    })
  },

  getSensorRunData(id) {  //查询
    return request({
      url: '/api/SERVICE-AIP/sensorRunData/queryOne',
      method: 'post',
      data: {sensorId: id}
    })
  },

  getSensorDayRunData(id) {  //查询
    return request({
      url: '/api/SERVICE-AIP/sensorRunData/queryDayRunData',
      method: 'post',
      data: {sensorId: id}
    })
  },

}