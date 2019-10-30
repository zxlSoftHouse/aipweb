import request from '@/utils/request'

export default{

    // 获取所有公司信息
    getAllOrgList(data) {
        return request({
            url: '/api/SERVICE-MD/org/queryList',
            method: 'post',
            data: data
        })
    },

    // 分页获取所有公司信息
    getOrgList(data) { 
        return request({
            url: '/api/SERVICE-MD/org/queryPage',
            method: 'post',
            data: data
        })
    },

    // 新增或修改
    addOrUpdate(data) { 
        return request({
            url: '/api/SERVICE-MD/org/update',
            method: 'put',
            data: data
        })
    },

    // 新增或修改
    editOrg(data) { 
        return request({
            url: '/api/SERVICE-MD/org/editOrg',
            method: 'post',
            data: data
        })
    },
  
    // 删除行
    deleteRow(rowId) {
        return request({
            url: '/api/SERVICE-MD/org/delete/'+rowId,
            method: 'delete',
        })
    }
}
