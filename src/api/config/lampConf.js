import request from '@/utils/request'

export default{

    getList(data) {  //分页查询
        return request({
            url: 'api/SERVICE-AIP/sysLampPost/queryLampPostPage',
            method: 'post',
            data: data
        })
    },
    
    doDelete(ids) {  //删除
        return request({
            url: 'api/SERVICE-AIP/sysLampPost/deleteLampPostByIds',
            method: 'post',
            data: ids
        })
    },
    
    update(data) { //新增修改
        return request({
            url: 'api/SERVICE-AIP/sysLampPost/update',
            method: 'put',
            data: data
        })
    },
    
    
    querySingleControllerByParams(controlModelId) { //根据型号获取单灯控制器下拉框数据
        return request({
            url: 'api/SERVICE-AIP/lampControl/queryList',
            method: 'post',
            data:{controlModelId:controlModelId}
        })
    },
    
    queryCenterControllerOptions() { //获取集中控制器下拉框数据
        return request({
            url: 'api/SERVICE-AIP/centralizedControl/queryList',
            method: 'post',
            data: {}
        })
    },
    
    queryProjectOptions() { //获取项目下拉框数据
        return request({
            url: 'api/SERVICE-AIP/project/queryList',
            method: 'post',
            data: {}
        })
    },
    
    queryRoadOptions(data) { //获取路段下拉框数据
        return request({
            url: 'api/SERVICE-AIP/road/queryList',
            method: 'post',
            data: {projectId:data}
        })
    },
    
    queryTenderOptions(data) { //获取厂家下拉框数据
        return request({
            url: 'api/SERVICE-AIP/sysDeviceTender/queryDeviceTenderList',
            method: 'get',
            params: data
        })
    },
    
    queryTypeOptions(data) { //获取灯杆型号下拉框数据
        return request({
            url: 'api/SERVICE-AIP/sysDeviceModel/queryDeviceModelByTenderId',
            method: 'post',
            data: data
        })
    },

    queryParamsByModel(deviceModelId){  //通过型号查找参数
        return request({
            url: 'api/SERVICE-AIP/deviceModel/queryDeviceModelParams',
            method: 'get',
            params: {deviceModelId:deviceModelId}
        })
    },

    queryDeviceModel(deviceType,lampControlType) { //获取设备型号下拉框   设备分类(00:灯杆,01:灯,02:单灯控制器,03:集中控制器)
        return request({
            url: 'api/SERVICE-AIP/deviceModel/queryList',
            method: 'post',
            data: {deviceType:deviceType,lampControlType:lampControlType}
        })
    },

    queryOne(LampPostId){  //查单条信息
        return request({
            url: 'api/SERVICE-AIP/lampPost/getLampPost',
            method: 'get',
            params: {LampPostId:LampPostId}
        })
    },

    onOffLight(data){  //开关灯，调节亮度
        return request({
            url: 'api/SERVICE-AIP/netty/triggerController',
            method: 'post',
            data: data
        })
    },

    querycentralizedControlById(id) {  //查询单条数据
        return request({
          url: 'api/SERVICE-AIP/centralizedControl/queryOne',
          method: 'post',
          data: {rowId:id}
        })
    },
    getDeviceTypeCode() {  //查询单条数据
        return request({
          url: 'api/SERVICE-AIP/sysLampPost/getDeviceTypeCode',
          method: 'get',
          data: {}
        })
    },
    downloadLampPostExcel() {  //查询单条数据
        return request({
          url: 'api/SERVICE-AIP/sysLampPost/downloadLampPostExcel',
          method: 'get',
          responseType:"blob"
        })
    },
}
