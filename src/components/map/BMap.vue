<template>
  <baidu-map
    class="map"
    :center="mapInfo.center"
    :zoom="zoom"
    @ready="handler"
    :scroll-wheel-zoom="true"
    :map-click="setMarker?true:false"
    :double-click-zoom="setMarker?false:true"
    @dblclick="mapdbClick"
    @moving="syncCenterAndZoom"
    @moveend="syncCenterAndZoom"
    @zoomend="syncCenterAndZoom"
  >
    <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
    <bm-control anchor="BMAP_ANCHOR_TOP_RIGHT">
      <button @click="moveToLampPost()" class="map-button" :style="{color: !mapInfo.mapStyle?'#000':'#fff'}">
        <i class="iconfont icon-weizhi"></i>中心
      </button>
    </bm-control>
    <bm-control>
      <button @click="fullWindow()" class="map-button" :style="{color: !mapInfo.mapStyle?'#000':'#fff'}">
        <i class="iconfont icon-quanping"></i>全屏
      </button>
    </bm-control>
    <!-- 菜单 -->
		<map-menu v-if="mapInfo.mapMenu" @menuToggle="menuToggle" :mapMenu="mapInfo.mapMenu"></map-menu>
    <!-- 弹框 -->
    <keep-alive>
      <component 
        :is="mapInfo.mapDialog" 
        ref="mapDialog" 
        :mapStyle="mapInfo.mapStyle" 
        :rowId="mapDialogRowId" 
        :deviceInfo = "deviceInfo"
        @closeDialog="closeDialog">
      </component>
    </keep-alive>
    <!-- 标注点 -->
    <my-overlay
      v-for="(mark,index) in mapInfo.markerList"
      v-bind:key="index"
      :position="{lng: mark.lng, lat: mark.lat}"
      :rowId="mapInfo.markerRowIds[index]"
			:mapIcon="mapIcon"
			:iconFontColor="!mapInfo.mapStyle?'#000':'#fff'"
      @headCallBack="openDialog"
    ></my-overlay>
    <bm-marker
      v-if="setMarker"
      :position="mapInfo.markerPoint"
      :dragging="true"
      @dragend="dragend"
    >
     <!--  <bm-label
        content="拖拽定位"
        :labelStyle="{color: 'red', fontSize : '20px'}"
        :offset="{width: -25, height: 30}"
      /> -->
    </bm-marker>
  </baidu-map>
</template>
<script>
import MapMenu from "./map-components/menu"
import MyOverlay from "./map-components/MyOverlay"
let that;
export default {
  data() {
    return {
      center: { lng: 0, lat: 0 },
      zoom: 1,
      mapIcon: '',
      mapDialogRowId: '',
      deviceInfo: {}
    };
  },
  beforeCreate() {
    that = this;
  },
  components: {
    MapMenu,
    MyOverlay
    // DialogContent: () => import(`@/views/${that.mapInfo.mapDialogUrl}`)
  },
  watch:{
    deviceList:(n,o)=>{
      this.deviceList = n
    },
  },
  props: ["setMarker", "mapInfo", "deviceList"], // setMarker是否可以标注点位
  methods: {
    handler({ BMap, map }) {
      //初始化
      this.zoom = 9;
      this.mapIcon = this.mapInfo.mapIcon;
			if (this.mapInfo.mapMenu && this.mapInfo.mapMenu.length > 0) {
				this.mapIcon = this.mapInfo.mapMenu[0].icon;
			}
			map.setMapStyle({ style: this.mapInfo.mapStyle });
    },
    // 点击地图
    mapdbClick(e){
      this.mapInfo.markerPoint = e.point;
      this.$emit("changeMarker", e.point);
    },
    // 菜单切换
    menuToggle(code) {
      this.mapIcon = code;
			this.$emit('getPost', code);
    },
    moveToLampPost() {
      //定位到灯杆
      this.center = this.mapInfo.center;
      this.zoom = 15;
    },
    syncCenterAndZoom(e) {
      //实时获取地图位置和缩放
      const { lng, lat } = e.target.getCenter();
      this.center.lng = lng;
      this.center.lat = lat;
      this.zoom = e.target.getZoom();
    },
    openDialog(val) {
      //打开对话框
      if(this.$refs.mapDialog){
        this.$refs.mapDialog.dialogVisible = true;
        this.mapDialogRowId = val;
      }
      this.deviceInfo = this.deviceList.find(function (res) {
        return res.rowId == val;
      });
      
    },
    closeDialog() {
      this.$refs.mapDialog.dialogVisible = false;
    },
    fullWindow() {
      //全屏
      this.$router.push({ path: "/map" });
    },
    dragend(e) {
      //标注拖拽结束
      this.$emit("changeMarker", e.point);
    }
  }
};
</script>
<style lang="scss">
.map {
  width: 100%;
  height: 578px;
}
.map-button {
  background-color: transparent;
  border: none;
  i {
    font-size: 16px;
  }
}
.dark {
  > div {
    background: #08304A;
    .el-dialog__title,
    .el-dialog__body {
      color: #fff;
    }
  }
}
</style>
