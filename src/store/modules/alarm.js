
import { Message, MessageBox } from 'element-ui'
const user = {
  state: {
    alarmInfo: {},//正在接警的信息
    GISTip: {},
  },

  mutations: {
    setAlarmInfo: (state, alarmInfo) => {
      state.alarmInfo = alarmInfo;
    },
    setGisTip: (state, alarmOnOff) => {
      state.GISTip = alarmOnOff;
    },
  },

  actions: {
    setAlarmInfo: (state, alarmInfo) => {
      state.alarmInfo = alarmInfo;
    },
      
  }
}

export default user
