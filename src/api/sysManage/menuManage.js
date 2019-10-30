import request from '@/utils/request'
import qs from 'qs'
export default{
  getMenu(menuType) { //根据用户获取菜单
    return request({
      url: '/api/SERVICE-AUTH/authorize/queryMenusByUserId/',
      method: 'post',
      data:{menuType:menuType}
    })
  },
  getMenuAll() { //获取所有菜单
    return request({
      url: '/api/SERVICE-AUTH/menu/queryMenuTree',
      method: 'post',
      data:{}
    })
  },
  saveOrUpdateMenu(menu) { //新增或编辑菜单
    return request({
      url: '/api/SERVICE-AUTH/menu/update',
      method: 'put',
      data: menu
    })
  },
  deleteMenu(menuId) { // 根据菜单id 删除一条菜单
    return request({
      url: '/api/SERVICE-AUTH/menu/delete/'+menuId,
      method: 'delete',
    })
  },
  saveMenuShareRole(data) { //将菜单赋给多个角色
    return request({
      url: '/api/SERVICE-AUTH/role/menu/saveByMenuId/'+data.menuId,
      method: 'post',
      data: data.roleIds
    })
  },
  getMenuQueryRole(info) { //查询所有满足条件的记录  (根据角色查菜单或者根据菜单查角色)
    return request({
      url: '/api/SERVICE-AUTH/role/menu/queryList',
      method: 'post',
      data:info
    })
  },
  getMenuResource(menuId) {//根据id查询资源
    return request({
      url: '/api/SERVICE-AUTH/resource/queryList',
      method: 'post',
      data: { menuId:menuId }
    })
  },
  getAllResource() { //查询所有资源
    return request({
      url: '/api/SERVICE-AUTH/resource/queryList',
      method: 'post',
      data: {}
    })
  },
  getRoleList() { //查询所有角色
    return request({
      url: '/api/SERVICE-AUTH/role/queryList',
      method: 'post',
      data: {}
    })
  },
  getRolePageList(queryList) { //按分页查询所有角色列表
    return request({
      url: '/api/SERVICE-AUTH/role/queryPage',
      method: 'post',
      data: queryList
    })
  },
  getHasResourceRoleList(resourceId) { //根据资源resourceId查询已有的角色
    return request({
      url: '/api/SERVICE-AUTH/role/resource/queryList',
      method: 'post',
      data: {resourceId:resourceId}
    })
  },
  saveByResourceIdRoles(data) { //将资源赋给多个角色
    return request({
      url: '/api/SERVICE-AUTH/role/resource/saveByResourceId/'+data.resourceId,
      method: 'post',
      data: data.roleIds
    })
  } 
}


