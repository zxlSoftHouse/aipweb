import request from '@/utils/request'
import qs from 'qs'

export function login(userInfo) {
  return request({
    url: '/api/SERVICE-AUTH/oauth/token',
    method: 'post',
    data: qs.stringify(userInfo)
  })
}

export function getInfo(token) {
  return request({
    url: '/user/get' + '?access_token=' + token,
    method: 'get'
  })
}

export function logout(token) {
  return request({
    url: '/SERVICE-AUTH/logout/exit',
    method: 'post',
    params: { access_token: token }
  })
}

