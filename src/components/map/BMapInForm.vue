<template>
  <div class="map" style="width:100%;height:100%;">
    <div id="map-core" style="width:100%;height:100%;"></div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  data () {
    return {
      isHomePage:this.flag,
      position:{
        longitude:'',
        latitude:''
      }
    }
  },
  mounted () {
    this.setMap()
  },
  props:{
    flag:Boolean
  },
  methods: {
    // 初始化地图
    setMap () {
        var vm = this;
        if(!this.isHomePage){
          this.map = new BMap.Map('map-core')
          this.map.centerAndZoom(new BMap.Point(118.739397,32.044877), 15);  // 初始化地图,设置中心点坐标和地图级别
          this.map.enableScrollWheelZoom(true)
          //单击获取点击的经纬度
          this.map.addEventListener("click",function(e){
            this.clearOverlays();    
            vm.position.longitude = e.point.lng;
            vm.position.latitude = e.point.lat;
            vm.$emit('getPosition',vm.position);
            var marker = new BMap.Marker(new BMap.Point(e.point.lng,e.point.lat));
            this.addOverlay(marker);
          });
        }else{
          this.map = new BMap.Map('map-core',{mapType:BMAP_SATELLITE_MAP})
          this.map.centerAndZoom(new BMap.Point(118.739397,32.044877), 15);  // 初始化地图,设置中心点坐标和地图级别
          this.map.enableScrollWheelZoom(true)
          // 地图缩放控件
          const topLeftControl = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT})
          // 城市选择控件
          const cityListControl = new BMap.CityListControl({anchor: BMAP_ANCHOR_TOP_RIGHT})
          // 比例尺控件
          const topLeftNavigation = new BMap.NavigationControl()
          this.map.addControl(topLeftControl)
          this.map.addControl(topLeftNavigation)
          this.map.addControl(cityListControl)
          this.drawLocation()
        }
    },
    // 根据经纬度绘制地图中的坐标点
    drawLocation () {
        var index = 0;
        var myGeo = new BMap.Geocoder();
        var adds = [
            new BMap.Point(118.79397,32.084177),
            new BMap.Point(118.719397,32.074278),
            new BMap.Point(118.777397,32.064379),
            new BMap.Point(118.769397,32.054476),
            new BMap.Point(118.759397,32.044575),
            new BMap.Point(118.749397,32.014674),
            new BMap.Point(118.729397,32.024773),
            new BMap.Point(118.739397,32.034872)
        ];

        //绑定点击事件
        for(var i = 0; i<adds.length; i++){
            var marker = new BMap.Marker(adds[i]);
            var clickFunction = function(marker){
              return function(event){
                var p = marker.getPosition();  //获取marker的位置
                alert("marker的位置是" + p.lng + "," + p.lat);
              }
            }(marker);
            marker.addEventListener("click",clickFunction);
            this.map.addOverlay(marker);
            marker.setLabel(new BMap.Label("我是路灯:"+(i+1),{offset:new BMap.Size(20,-10)}));
        }
    },
  },
}
</script>