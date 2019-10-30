import request from '@/utils/request'
import qs from 'qs'

export default{
  getList(data){ //获取任务列表
    return request({
      url: '/audioSer/php/getzoneterminaldata.php',
      method: 'post',
      data: qs.stringify({'jsondata':data})
    })
  },
  add(data) { //新增
    return request({
      url: '/audioSer/php/newterminal.php',
      method: 'post',
      data: qs.stringify({'jsondata':data})
    })
  },
  edit(data) { //编辑
    return request({
      url:'/audioSer/php/setterminal.php',
      method: 'post',
      data: qs.stringify({'jsondata':data})
    })
  },
  doDelete(data) {  //删除
    return request({
      url:'/audioSer/php/delterminal.php',
      method: 'post',
      data: qs.stringify({'jsondata':data})
    })
  },

  settervolume(data) {  //音量调节
    return request({
      url:'/audioSer/php/settervolume.php',
      method: 'post',
      data: qs.stringify({'jsondata':data})
    })
  }
}