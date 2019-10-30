import request from '@/utils/request'
export default {
	getPermission() {
		return request({
			url: '/api/SERVICE-AUTH/authorize/queryPermissionByUserId',
			method: 'get'
		})
	}
}