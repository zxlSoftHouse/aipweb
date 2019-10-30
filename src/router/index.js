import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import menuApi from '@/api/sysManage/menuManage'
import permsApi from '@/api/sysManage/permission'
import { getIFramePath, getIFrameUrl } from '@/utils/iframe' 
const _import = require('./_import_' + process.env.NODE_ENV)
Vue.use(Router)

import LayoutTab from '../views/layout/system/Home'
import SystemLayout from '../views/layout/system-no-tab/Layout'

// export const headerMenu = [
//   {
//     path     : '/',
//     component: homePageLayout,
//     redirect : '/home',
//     name     : 'home',
//     meta     : { title: 'home',iconClass: 'iconfont icon-shouye' },
//     children : [
//       {
//         path     : 'home',
//         component: resolve => require(['@/views/home-page/home'],resolve),
//         // component: () => import('@/views/home-page/home')
//       },
//       {
//         path     : 'lighting',
//         redirect : '/lighting/projectConf',
//         name     : "lighting",
//         component: commonLayout,
//         children : [
//           {  //项目配置
//             path     : 'projectConf',
//             name     : 'projectConf',
//             component: resolve => require(['@/views/config/project-conf/index'],resolve),
//             // component: ()=>import('@/views/config/project-conf/index'),
//           },
//           {  //路段配置
//             path     : 'roadConf',
//             name     : 'roadConf',
//             component: resolve => require(['@/views/config/road-conf/index'],resolve),
//             // component: ()=>import('@/views/config/road-conf/index'),
//           },
//           {  //路灯配置
//             path     : 'lampConf',
//             name     : 'lampConf',
//             component: resolve => require(['@/views/config/lamp-conf/index'],resolve),
//             // component: ()=>import('@/views/config/lamp-conf/index'),
//           },
//           {  //设备厂家配置
//             path     : 'deviceTenderConf',
//             name     : 'deviceTenderConf',
//             component: resolve => require(['@/views/config/device-tender-conf/index'],resolve),
//             // component: ()=>import('@/views/config/device-tender-conf/index'),
//           },
//           {  //设备型号配置
//             path     : 'deviceModelConf',
//             name     : 'deviceModelConf',
//             component: resolve => require(['@/views/config/device-model-conf/index'],resolve),
//             // component: ()=>import('@/views/config/device-model-conf/index'),
//           },
//           {  // 运维人员配置
//             path     : 'devOpsConf',
//             name     : 'devOpsConf',
//             component: resolve => require(['@/views/config/devOps-conf/index'],resolve),
//           },
//           {  //集控器配置
//             path     : 'centerControllerConf',
//             name     : 'centerControllerConf',
//             component: resolve => require(['@/views/config/center-controller-conf/index'],resolve),
//             // component: ()=>import('@/views/config/center-controller-conf/index'),
//           },
//           {  //单控器配置
//             path     : 'singleControllerConf',
//             name     : 'singleControllerConf',
//             component: resolve => require(['@/views/config/single-controller-conf/index'],resolve),
//             // component: ()=>import('@/views/config/single-controller-conf/index'),
//           },
//           {  //分组设置
//             path     : 'group',
//             name     : 'group',
//             component: resolve => require(['@/views/lighting/group/index'],resolve),
//           },
//           {  //实时监控
//             path     : 'realTimeMonitoring',
//             name     : 'realTimeMonitoring',
//             component: resolve => require(['@/views/lighting/real-time-monitoring/index'],resolve),
//             // component: ()=>import('@/views/lighting/real-time-monitoring/index'),
//           },
//           {  //回路监控
//             path     : 'loopMonitoring',
//             name     : 'loopMonitoring',
//             component: resolve => require(['@/views/lighting/loop-monitoring/index'],resolve),
//             // component: ()=>import('@/views/lighting/loop-monitoring/index'),
//           },
//           {  //故障告警
//             path     : 'faultWarning',
//             name     : 'faultWarning',
//             component: resolve => require(['@/views/lighting/fault-warning/index'],resolve),
//             // component: ()=>import('@/views/lighting/fault-warning/index'),
//           },
//           {  //历史数据
//             path     : 'historyData',
//             name     : 'historyData',
//             component: resolve => require(['@/views/lighting/history-data/index'],resolve),
//             // component: ()=>import('@/views/lighting/history-data/index'),
//           },
//           {  //操作记录
//             path     : 'operationRecords',
//             name     : 'operationRecords',
//             component: resolve => require(['@/views/lighting/operation-records/index'],resolve),
//             // component: ()=>import('@/views/lighting/operation-records/index'),
//           },
//           {  //场景策略
//             path     : 'strategy',
//             name     : 'strategy',
//             component: resolve => require(['@/views/lighting/strategy/index'],resolve),
//             // component: ()=>import('@/views/lighting/strategy/index'),
//           }
//         ]
//       },
//       { // LED
//         path     : 'led',
//         name: 'led',
//         component: commonLayout,
//         redirect: 'led/ledConfig',
//         children: [
//           {
//             path: 'addOrEditProgram',
//             name: 'addOrEditProgram',
//             component: resolve => require(['@/views/led/program-manager/addOrEditProgram'],resolve),
//             // component: ()=>import('@/views/led/program-manager/addOrEdit')
//           },
//           {
//             path: 'addOrEditTask',
//             name: 'addOrEditTask',
//             component: resolve => require(['@/views/led/task-manager/addOrEditTask'],resolve),
//             // component: ()=>import('@/views/led/task-manager/addOrEdit')
//           },
//         ]
//       },
//     ]
//   },
// ]

export const constantRouterMap = [
  // headerMenu[0],
  // headerMenu[1],
  // headerMenu[2],
  { name:'login', path: '/login', component: _import('login/index'), hidden: true },
  {
    name     : 'bigScreen',
    path     : '/bigScreen',
    component: _import('bigScreen/index'),
  },
  {
    path     : '/',
    component: LayoutTab,
    redirect : '/home',
    name     : 'home',
    children : [
      {
        path     : 'home',
        name     : '主页',
        component: resolve => require(['@/views/homePage'],resolve),
      }
    ]
  }, 
  { path: '/404', component: _import('404'), hidden: true },
  // { path: '/monitor', component: _import('video/monitor/monitor') }
]

const router =  new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes        : constantRouterMap
})

router.beforeEach((to, from, next) => {
  // 登录界面登录成功之后，会把用户信息保存在会话
  // 存在时间为会话生命周期，页面关闭即失效。
  let token = store.getters.token
  if (to.path === '/login') { 
      next()
  } else {
    if (!token) {
      // 如果访问非登录界面，且户会话信息不存在，代表未登录，则跳转到登录界面
      next({ path: '/login' })
    } else {
      // 加载动态菜单和路由
      addDynamicMenuAndRoutes(token, to, from)
      next()
    }
  }
})

//通过新建一个全新的 Router，然后将新的 Router.matcher 赋给当前页面的管理 Router，以达到更新路由配置的目的
router.$addRoutes = (params) => {
  router.matcher = new Router({mode: 'history'}).matcher;
  router.addRoutes(params)
}


/**
* 加载动态菜单和路由
*/
function addDynamicMenuAndRoutes(userName, to, from) {
  // 处理IFrame嵌套页面
  handleIFrameUrl(to.path)
  if(store.state.app.menuRouteLoaded) {
    return
  }
  menuApi.getMenu(1).then(res => {
    // 添加动态路由
    let dynamicRoutes = addDynamicRoutes(res)
    // console.log(dynamicRoutes);
    // 处理静态组件绑定路由
    handleStaticComponent(router, dynamicRoutes)
    // router.addRoutes(router.options.routes)
    //addRoutes 方法仅仅是帮你注入新的路由，并没有帮你剔除其它路由！
    router.$addRoutes(router.options.routes);
    
    // 保存加载状态
    store.commit('menuRouteLoaded', true)
    // 保存菜单树
    store.commit('setNavTree', res)	
  })
  menuApi.getMenu(2).then(res => {
    // 保存菜单树
    store.commit('setBuTree', res)
  }).then(res => {
    permsApi.getPermission().then(res => {
    // 保存用户权限标识集合
		store.commit('SET_PERMS', res)
    })
  })
  .catch(function(res) {
  })
}

/**
 * 处理路由到本地直接指定页面组件的情况
 * 比如'代码生成'是要求直接绑定到'Generator'页面组件
 */
function handleStaticComponent(router, dynamicRoutes) { 
  let routePathArr = []; //静态路由的path集合
  router.options.routes.map(value=>{
    routePathArr.push(value.path);
  })
  router.options.routes.map((value,key,arr)=>{
    let dynamicRoutesIdx = -1;
    dynamicRoutes.map((val,idx,ar)=>{
      dynamicRoutesIdx = dynamicRoutes.findIndex(val=>value.path===val.path);      
      if(dynamicRoutesIdx === idx && dynamicRoutesIdx > -1){ // 静态路由已经存在动态路由path 相同path合并
        router.options.routes[key].children = router.options.routes[key].children.concat(val.children);
      }else if(dynamicRoutesIdx === -1 && routePathArr.indexOf(val.path) === -1){ // 静态路由不存在动态路由path 动态路由path添加
        routePathArr.push(val.path); 
        router.options.routes.push(val);
      }
    })  
  })
}

/**
 * 处理IFrame嵌套页面
 */
function handleIFrameUrl(path) {
  // 嵌套页面，保存iframeUrl到store，供IFrame组件读取展示
  let url = path
  let length = store.state.iframe.iframeUrls.length
  for(let i=0; i<length; i++) {
    let iframe = store.state.iframe.iframeUrls[i]
    if(path != null && path.endsWith(iframe.path)) {
      url = iframe.url
      store.commit('setIFrameUrl', url)
      break
    }
  }
}

/**
* 添加动态(菜单)路由
* @param {*} menuList 菜单列表
* @param {*} routes 递归创建的动态(菜单)路由
*/
function addDynamicRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    var route = {};
    if (menuList[i].childs && menuList[i].childs.length >= 1) {
      temp = temp.concat(menuList[i].childs);
      route =   {
        path     : menuList[i].url,
        component: LayoutTab,
        name     : menuList[i].menuName,
        meta     : {
          icon: menuList[i].icon,
          index: menuList[i].rowId
        },
        children :[]
      }
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      // 创建路由配置
      route = {
        path: menuList[i].url, // sun 改
        component: null,
        name: menuList[i].menuName,
        meta: {
          icon: menuList[i].icon,
          index: menuList[i].rowId
        },
        children :[]
      }  
      // ================       
    }
    let path = getIFramePath(menuList[i].url)
    if (path) {
      // 如果是嵌套页面, 通过iframe展示
      route['path'] = path
      route['component'] = resolve => require([`@/views/layout/system-no-tab/components/AppMain`], resolve)
      // 存储嵌套页面路由路径和访问URL
      let url = getIFrameUrl(menuList[i].url)
      let iFrameUrl = {'path':path, 'url':url}
      store.commit('addIFrameUrl', iFrameUrl)
    } else {
      try {
        let url =  menuList[i].url;
        if(url.indexOf("/")===0){
          url = url.substr(1);
        }
        if(!route['component']) route['component'] = resolve => require([`@/views/${url}`], resolve)
      } catch (e) {}
      let childrenNode =  routes.filter(res=>res.path==='/' + menuList[i].url.split('/')[1])
      if(childrenNode.length>0){
        routes.map((res,idx)=>{
          if(res.path === '/' + menuList[i].url.split('/')[1]){
            routes[idx].children.push(route);
          }
        })
      }else{
        if(menuList[i].parentId=='-1' && !menuList[i].childs){ //如果为根级且没有子级
          constantRouterMap[2].children.push(route)
        }else{
          routes.push(route)
        }
        
      }
    }
  }
  if (temp.length >= 1) {
    addDynamicRoutes(temp, routes)
  } else {
  }
  return routes
}

export default router