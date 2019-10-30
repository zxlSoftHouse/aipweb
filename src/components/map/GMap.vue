<template>
    <div >
      <div id="map_canvas" style="height: 700px; width: 100%"></div>
    </div>
</template>
<script>
    export default {
        name: 'GGMap',
      data(){
          return{
            show:false,
            center: {lng: 120.5, lat: 30.2},
            markers: [{
              position: {lng: 120.4, lat: 30.2},
              orderId:'123456',
              name:'吴韩伟',
              show:false,
            }, {
              position: {lng: 120.5, lat: 30.2},
              orderId:'654321',
              name:'姚永琪',
              show:false,
            }],
            icon: '../../../static/img/qishou.png',
            position:{},
            websock:null,
 
          }
      },
      created(){
        //页面刚进入时开启长连接
        // this.initWebSocket()
      },
      destroyed: function() {
        //页面销毁时关闭长连接
        this.websocketclose();
      },
      mounted(){
      this.mapBuild() //初始化实例之后调用
      },
      methods:{
        //  地图实例
        mapBuild(){
            //创建地图实例，zoom是缩放比例
          let map = new google.maps.Map(document.getElementById('map_canvas'), {
            zoom: 12,
            center: this.center,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          });
            //这里因为需要很多标记，所以遍历了this.markers（后端给的数据）来循环创建标记
          this.markers.map(item=>{
            let marker = new MarkerWithLabel({
              position: item.position,
              icon: '../../../static/img/qishou.png', //标记自定义图标
              draggable: false, //不可拖动
              map: map,   //地图实例 
              labelContent: item.name,    //label的内容
              labelAnchor: new google.maps.Point(22, 0),    //label的位置，可以调
              labelClass: "labels", // the CSS class for the label
              labelStyle: { background:'#fff',padding:'5px' }
            });
            //自定义信息窗口
            let iw = new google.maps.InfoWindow({
              content: `<div>
                          <p>订单编号： ${item.orderId}</p>
                          <p>快递员：${item.name}</p>
                        </div>`});
            //点击信息窗口显示
            google.maps.event.addListener(marker, "click", function (e) { iw.open(map, marker); });
          })
        },
      },
    }
</script>
