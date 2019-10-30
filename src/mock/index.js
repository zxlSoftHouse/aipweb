import Mock from 'mockjs'
import loginAPI from './login'
import articleAPI from './article'
import remoteSearchAPI from './remoteSearch'
import transactionAPI from './transaction'

import * as menuManageAPI from './menu-manage'
import * as userManageAPI from './user-manage'

Mock.setup({
  timeout: '350-600'
})



// 登录相关
Mock.mock(/\/login\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

//菜单管理 menuManage 相关的接口
Mock.mock(/\/local\/emcls-web\/front\/sys\/menu\/selectTree/, 'get', menuManageAPI.getMenuTree)

// Mock.mock('/api/emcls-web/front/sys/menu/selectTree', 'get', menuManageAPI.getMenuTree)

//用户管理 user  相关的接口
// Mock.mock('/api/emcls-web/front/sys/user/list', 'post', userManageAPI.getUserList)
Mock.mock(/\/local\/emcls-web\/front\/sys\/user\/list/, 'post', userManageAPI.getUserList)


export default Mock