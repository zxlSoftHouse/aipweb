import Vue from 'vue'
import { parseTime } from './index'
export default (function () {
  // 摄像头类型
  Vue.filter('cameraType', function (value) {
    if (value == 0) {
      return '枪机'
    } else if (value == 1) {
      return '半球'
    } else if (value == 2) {
      return '球机'
    } else {
      return '未知状态'
    }
  });
  // 摄像头设备状态
  Vue.filter('cameraStatusFlag', function (value) {
    if (value == 0) {
      return '不在线'
    } else if (value == 1) {
      return '在线'
    } else {
      return '未知状态'
    }
  });
  // 摄像头-是否为nvr
  Vue.filter('isNVR', function (value) {
    if (value == 0) {
      return 'IPC'
    } else if (value == 1) {
      return 'NVR'
    } 
  });
  Vue.filter('date', function (value) {
    var date = parseTime(value, '{y}-{m}-{d}');
    return date
  });
  // 广播-终端设备状态
  Vue.filter('equipTaskFlag', function (value) {
    if (value == 0) {
      return '空闲'
    } else if (value == 1) {
      return '执行中'
    } 
  });
  // 定时广播
  Vue.filter('broadcastTaskFlag', function (value) {
    if (value == 0) {
      return '未运行'
    } else if (value == 1) {
      return '自动运行'
    } else if (value == 2) {
      return '手动运行'
    } 
  });
})()
