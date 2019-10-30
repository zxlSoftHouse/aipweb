import request from '@/utils/request'

export default{
    onOffLight(data){  //开关灯，调节亮度
        return request({
            url: 'api/SERVICE-AIP/lightingLampControl/lampListAiming',
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

    queryLampDataPage(data){  //获取路灯实时信息
        return request({
            url: 'api/SERVICE-AIP/lightingLampControl/queryLightingLampConPage',
            method: 'post',
            data: data
        })
    },

    queryLampById(ids){  //查询单个灯实时数据
        return request({
            url: 'api/SERVICE-AIP/lamp/queryLampById',
            method: 'post',
            data: ids
        })
    },

    checkActionStatus(data){  //轮询
        return request({
            url: 'api/SERVICE-AIP/lamp/checkActionStatus',
            method: 'post',
            data: data
        })
    },

    getElectricityConsumptionData(data){  //查累计电量
        return request({
            url: 'api/SERVICE-AIP/lampRunData/queryLampEnergy',
            method: 'post',
            data: data
        })
    },

    lampListLiveQuery(data){  //灯具主动探测,lampIdList-灯具id列表
        return request({
            url: 'api/SERVICE-AIP/lightingLampControl/lampListLiveQuery',
            method: 'post',
            data: data
        })
    },
    getGroupList(data){//获取分组列表
        return request({
            url: 'api/SERVICE-AIP/lampGroup/queryLampGroup',
            method: 'post',
            data: data
        })
    },
    queryLampListByProject(data){//根据项目查询所有灯具
        return request({
            url: 'api/SERVICE-AIP/lamp/queryLampListByProject',
            method: 'post',
            data: data
        })
    },
    updateLampGroup(data){//2.	更新分组接口(新增、修改)
        return request({
            url: 'api/SERVICE-AIP/lampGroup/updateLampGroup',
            method: 'post',
            data: data
        })
    },
    deleteByIdList(data){//2.	更新分组接口(新增、修改)
        return request({
            url: 'api/SERVICE-AIP/lampGroup/deleteByIdList',
            method: 'post',
            data: data
        })
    },
    lampListGroup(data){//4.	给灯具设置分组
        return request({
            url: 'api/SERVICE-AIP/lampGroup/lampListGroup',
            method: 'post',
            data: data
        })
    },
    groupAiming(data){//开关/调光控制,groupIdList-分组id列表,onOff-开关,aimingValue-调光值
        return request({
            url: 'api/SERVICE-AIP/lightingLampGroup/groupAiming',
            method: 'post',
            data: data
        })
    },
    groupQuery(data){//读取
        return request({
            url: 'api/SERVICE-AIP/lightingLampGroup/groupQuery',
            method: 'post',
            data: data
        })
    },
    querycentralizedController(data){//查询集控
        return request({
            url: 'api/SERVICE-AIP/centralizedControl/queryCentralizedConList',
            method: 'post',
            data: data
        })
    },

    
}