<template>
  <bm-control>
    <el-dialog ref="dialog" title="一键报警" 
    id="mapAlarmDialog"
    :visible.sync="dialogVisible" 
    :modal-append-to-body='false' 
    :close-on-click-modal='false'
    @close="dialogVisible = false">
        <!-- 视频播放模块 -->
        <el-row :gutter="24">
          <el-col :span="16" ref="alarmCol">
            <alarmShow ref="alarmShow" info="controlVideoInfo"></alarmShow>
          </el-col>
          <el-col :span="8">
            <el-form :inline="true"
                label-position="left" class="demo-table-expand" label-width="150px">
                <div>
                <el-form-item label="终端名称">
                  <span >{{ deviceInfo.deviceName }}</span>
                </el-form-item>
                <el-form-item label="终端编号">
                  <span >{{ deviceInfo.deviceNo }}</span>
                </el-form-item>
                <el-form-item label="归属灯杆">
                  <span >{{ deviceInfo.lampPostCode }}</span>
                </el-form-item>
                <el-form-item label="设备状态">
                  <span >{{ deviceInfo.statusFlag===2 || !deviceInfo.statusFlag ?'离线':'在线' }}</span>
                </el-form-item>                
                <el-form-item>
                  <el-button type="primary" @click="play">播放</el-button>
                  <el-button @click="stop">停止</el-button>
                </el-form-item>
                </div>
            </el-form>
          </el-col>
        </el-row>
    </el-dialog>
    <remote-script id='alarmCtrl' src='../../../static/alarmCtrl.js'></remote-script>
  </bm-control>

</template>

<script>
import alarmShow from '@/components/alarmShow/index'
import api from '@/api/alarm/alarm'
import { mapGetters, mapState } from 'vuex'
import { isIE } from '@/utils/index'
export default {
  props: ["deviceInfo"],
  data() {
    return {
      dialogVisible: false,
    }
  },
  mounted(){
    //监听报警登录
    if(isIE()) pubsub.on('login', this.loginListener);

  },
  methods: {
      loginListener(data){
        if(data.state==='success'){
          this.playVideo(this.deviceInfo)
        }else{        
          this.$message.error(data.msg);
        }
      },
      playVideo(row, column, event){
        if(!row.statusFlag || row.statusFlag===2){
          this.$message.error("该设备不在线不能播放");
        }else{
          this.$refs.alarmShow.$emit('PlayVideo',row.deviceNo);
        }
      },

      play(){
        this.$refs.alarmShow.$emit('SetLayout', 1);
        this.playVideo(this.deviceInfo)
      },

      stop(){        
          this.$refs.alarmShow.$emit('CloseAllVideo');
          this.$refs.alarmShow.$emit('SetLayout', 1);
      }
  },
  watch:{
    'dialogVisible': function(newVal){
        if(newVal){
          setTimeout(()=>{            
            this.$nextTick(function () {
              let dialogW = this.$refs.alarmCol.$el.clientWidth-20;
              if(isIE()) this.$alarm.SetOcxSize(dialogW, 592)
            })
            if(!this.deviceInfo.statusFlag || this.deviceInfo.statusFlag===2){
              this.$message.error("该设备不在线不能播放");
            }else{
              if(isIE()) this.$alarm.loginAlarm();
            }
          }, 100)
        }else{
           if(isIE()) VSPOcxClient.LogoutServer();//退出登录，避免重复监听
        }
     },
     deviceInfo:(n,o)=>{
       this.deviceInfo = n;
     },
  },
  destroyed(){
    if(isIE()){
      let loginout = VSPOcxClient.LogoutServer();//退出登录，避免重复监听
      this.$store.commit('setAlarmInfo', {});//避免未报警进入时打开监控
      pubsub.off('login', this.loginListener);
    }
  },
  components:{
    alarmShow
  },
}
</script>

<style>

#mapAlarmDialog .el-dialog {
        color: #ffffff;
        background-color: #08304a !important;
    }

  #mapAlarmDialog  .el-dialog__title,#mapAlarmDialog .el-form-item__label,#mapAlarmDialog .el-form-item__content{
        color: #ffffff !important;
  }
</style>
