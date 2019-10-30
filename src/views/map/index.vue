<template>
  <bmap 
  class="map-container" 
  :setMarker="false" 
  :mapInfo="mapInfo"
  :deviceList="deviceList"
  @getPost="getPost">
  </bmap>
</template>
<style scoped>
  .map-container {
    height: 100%;
  }
</style>
<script>
import bmap from '@/components/map/BMap'
import mapAPI from '@/api/common/map'
import { mapState } from 'vuex';

export default {
  data() {
    return {
      //地图信息
      mapInfo: {
        mapDialog: '',
        mapStyle: '',
        center:{lng:'',lat:''},//中心点
        markerPoint:{lng:'',lat:''},//正在标记的点坐标
        markerList:[], //标注点
        markerRowIds: [],
        mapMenu: [
          {
            title: '灯杆',
            icon: 'tubiao-zhihuidenggan',
            dialog: 'lampDialog'
          },
          {
            title: '广播',
            icon: 'broadcast',
            dialog: 'broadcastDialog'
          },
          {
            title: '传感器',
            icon: 'chuanganqi',
            dialog: 'sensorDialog'
          },
          {
            title: '视频监控',
            icon: 'shipingtonghua',
            dialog: 'monitorDialog'
          },
          {
            title: '一键报警',
            icon: 'app_icons--',
            dialog: 'alarmDialog'
          }
        ]
      },
      mapData: {},
      deviceList: [], //当前类型设备的列表数据（接口完整数据）
    } 
  },
  computed:{
    ...mapState({
      projectId: state=>state.project.projectId,
    }),
  },
  methods: {
    getPost(code) {
      this.mapInfo.mapMenu.map(item=>{
        this.clearMapPoint();
        if (code == item.icon) {
          this.mapInfo.mapDialog = item.dialog;
          if (item.title == '灯杆') {
            this.getLampPost();
          } else if (item.title == '传感器') {
            this.getSensorPost();
          } else if (item.title == '视频监控') {
            this.getMonitorPost();
          } else if (item.title == '一键报警') {
            this.getAlarmPost();
          }
        }
      });
    },
    // 灯杆
    getLampPost() {
      mapAPI.getLampPost(this.projectId).then(res=>{
        this.mapData.lampList = res;
        this.initMapPoint('lampList');

		  });
    },
    // 传感器
    getSensorPost() {
      mapAPI.getSensorPost().then(res=>{
        this.mapData.sensorList = res;
        this.initMapPoint('sensorList');
		  });
    },
    // 视频监控
    getMonitorPost() {
      mapAPI.getMonitorPost().then(res=>{
        let data = res.data.data;
        this.mapData.monitorList = [];
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].childs.length; j++) {
            this.mapData.monitorList.push(data[i].childs[j]);
          }
        }
        this.initMapPoint('monitorList');
		  });
    }, 
    // 一键报警
    getAlarmPost() {
      mapAPI.getAlarmPost().then(res=>{
        this.mapData.alarmList = res.data.data.records;
        this.initMapPoint('alarmList');
		  });
    },
    initMapPoint(res) {
      this.deviceList = this.mapData[res];
      this.mapInfo.markerRowIds = this.mapData[res].map(item=>item.rowId);
      this.mapInfo.markerList = this.mapData[res].map(item=>new BMap.Point(item.longitude,item.latitude));
      if(this.mapInfo.markerList[0]){
        this.mapInfo.center.lng = this.mapInfo.markerList[0].lng;
        this.mapInfo.center.lat = this.mapInfo.markerList[0].lat;
      }else{        
        this.$notify({
          title: "提示",
          message: "暂无数据",
          type: "warning",
          position: 'bottom-right'
        });
      }
    },
    clearMapPoint() {
      this.mapInfo.markerRowIds = [];
      this.mapInfo.markerList = [];
      this.mapInfo.center.lng = '';
      this.mapInfo.center.lat = '';
    }
  },
  created(){
    this.mapInfo.mapDialog = this.mapInfo.mapMenu[0].dialog;
		this.getLampPost();
	},
  mounted() {
  },
  components:{
    bmap
  },
}
</script>