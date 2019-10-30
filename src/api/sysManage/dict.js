import request from '@/utils/request'

export function getDict(indexCode) { //获取单个字典的所有值
  return request({
    url: '/api/SERVICE-MD/dic/queryDataByIndex/'+indexCode,
    method: 'get'
  })
}