import request from '@/utils/request'

export default{
    getLightingList(data) {  //查询灯具数据
        return request({
            url: 'api/SERVICE-AIP/lightingLampControl/queryLightingLampConPage',
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

    queryLampHisData(data){  //获取灯具历史数据(市电灯)
        return request({
            url: 'api/SERVICE-AIP/lampConHisData/queryLampHisData',
            method: 'post',
            data: data
        })
    },


    queryLampHisRate(data){  //获取亮灯率
        return request({
            url: 'api/SERVICE-AIP/lampConHisData/queryLampConHisRate',
            method: 'post',
            data: data
        })
    },

    getcentralizedConHisInfo(data){  //获取集控器三相电历史数据
        return request({
            url: 'api/SERVICE-AIP/lightingCentralizedCon/getcentralizedConHisInfo',
            method: 'post',
            data: data
        })
    },

    getCentralizedControlList(data) {  //查询集控器列表
        return request({
          url: 'api/SERVICE-AIP/lightingCentralizedCon/queryLightingCentConPage',
          method: 'post',
          data: data
        })
    },

    getLoopHisInfo_states(data) {  //开闭状态数据
        return request({
          url: 'api/SERVICE-AIP/lightingCentralizedCon/getLoopHisInfo_states',
          method: 'post',
          data: data
        })
    },

    
    getLoopHisInfo_currents(data) {  //获取集控器各回路电流
        return request({
          url: 'api/SERVICE-AIP/lightingCentralizedCon/getLoopHisInfo_currents',
          method: 'post',
          data: data
        })
    },
}