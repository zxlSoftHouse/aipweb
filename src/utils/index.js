/**
 * Created by jiachenpan on 16/11/18.
 */

function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

function formatSeconds(endTime){
  let secondTime = parseInt(endTime)//将传入的秒的值转化为Number
  let min = 0// 初始化分
  let h =0// 初始化小时
  let result=''
  if(secondTime>60){//如果秒数大于60，将秒数转换成整数
    min=parseInt(secondTime/60)//获取分钟，除以60取整数，得到整数分钟
    secondTime=parseInt(secondTime%60)//获取秒数，秒数取佘，得到整数秒数
    if(min>60){//如果分钟大于60，将分钟转换成小时
      h=parseInt(min/60)//获取小时，获取分钟除以60，得到整数小时
      min=parseInt(min%60) //获取小时后取佘的分，获取分钟除以60取佘的分
    }
  }
 result=`${h.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}:${secondTime.toString().padStart(2,'0')}`
  return result 
}   

export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}

export function formatTime(time, option) {
  // time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
   // 据上一次触发时间间隔
    const last = +new Date() - timestamp

   // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
     // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
   // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

  //表格 记忆选择核心方法 multipleSelectionAllIds已经选中的ID数组集合（包括分页） multipleSelection当前页面选中的 tableData当前页列表数据
function changePageCoreRecordData (multipleSelectionAllIds,multipleSelection,tableData) {
    // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
    let multipleSelectionAll = []; //初始化新的数组，否则会出现重复值
    if (multipleSelectionAllIds.length <= 0) {
      multipleSelectionAll = multipleSelection;
      return getSelectedIds(multipleSelectionAll);
    }
    // 获取当前页选中的id
    multipleSelection.forEach(row=>{
      // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
      if (multipleSelectionAllIds.indexOf(row.rowId) < 0) {
        multipleSelectionAllIds.push(row.rowId);
      }
    })
    // 取当前页所有数据与选中数据差值（未选中的对象）
    let multipleNoSelectionAll = tableData.filter(row => !multipleSelection.includes(row))
    multipleNoSelectionAll.map(res=>{
      if(multipleSelectionAllIds.indexOf(res.rowId) > -1){
        multipleSelectionAllIds.splice(multipleSelectionAllIds.indexOf(res.rowId),1)
      }
    })
    multipleSelectionAllIds = Array.from(new Set(multipleSelectionAllIds));
    return multipleSelectionAllIds;
  };

  // 获取数组对象的id组成新数组
  function getSelectedIds(multipleSelection){
    let selectedIds = [];
    multipleSelection.map(it=>{
      selectedIds.push(it.rowId);
    })
    selectedIds = Array.from(new Set(selectedIds));
    return selectedIds;
  }

  //表格 默认选中复选框 multipleSelectionAllIds已经选中的ID数组集合（包括分页） refTableName当前表格对象 tableData当前页列表数据
  function setSelectRow(multipleSelectionAllIds,refTableName,tableData) {
    if (!multipleSelectionAllIds || multipleSelectionAllIds.length <= 0) {
      return;
    }
    refTableName.clearSelection();
    tableData.map(val=>{
      if(multipleSelectionAllIds.indexOf(val.rowId)!=-1){          
        refTableName.toggleRowSelection(val,true);
      }
    }) 
  };

  
  function isIE() {
    let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
    let isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器 
    let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    return isIE || isIE11;
  }
/**
 * 获取当前运行环境
 */
const isDev = (process.env.NODE_ENV === 'development')

export { debounce, isDev, setSelectRow, changePageCoreRecordData, parseTime, formatSeconds, isIE }
