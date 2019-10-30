import request from '@/utils/request'

export default{
  
    // 新增编辑
    saveByPrjId(data) { 
        return request({
            url: 'api/SERVICE-AIP/projectUserRel/saveByPrjId',
            method: 'post',
            data: data
        })
    },
    // 查询人员关联项目
    queryByInfo(data) {
        return request({
            url: 'api/SERVICE-AIP/projectUserRel/queryList',
            method: 'post',
            data: data
        })
    }
}