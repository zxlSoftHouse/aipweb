import Vue from 'vue'
import BaiduMap from 'vue-baidu-map'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import 'fullcalendar/dist/fullcalendar.min.css'
import '@/assets/css/index.scss' // global css
import App from './App'
import router from './router'
//引入状态管理 Vuex
import store from './store'
import '@/components/icons' // icon
// import '@/permission' // permission control
import i18n from './lang'
import FullCalendar from 'vue-full-calendar'
import dictionary from './components/Dictionary/dictionary.js'
import * as utils from './utils/index.js' //导入公用工具类方法
import VueParticles from 'vue-particles'
import Vcomp from './components/index'
import VueLayers from 'vuelayers'
import 'vuelayers/lib/style.css' // needs css-loader
import _global from './Global'  //全局变量
import axios from 'axios'
import filter from './utils/filter' // 过滤器 字典表
import MapDialog from './utils/mapDialog'
import alarmCtrl from './utils/alarmCtrl.js'; //导入一键报警公共方法
import importJs from './common/importJs.js'

import echarts from 'echarts'
Vue.prototype.$echarts = echarts
import china from 'echarts/map/json/china.json'
echarts.registerMap('china', china)

Vue.prototype.$alarm = alarmCtrl;  //一键报警公共方法全局变量。
Vue.use(MapDialog);
Vue.prototype.$axios = axios;
Vue.prototype.GLOBAL = _global;
Vue.use(VueLayers)
Vue.prototype.$utils = utils  
Vue.use(VueParticles);
Vue.use(Vcomp);
Vue.use(dictionary);
Vue.use(FullCalendar); 
Vue.use(ElementUI, {
  locale,
  size: 'medium',                           // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
});
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'uwpPNkPSi7aX8aBwGqF6d6RcGCksZrTG'
});

Vue.config.productionTip = false
new Vue({
  el: '#app',
  filters: filter,
  router,
  store,
  i18n,
  template  : '<App/>',
  components: { App }
})
