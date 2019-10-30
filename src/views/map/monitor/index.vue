<template>
  <bm-control>
    <el-dialog ref="dialog"
    :visible.sync="dialogVisible" 
    :modal-append-to-body='false' 
    :close-on-click-modal='false'
    @close="dialogVisible = false"
    :class="mapStyle"
    class="monitor-dialog">
      <el-row>
        <el-col class="plugin">
          <div id="mapMonitorPlugin" class="bg-grey-dark"></div>
        </el-col>
        <el-col class="map-yt">
          <label class="device-name">{{deviceName}}</label>
          <cloud @mouseDownPTZControl="mouseDownPTZControl" @PTZControl="PTZControl"></cloud>
        </el-col>
      </el-row>
    </el-dialog>
  </bm-control>
</template>

<script>
import '@/assets/js/plugins/hkvVideo/jquery-1.7.1.min.js'
import videoConfigAPI from '@/api/video/videoConfig'
import VideoFunc from '@/utils/video'
import cloud from './cloud.vue'
export default {
  props: {
    rowId: String,
    mapStyle: String
  },
  data() {
    return {
      dialogVisible: false,
      deviceName: '',
      szDeviceIdentify: '',
      g_bPTZAuto: false
    }
  },
  methods: {
    // 视频信息
    getInfo(id) {
      videoConfigAPI.getItem(id).then(child=>{
        let _child = child.data.data;
        videoConfigAPI.getItem(_child.parentId).then(parent=>{
          let _parent = parent.data.data;
          this.deviceName = _parent.cameraName + ' - ' + _child.cameraName;
          let szJson = {
            szIP: _parent.ip,
            szPort: _parent.port,
            szUsername: _parent.cameraUser,
            szPassword: _parent.cameraPassword,
            iWndIndex: 0,
            iChannelID: _child.cameraNo,
            isStartRealPlay: true
          }
          VideoFunc.loginVideo(szJson);
        });
      });
    },
    // 云台操控
    mouseDownPTZControl(iPTZSpeed, iPTZIndex) {
      let PTZJson = {
        g_iWndIndex: 0,
        iPTZSpeed: iPTZSpeed,
        iPTZIndex: iPTZIndex,
        g_bPTZAuto: this.g_bPTZAuto
      }
      VideoFunc.mouseDownPTZControl(PTZJson);
      this.g_bPTZAuto = PTZJson.g_bPTZAuto;
      console.log(this.g_bPTZAuto);
    },
    PTZControl(iPTZSpeed, iPTZIndex, status) {
      VideoFunc.PTZControl(0, iPTZSpeed, iPTZIndex, status);
    }
  },
  watch: {
    dialogVisible(val, oldVal) {
      if (val) {
        this.$nextTick(() => {
          VideoFunc.videoInitPlugin('mapMonitorPlugin', 1);
          this.getInfo(this.rowId);
        })
      } else {
        VideoFunc.stopRealPlay(0);
        VideoFunc.loginVideoOut(this.szDeviceIdentify);
      }
    }
  },
  components:{
    cloud
  } 
}
</script>

<style lang="scss">
  .bg-grey-dark {
    background: #000;
  }
  #mapMonitorPlugin {
    height: 450px;
  }
  .monitor-dialog {
    .el-dialog {
      width: 50%;
      .el-dialog__header {
        padding: 0;
        .el-dialog__headerbtn {
          top: 5px;
          right: 5px;
          z-index: 10000;
        }
      }
      .el-dialog__body {
        padding: 0;
        .plugin {
          width: calc(100% - 160px);
        }
        .map-yt {
          width: 160px;
          padding-left: 5px;
          .device-name {
            display: block;
            margin-top: 30px;
            font-style: italic;
            // color: #e0d811;
          }
        }
      }
    }
  }
</style>
