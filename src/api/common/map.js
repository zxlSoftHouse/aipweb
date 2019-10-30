import request from '@/utils/request'

export default {
  getLampPost(projectId) {//查询灯杆位置信息
		return request( {
      url:'api/SERVICE-AIP/sysLampPost/queryList', 
      method:'post', 
      data: {projectId:projectId}
    })
  }, 
  getCenterController() {//查询集控器位置信息
		return request( {
      url:'api/SERVICE-AIP/centralizedControl/queryList', 
      method:'post', 
      data: {}
    })
  }, 
  queryLampById(ids) {//查询单个灯实时数据
		return request( {
				url:'api/SERVICE-AIP/lamp/queryLampById', 
				method:'post', 
				data:ids
		})
  }, 
  queryOneLampPost(LampPostId) {//查单个灯杆信息
		return request( {
			url:'api/SERVICE-AIP/sysLampPost/queryById/'+LampPostId, 
			method:'get', 
		})
  }, 
  queryLightingLampConListByPostId(LampPostId) {//根据灯杆ID查询单控器（灯具）实时数据
		return request( {
			url:'api/SERVICE-AIP/lightingLampControl/queryList', 
			method:'post', 
			data: {lampPostId:LampPostId}
		})
  }, 
  onOffLight(data) {//开关灯，调节亮度
		return request( {
			url:'api/SERVICE-AIP/lightingLampControl/lampListAiming', 
			method:'post', 
			data:data
		})
  }, 
  checkActionStatus(data) {//轮询
		return request( {
			url:'api/SERVICE-AIP/lamp/checkActionStatus', 
			method:'post', 
			data:data
		})
	},
    lampListLiveQuery(data){  //灯具主动探测,lampIdList-灯具id列表
        return request({
            url: 'api/SERVICE-AIP/lightingLampControl/lampListLiveQuery',
            method: 'post',
            data: data
        })
    },
	
	// =====================视频监控=======================
	getMonitorPost() {
		return request( {
			url:'/api/SERVICE-AIP/camera/queryAllList', 
			method:'post',
			data: {}
		})
	}, 
	// ==============================
	// ====================传感器====================
	getSensorPost() {  //查询
    return request({
      url: '/api/SERVICE-AIP/sensorManage/queryList',
      method: 'post',
      data: {}
    })
	},
		// ==============================
	// ====================一键报警====================
	getAlarmPost() {  //查询
    return request({
      url: '/api/SERVICE-AIP/callHelpDevice/queryCallHelpDeviceList',
      method: 'post',
      data: {}
    })
  },
}

