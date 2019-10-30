import request from '@/utils/request'

export default{

    queryList(){  //不分页查询
        return request({
            url: 'api/SERVICE-AIP/lampControl/queryList',
            method: 'post',
            data:{}
        })
    },
    
    getList(data) {  //分页查询
        return request({
            url: 'api/SERVICE-AIP/lightingLampControl/queryLightingLampConPage',
            method: 'post',
            data: data
        })
    },
    
    doDelete(ids) {  //删除
        return request({
            url: 'api/SERVICE-AIP/lightingLampControl/deleteLightingLampConByIds',
            method: 'post',
            data: ids
        })
    },
    
    addOrEdit(data) { //新增或修改
        return request({
            url: 'api/SERVICE-AIP/lightingLampControl/update',
            method: 'put',
            data: data
        })
    },

    getDeviceTypeCode(data){
        return request({
            url: 'api/SERVICE-AIP/lightingLampControl/getDeviceTypeCode',
            method: 'get',
            params: data
        })
    },
    
    queryLampControlBind(id) { //查询单灯控制器和灯是否绑定
        return request({
            url: 'api/SERVICE-AIP/lampControl/queryLampControlBind',
            method: 'get',
            params: {lampControlId: id}
        })
    },
    
    
    queryLampControlById(id) { //按id查一条
        return request({
            url: 'api/SERVICE-AIP/lampControl/queryById/' + id,
            method: 'get',
            // params: {lampControlId:id}
        })
    },
    
    queryTenderOptions(data) { //查询厂家下拉框数据
        return request({
            url: 'api/SERVICE-AIP/sysDeviceTender/queryDeviceTenderList',
            method: 'get',
            params: data
        })
    },
    
    queryModelOptions(data) { //查询单灯控制器型号下拉框数据 设备分类
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

    queryStrategyOptions(policyType){  //获取策略下拉框数据（0:市电、1：太阳能）
        return request({
            url: 'api/SERVICE-AIP/policyConfig/getPolicyConfigList',
            method: 'post',
            data: {policyType:policyType}
        })
    },

    queryLightingCentConList(data){  //获取集控器
        return request({
            url: 'api/SERVICE-AIP/lightingCentralizedCon/queryLightingCentConList',
            method: 'post',
            data: data
        })
    },

    queryLampPostList(data){  //获取灯杆
        return request({
            url: 'api/SERVICE-AIP/sysLampPost/queryLampPostList',
            method: 'post',
            data: data
        })
    },
    queryRoadOptions(data) { //获取路段下拉框数据
        return request({
            url: 'api/SERVICE-AIP/road/queryList',
            method: 'post',
            data: {projectId:data}
        })
    },
    downloadLampPostExcel() { //获取路段下拉框数据
        return request({
            url: 'api/SERVICE-AIP/lightingLampControl/downloadLampConExcel',
            method: 'get',
            responseType:"blob"
        })
    },
}


