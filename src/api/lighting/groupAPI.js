import request from '@/utils/request'

export default{
    getGroupList(data){//获取分组列表
        return request({
            url: 'api/SERVICE-AIP/lightingLampGroup/queryLightingLampGroupPage',
            method: 'post',
            data: data
        })
    },
    queryLampListByProject(data){//7. 获取单控器列表
        return request({
            url: 'api/SERVICE-AIP/lightingLampGroup/queryLampConByGroup',
            method: 'post',
            data: data
        })
    },
    updateLampGroup(data){//2.	更新分组接口(新增、修改)
        return request({
            url: 'api/SERVICE-AIP/lightingLampGroup/upadteLightingLampGroup',
            method: 'post',
            data: data
        })
    },
    deleteByIdList(data){//9. 删除记录
        return request({
            url: 'api/SERVICE-AIP/lightingLampGroup/deleteLightingLampGroupByIds',
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
    
    getStrategyList(params) {  //查询所有策略
        return request({
          url: 'api/SERVICE-AIP/lightingLampGroup/queryScheduleByGroup',
          method: 'post',
          data: params
        })
    },

    
    bindLampListUpdate(data) { //修改绑定保存
        return request({
            url: 'api/SERVICE-AIP/lightingLampGroup/updateGroupBind',
            method: 'post',
            data: data
        })
    },
    checkActionStatus(data){  //轮询
        return request({
            url: 'api/SERVICE-AIP/lamp/checkActionStatus',
            method: 'post',
            data: data
        })
    },

    getGroupTypeFlagMap(){ //获取分组类型下拉框
        return request({
            url: 'api/SERVICE-AIP/lightingLampGroup/getGroupTypeFlagMap',
            method: 'get',
        })
    },

    getScheduleTypeMap(){//6. 获取策略类型
        return request({
            url: 'api/SERVICE-AIP/lightingSchedule/getScheduleTypeMap',
            method: 'get',
        })
    },

    updateSchedule(data){   //6. 更新分组策略绑定
        return request({
            url: 'api/SERVICE-AIP/lightingLampGroup/updateScheduleBind',
            method: 'post',
            data: data
        })
    }
  

}