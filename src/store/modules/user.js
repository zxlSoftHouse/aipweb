import { login, logout, getInfo } from '@/api/sysManage/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { httpService } from '../../utils/httpService';
import Cookies from "js-cookie";
import { Message, MessageBox } from 'element-ui'
const user = {
  state: {
    // token : getToken(),
    token : Cookies.get("access_token"),
    name  : '',
    avatar: '',
    roles : [],
	  perms : []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
	SET_PERMS: (state, perms) => {
	  state.perms = perms		
	}
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      commit("SET_TOKEN", "");
      Cookies.remove("access_token");   
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          Cookies.set("access_token", response.access_token, { expires: 1 / 3 }); //设置token
          // Cookies.set('userId', res.uid); //设置用户id，
          commit("SET_TOKEN", response.access_token);
          resolve()
        }).catch(error => {
          console.log(error);
          if (error.response.data.error == "invalid_grant") {
            Message.error('用户名或密码错误');
          }
          if (error.response.data.error == "unauthorized") {
            Message.error('登录失败,请重新输入');
          }
          reject(error);
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          console.log(response);
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

  }
}

export default user
