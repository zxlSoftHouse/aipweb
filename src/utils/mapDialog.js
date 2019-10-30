import LampDialog from "@/views/map/lamp/index.vue"
import BroadcastDialog from "@/views/map/broadcast/index.vue"
import SensorDialog from "@/views/map/sensor/index.vue"
import MonitorDialog from "@/views/map/monitor/index.vue"
import AlarmDialog from "@/views/map/alarm/index.vue"

const MapDialog = {
  install(Vue) {
    Vue.component('LampDialog', LampDialog);
    Vue.component('BroadcastDialog', BroadcastDialog);
    Vue.component('SensorDialog', SensorDialog);
    Vue.component('MonitorDialog', MonitorDialog);
    Vue.component('AlarmDialog', AlarmDialog);
  }
}

export default MapDialog