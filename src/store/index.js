import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import iframe from './modules/iframe'
import menu from './modules/menu'
import permission from './modules/permission'
import websock from './modules/websocket'
import alarm from './modules/alarm'
import getters from './getters'
import broadcast from './modules/broadcast'
import project from './modules/project'
import baseData from './modules/baseData'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    iframe,
    menu,
    permission,
    websock,
    broadcast,
    project,
    alarm,
    baseData
  },
  getters
})

export default store
