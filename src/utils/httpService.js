/*
 *请求方法
 * 
 */
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
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
  * code为非200是抛错 可结合自己业务进行修改
  */
    const res = response;
    if (res.status !== 200) {
      Message({
        message: res.statusText,
        type: 'error',
        duration: 5 * 1000
      })

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
      return Promise.reject('error')
    } else {
      return response
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export const httpService = {
  apiGet(url, data) {
    return new Promise((resolve, reject) => {
      service.get(url, data).then((response) => {
        resolve(response.data)
      }, (response) => {
        reject(response)
        // _g.closeGlobalLoading()
        // bus.$message({
        //   message: '请求超时，请检查网络',
        //   type: 'warning'
        // })
      })
    })
  },
  apiPost(url, data) {
    return new Promise((resolve, reject) => {
      service.post(url, data).then((response) => {
        resolve(response.data)
      }).catch((response) => {
        resolve(response)
        // console.clear();
        // bus.$message({
        //   message: '请求超时，请检查网络',
        //   type: 'warning'
        // })
      })
    })
  },
  apiDelete(url, id) {
    return new Promise((resolve, reject) => {
      axios.delete(url + id).then((response) => {
        resolve(response.data)
      }, (response) => {
        reject(response)
        // _g.closeGlobalLoading()
        // console.clear();
        // bus.$message({
        //   message: '请求超时，请检查网络',
        //   type: 'warning'
        // })
      })
    })
  },
  apiPut(url, id, obj) {
    return new Promise((resolve, reject) => {
      axios.put(url + id, obj).then((response) => {
        resolve(response.data)
      }, (response) => {
        // _g.closeGlobalLoading()
        // console.clear();
        // bus.$message({
        //   message: '请求超时，请检查网络',
        //   type: 'warning'
        // })
        reject(response)
      })
    })
  },
  handelResponse(res, cb, errCb) {
    // _g.closeGlobalLoading()
    if (res.code == 200) {
      cb(res.data)
    } else {
      if (typeof errCb == 'function') {
        errCb()
      }
      this.handleError(res)
    }
  },
  handleError(res) {
    if (res.code) {
      switch (res.code) {
        case 101:
          if (Cookies.get('rememberPwd')) {
            let data = {
              rememberKey: Lockr.get('rememberKey')
            }
            this.reAjax('admin/base/relogin', data).then((res) => {
              this.handelResponse(res, (data) => {
                this.resetCommonData(data)
              })
            })
          } else {
            _g.toastMsg('error', res.error)
            setTimeout(() => {
              router.replace('/')
            }, 1500)
          }
          break
        case 103:
          _g.toastMsg('error', res.error)
          setTimeout(() => {
            router.replace('/')
          }, 1500)
          break
        // case 400:
        //   this.goback()
        //   break
        default :
          _g.toastMsg('error', res.error)
      }
    } else {
    }
  },
  resetCommonData(data) {
    _(data.menusList).forEach((res, key) => {
      if (key == 0) {
        res.selected = true
      } else {
        res.selected = false
      }
    })
    Lockr.set('menus', data.menusList)              // 菜单数据
    Lockr.set('authKey', data.authKey)              // 权限认证
    Lockr.set('rememberKey', data.rememberKey)      // 记住密码的加密字符串
    Lockr.set('authList', data.authList)            // 权限节点列表
    Lockr.set('userInfo', data.userInfo)            // 用户信息
    Lockr.set('sessionId', data.sessionId)          // 用户sessionid
    window.axios.defaults.headers.authKey = Lockr.get('authKey')
    let routerUrl = ''
    if (data.menusList[0].url) {
      routerUrl = data.menusList[0].url
    } else {
      if (data.menusList[0].child[0].child) {
        routerUrl = data.menusList[0].child[0].child[0].url
      } else {
        routerUrl = data.menusList[0].child[0].url
      }
    }
    setTimeout(() => {
      let path = this.$route.path
      if (routerUrl != path) {
        router.replace(routerUrl)
      } else {
        _g.shallowRefresh(this.$route.name)
      }
    }, 1000)
  },
  reAjax(url, data) {
    return new Promise((resolve, reject) => {
      axios.post(url, data).then((response) => {
        resolve(response.data)
      }, (response) => {
        reject(response)
        // console.clear();
        // bus.$message({
        //   message: '请求超时，请检查网络',
        //   type: 'warning'
        // })
      })
    })
  },


  /**
   * 日期格式化,传入为毫秒数,转出时间格式为 ：2011-6-6 12:00:00
   * @objD 必填，格式为毫秒数
   */
  formatDate: function (objD) {
    if (!objD) {
      return '';
    }

    objD = new Date(objD);
    var str;
    var yy = objD.getYear();
    if (yy < 1900) yy = yy + 1900;
    var MM = objD.getMonth() + 1;
    if (MM < 10) MM = '0' + MM;
    var dd = objD.getDate();
    if (dd < 10) dd = '0' + dd;
    var hh = objD.getHours();
    if (hh < 10) hh = '0' + hh;
    var mm = objD.getMinutes();
    if (mm < 10) mm = '0' + mm;
    var ss = objD.getSeconds();
    if (ss < 10) ss = '0' + ss;
    str = yy + "-" + MM + "-" + dd + " " + hh + ":" + mm + ":" + ss;
    return (str);
  },
  /**
   * 日期格式化,传入为毫秒数,转出时间格式为 ：2016-6-6
   * @objD 必填，格式为毫秒数
   */
  formatDate2: function (objD) {
    if (!objD) {
      return '';
    }
    objD = new Date(objD);
    var str;
    var yy = objD.getYear();
    if (yy < 1900) yy = yy + 1900;
    var MM = objD.getMonth() + 1;
    //if(MM<10) MM = '0' + MM;
    var dd = objD.getDate();
    //if(dd<10) dd = '0' + dd;
    //去掉0 我的圈子 加入圈子，布局放不下。。
    str = yy + "-" + MM + "-" + dd;
    return (str);
  },

  /**
   * 获取url参数
   */
  getUrlFn: function () {
    var querystr = window.location.href.split("?"),
      // var querystr = "http://xxxx.com/recharge.html?mid=&version=7701&from=music".split("?"),
      GETs = "",
      GET = "";
    if (querystr[1]) {
      GETs = querystr[1].split("&");
      GET = [];
      for (i = 0; i < GETs.length; i++) {
        tmp_arr = GETs[i].split("=");
        var key = tmp_arr[0];
        GET[key] = tmp_arr[1];
      }
    }
    return GET;
    // return querystr[1];
  },
  /**
   * 获取url data参数。aa.html?data={}
   */
  getUrlData: function () {
    var purl = window.location.href;
    purl = purl.substr(purl.indexOf("?") + 1);
    var urlData = JSON.parse(decodeURI(purl.substr(purl.indexOf("=") + 1)));
    return urlData;
  },
};
