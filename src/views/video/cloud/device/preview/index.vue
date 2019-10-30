<template>
  <el-dialog ref="dialog"
  :title="cameraName + ' 预览'"
  :visible.sync="dialogVisible" 
  :modal-append-to-body='false' 
  :close-on-click-modal='false'
  @close="dialogVisible = false"
  class="videoCloudDialog"
  >
    <el-row>
      <video id="myPlayer" controls playsinline webkit-playsinline autoplay>
        <source type="application/x-mpegURL" :src="http_url"/>
        <source :src="rtmp_url"/>
      </video>   
    </el-row>
  </el-dialog>
</template>

<script>
import '@/assets/js/plugins/hkvVideo/jquery-1.7.1.min.js'
import videoConfigAPI from '@/api/video/videoConfig'
import accountAPI from '@/api/video/videoAccount'
export default {
  props: {
    liveDialogObj: Object
  },
  data() {
    return {
      dialogVisible: false,
      cameraName: '', // 设备名称
      serialNo: '',
      http_url: '',
      rtmp_url: ''
    }
  },
  methods: {
    getToken(projectId) {
      accountAPI.getOne({projectId: projectId}).then(res=>{
        console.log(res);
        this.getLiveUrl(res.accessToken, this.serialNo);
      });
    },
    // 视频信息
    getInfo(id) {
      videoConfigAPI.getItem(id).then(res=>{
        let data = res.data.data;
        this.cameraName = data.cameraName;
        this.serialNo = data.serialNo;
        this.getToken(res.projectId);
      });
    },
    getLiveUrl(accessToken, deviceSerial){
      videoConfigAPI.getLiveUrl(accessToken, deviceSerial).then(res=>{
         this.http_url = res.data[0].hdAddress;
         this.rtmp_url = res.data[0].rtmpHd;
         console.log(this.http_url);
         console.log(this.rtmp_url);
         this.player = new EZUIPlayer('myPlayer'); 
      });
    }
  },
  mounted(){   
    
  },
  updated() {
    if(this.rtmp_url!=""){
      //如果在mounted中声明，直播地址还未取到，导致视频不显示。所以放在了这里
      this.player = new EZUIPlayer('myPlayer'); 
    }
  },
  watch: {
    liveDialogObj: {
      handler(val, oldVal) {
        this.dialogVisible = val.isShow;
        if (val.isShow) {
          this.getInfo(val.rowId);
        }
      },
      deep: true
    }
  },
  components:{
  }
}
</script>

<style lang="scss">
  .videoCloudDialog {
    .el-dialog__body {
      padding: 0;
      #myPlayer {
        width: 100%;
        height: 600px;
        background: #000;
      }
    }
  }
</style>
