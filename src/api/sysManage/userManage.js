import request from '@/utils/request'
import qs from 'qs'
export default{
  getCurrnetUser() { //获取当前用户
    return request({
      url: '/api/SERVICE-AUTH/user/get',
      method: 'get'
    })
  },
  getUserList(queryList) { //获取所有用户
    return request({
      url: '/api/SERVICE-AUTH/user/queryPage',
      method: 'post',
      data: queryList
    })
  },
  
  deleteRow(rowId) {//删除行
    return request({
      url: '/api/SERVICE-AUTH/user/delete/'+rowId,
      method: 'delete',
    })
  },
  
  addOrUpdate(userInfo) { //新增或修改
    return request({
      url: '/api/SERVICE-AUTH/user/update',
      method: 'post',
      data: userInfo
    })
  },
  modifyPwd(userId, pwd){ //修改用户密码
    return request({
      url: '/api/SERVICE-AUTH/user/private/updatePasswordByUserId/'+userId+'/'+pwd,
      method: 'put'
    })
  },
  loginOut(token){//退出登录 
    return request({
      url: '/api/SERVICE-AUTH/logout/exit?access_token='+token,
      post: 'post'
    })
  },
   loginLog() {
    return request({
      url: '/api/SERVICE-AUTH/log/loginLog',
      method: 'get'
    })
  }
}

