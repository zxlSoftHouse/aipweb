import request from '@/utils/request'

export default{
    getList(params) {  //查询所有策略
        return request({
          url: 'api/SERVICE-AIP/lightingSchedule/queryLightingSchedulePage',
          method: 'post',
          data: params
        })
    },
    getListCity(params) {  //查询所有策略市灯
        return request({
          url: 'api/SERVICE-AIP/lampScheduleConfig/queryScheduleConfig',
          method: 'post',
          data: params
        })
    },
    
    getSolarPolicyDetail(solarPolicyConfigId) {  //查询太阳能策略配置及详细
        return request({
          url: 'api/SERVICE-AIP/policyConfig/querySolarPolicyConfig',
          method: 'get',
          params: {solarPolicyConfigId:solarPolicyConfigId}
        })
    },

    getCityPolicyDetail(lampScheduleConfigId) {  //查询市灯策略配置及详细
      return request({
        url: 'api/SERVICE-AIP/lampScheduleConfig/queryScheduleConfig',
        method: 'get',
        params: {lampScheduleConfigId:lampScheduleConfigId}
      })
    },

    queryBandLampConList(solarPolicyConfigId){  //根据太阳能策略配置id获取单控器列表
      return request({
        url: 'api/SERVICE-AIP/lampControl/queryBandLampConList',
        method: 'get',
        params: {solarPolicyConfigId:solarPolicyConfigId}
      })
    },
  
    doDelete(ids) {  //删除
      return request({
        url: 'api/SERVICE-AIP/lightingSchedule/deleteLightingScheduleByIds',
        method: 'post',
        data: ids 
      })
    },
    doDeleteCity(ids) {  //删除
      return request({
        url: 'api/SERVICE-AIP/lampScheduleConfig/deleteScheduleConfig',
        method: 'post',
        data: ids 
      })
    },
    addOrEdit(data) { //新增编辑太阳能
      return request({
        url: 'api/SERVICE-AIP/policyConfig/updateSolarPolicyConfig',
        method: 'post',
        data: data
      })
    },

    addOrEditCity(data) { //新增编辑市灯
      return request({
        url: 'api/SERVICE-AIP/lampScheduleConfig/updateConfig',
        method: 'post',
        data: data
      })
    },

    queryLampListByProject(data) { //全部灯具查询接口
      return request({
        url: 'api/SERVICE-AIP/lamp/queryLampListByProject',
        method: 'post',
        data: data
      })
    },

    bindLampListUpdate(data) { //修改绑定保存
      return request({
        url: 'api/SERVICE-AIP/lampScheduleConfig/bindLampListUpdate',
        method: 'post',
        data: data
      })
    },

    bindLampListQuery(data) { //已绑定的灯具查询
      return request({
        url: 'api/SERVICE-AIP/lampScheduleConfig/bindLampListQuery',
        method: 'get',
        params: data
      })
    },

    getScheduleTypeMap(){//6. 获取策略类型
      return request({
        url: 'api/SERVICE-AIP/lightingSchedule/getScheduleTypeMap',
        method: 'get',
      })
    },

    updateScheduleConfigList(data){//新增编辑策略
      
      return request({
        url: 'api/SERVICE-AIP/lightingSchedule/updateScheduleConfigList',
        method: 'post',
        data: data
      })
    }
}