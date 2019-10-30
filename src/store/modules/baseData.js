import baseDataApi from '@/api/common/baseData'
import Cookies from 'js-cookie'
const baseData = {
  state: {
    deviceType: Cookies.get('deviceType')?JSON.parse(Cookies.get('deviceType')) : [],//设备类型
    lampList: Cookies.get('lampList')?JSON.parse(Cookies.get('lampList')) : [],//灯杠
    deviceTender: Cookies.get('deviceTender')?Cookies.get('deviceTender') : [],//设备厂家
  },
  mutations: {
    // 设备类型
    SET_DEVICETYPE: (state, data) => {
      state.deviceType = data
			Cookies.set('deviceType', data)
    },  
    // 项目灯杆列表  
    SET_LAMPLIST: (state, data) => {
      state.lampList = data
			Cookies.set('lampList', data)
    }, 
    // 设备厂家  
    SET_DEVICETENDER: (state, data) => {
      state.deviceTender = data
			Cookies.set('deviceTender', data)
    }, 
  },
  actions: {
    setdeviceType({ commit }, deviceType) {
      commit('SET_DEVICETYPE', deviceType)
    },
    getdeviceType({ commit }){
        baseDataApi.getdeviceType().then(response => {    
            commit('SET_DEVICETYPE', response)
        }).catch(error => {
            console.log(error);
            Message.error('服务器异常');
        })
    },
    getLampList({ commit ,rootState}){
        let params = {projectId:rootState.project.projectId,roadId:''}
        baseDataApi.getLampList(params).then(response => {    
            commit('SET_LAMPLIST', response)
        }).catch(error => {
            console.log(error);
            Message.error('服务器异常');
        })
    },
  }
}

export default baseData
