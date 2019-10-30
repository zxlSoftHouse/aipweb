import request from '@/utils/request'
import qs from 'qs'
import broadcast from '@/Global'

// import store from '../../store'
export default{
  getList(data){ //获取任务列表
    return request({
      url:'/audioSer/php/getmediadata.php',
      method: 'post',
      data: qs.stringify({'jsondata':data})
    })
  },
  // 删除媒体文件
  delMedia(data){ //获取任务列表
    return request({
      url:'/audioSer/php/delmediadata.php',
      method: 'post',
      data: qs.stringify({'jsondata':data})
    })
  }
}