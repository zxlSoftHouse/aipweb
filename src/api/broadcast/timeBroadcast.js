import request from '@/utils/request'
import qs from 'qs'
import broadcast from '@/Global'

export default{
  getList(data){ //获取任务列表
    return request({
      url:'/audioSer/php/gettaskdata.php',
      method: 'post',
      data: qs.stringify({'jsondata':data})
    })
  },
  add(data) { //新增
    return request({
      url:'/audioSer/php/addtaskinfo.php',
      method: 'post',
      data: qs.stringify({'jsondata':data})
    })
  },
  exetaskcmd(data) {  //删除
    return request({
      url:'/audioSer/php/exetaskcmd.php',
      method: 'post',
      data: qs.stringify({'jsondata':data})
    })
  },

  edit(data) {  //编辑
    return request({
      url:'/audioSer/php/gettaskinfo.php',
      method: 'post',
      data: qs.stringify({'jsondata':data})
    })
  },

  taskEdit(data) {  //任务编辑
    return request({
      url:'/audioSer/php/modifytaskinfo.php',
      method: 'post',
      data: qs.stringify({'jsondata':data})
    })
  },


  // 筛选终端信息
  singTask(data) {  //编辑
    return request({
      url:'/audioSer/php/getsingleterminaldata.php',
      method: 'post',
      data: qs.stringify({'jsondata':data})
    })
  }
}