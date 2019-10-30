<template>
  <transition name="rotate-fall">
    <div id="app">
      <el-container>
        <router-view class="app-router-view"></router-view>
      </el-container>
    </div>
  </transition>
</template>

<script>
import 'vue-transition.css'
import '@/assets/css/common.css'
export default {
  name: 'App',
  data() {
      return {
          //使用messageId作为弹窗的key，用来获取弹窗的实例，以对对应弹窗进行操作
          notifications: {}
      };
  },
  mounted(){
        
    this.initWebSocket();
  },
  methods:{
    initWebSocket(){
      this.websock = new WebSocket(this.GLOBAL.wsuri); 
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onmessage = this.websocketonmessage; 
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      console.log("WebSocket连接成功");
    },
    websocketonerror(e) { //错误
      console.log("WebSocket连接发生错误");
    },
    websocketonmessage(e){ //数据接收 
      let redata = JSON.parse(e.data);
      // redata.data = JSON.parse(redata.data)
      console.log(redata)
      if(redata.type==='alarm'){
        let messageId = redata.data.deviceNo
        if(redata.code==='notice' && this.$store.state.project.projectId == redata.data.projectId){          //报警提示
          const h = this.$createElement;
          // let messageId = new Date().getTime();
          let notify = this.$notify({
            title: '警告',
            message: h('a',{            
              on:{
                click: () => {
                  this.toAlarm(redata.data,messageId)
                },
              }
            },redata.data.deviceName+'正在报警，点击查看！'),
            type: 'warning',
            position: 'bottom-right',
            duration: this.GLOBAL.alarmTimeOut, //10分钟未接警自动关闭
          });        
          //将messageId和通知实例放入字典中
          this.notifications[messageId] = notify;

          //将报警信息存入VUEX用于GIS页面提示
          this.$store.commit("setGisTip",{rowId:redata.data.rowIdStr,flag:true})
        }else if(redata.code==='progress'){ //其他地方接警
          this.$message({
            type: 'warning',
            message: redata.data.deviceName+'已被接警'
          });
          this.closeNotification(messageId); //清除当前报警提示
          //将报警信息存入VUEX用于GIS页面提示
          this.$store.commit("setGisTip",{rowId:redata.data.rowIdStr,flag:false})
        }
      }
      
      if(redata.code==='lighting'){
        this.$store.dispatch('SET_SOCKETDATA',redata)
      }else{
        this.$store.dispatch('SET_CODE',redata.code)
      }
    }, 
    websocketsend(agentData){//数据发送 
      this.websock.send(agentData); 
    }, 
    websocketclose(e){ //关闭 
      console.log("connection closed (" + e.code + ")"); 
    },

    //关闭单个通知
    closeNotification(messageId){
        this.notifications[messageId].close();
        delete this.notifications[messageId];
    },
    
    //关闭所有通知
    closeAllNotification(){
        let _this = this;
        for (let key in _this.notifications) {
            _this.notifications[key].close();
            delete _this.notifications[key];
        }
    },

    toAlarm(data,messageId){
      this.closeNotification(messageId);
      this.$store.commit('setAlarmInfo', data)
      this.$router.push({path: '/alarm/show'})
    }
  }
}

</script>
<style>
  #app .app-router-view {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    backface-visibility: hidden;
    transform: translate3d(0, 0, 0);
    transform-style: preserve-3d;
    visibility: visible;
  }
</style>
