import request from '@/utils/request'
import qs from 'qs'

export default{
  deleteRow(rowId) {//删除行
    return request({
      url: '/api/SERVICE-AUTH/role/delete/'+rowId,
      method: 'delete',
    })
  },
  
  addOrUpdate(roleInfo) { //新增或修改
    return request({
      url: '/api/SERVICE-AUTH/role/update',
      method: 'put',
      data: roleInfo
    })
  },
  
  getRoleIdSearchMenu(rowId) { //根据角色查询菜单
    return request({
      url: '/api/SERVICE-AUTH/role/menu/queryById/'+rowId,
      method: 'get',
    })
  },
  
  saveMenu(data) { //保存角色拥有的菜单
    return request({
      url: '/api/SERVICE-AUTH/role/menu/saveByRoleId/'+data.roleId,
      method: 'post',
      data: data.menuId
    })
  },

  saveUsersByRoleId(data) { //将角色赋给多个用户
    return request({
      url: '/api/SERVICE-AUTH/user/role/saveByRoleId/'+data.roleId,
      method: 'post',
      data: data.userIds
    })
  },
  
  
  queryByInfo(info) { //根据条件（用户id等）查询角色
    return request({
      url: '/api/SERVICE-AUTH/user/role/queryList/',
      method: 'post',
      data: info
    })
  },
  
  queryList(info) { //(基类提供)查询所有满足条件的记录
    return request({
      url: '/api/SERVICE-AUTH/role/queryList/',
      method: 'post',
      data: info
    })
  },
  
  saveByUserId(userId,info) { //保存用户拥有的角色
    return request({
      url: '/api/SERVICE-AUTH/user/role/saveByUserId/'+userId,
      method: 'post',
      data: info
    })
  }
}

