import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import router from '@/router';
import Cookies from 'js-cookie';
// import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  // baseURL: 'https://www.easy-mock.com/mock/5c4fc69f9ccfcd0ae7ea0946/front',
  // baseURL: 'http://gateway:8080',
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (config.url === '/api/SERVICE-AUTH/oauth/token') {
    config.headers['Authorization'] = 'Basic Y2xpZW50OmNsaWVudA=='
  }
  if (config.url === '/api/SERVICE-AIP/ledResource/ledResourceUpload'){
    config.headers['Content-Type'] = 'multipart/form-data;boundary=----WebKitFormBoundaryN2h7RKLsbf5S5dJN'
  }
  if (Cookies.get("access_token")) {
    config.headers['access_token'] = Cookies.get("access_token") // 让每个请求携带自定义token 请根据实际情况自行修改
    config.headers['Authorization'] = 'bearer ' + Cookies.get("access_token")
  }else {
    router.push('/login');
  }
  return config
}, error => {
  // Do something with request error
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * code为非20000是抛错 可结合自己业务进行修改
  */
    const res = response.data
    if (res.code !== 20000) {
      // Message({
      //   message: res.data,
      //   type: 'error',
      //   duration: 5 * 1000
      // })

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm('登录过期，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      // return Promise.reject('error')
      return response.data
    } else {
      return response.data
    }
  },
  error => {
    if (error.response !== undefined && error.response.status === 401) {
      MessageBox.confirm('登录过期，请重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        type: 'warning'
      }).then(() => {
        Cookies.remove('access_token')
        location.reload()// 为了重新实例化vue-router对象 避免bug
      })
    }else if(error.response !== undefined && error.response.status === 404){ 
      if(error.response.data !== undefined && error.response.data.error !== undefined){
        Message({
          message: "请求服务掉线，请联系管理员",
          type: 'error',
          duration: 10 * 1000
        })
      }
    }else if(error.response !== undefined && error.response.status === 400){
      var errorObject = {"invalid_grant":"用户名密码错误","invalid_request":"错误请求"};
      if(error.response.data !== undefined && error.response.data.error !== undefined){
        Message({
          message: errorObject[error.response.data.error],
          type: 'error',
          duration: 10 * 1000
        })
      }
    }else{
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    
    return Promise.reject(error)
  }
)
export default service