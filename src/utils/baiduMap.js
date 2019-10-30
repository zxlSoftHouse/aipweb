//引入百度地图API
function loadJScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://api.map.baidu.com/api?v=2.0&ak=uwpPNkPSi7aX8aBwGqF6d6RcGCksZrTG&callback=init";
    document.body.appendChild(script);
}
function init(){
    // 百度地图API功能
    var map = new BMap.Map("allmap",{mapType:BMAP_SATELLITE_MAP}); //初始化时默认使用混合地图
    map.centerAndZoom(new BMap.Point(118.739397,32.044877), 15);  // 初始化地图,设置中心点坐标和地图级别
    //添加地图类型控件	  
    map.setCurrentCity("南京");          // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    
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
    for(var i = 0; i<adds.length; i++){
        var marker = new BMap.Marker(adds[i]);
        marker.addEventListener("click",attribute);
        map.addOverlay(marker);
        marker.setLabel(new BMap.Label("我是路灯:"+(i+1),{offset:new BMap.Size(20,-10)}));
    }
}

//标点点击事件
function attribute(){
    var p = this.getPosition();  //获取marker的位置
    alert("marker的位置是" + p.lng + "," + p.lat);    
}

window.onload = loadJScript;  //异步加载地图