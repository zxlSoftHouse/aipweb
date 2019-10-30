<template>
  <div id="monitor">
    <el-row type="flex" align="top" :gutter="22">
      <el-col :span="18" class="screen-box">
        <div id="divPlugin" class="bg-grey-dark">
        </div>
        <videoDialog 
        ref="getChild"
        @handleClose="dialogObj.isShow = false"
        @monitorSel="monitorSel(monitorOptions[activeNum], activeNum)" 
        @getMonitorInfo="getMonitorInfo" 
        :dialogObj="dialogObj"></videoDialog>
      </el-col>
      <el-col :span="6" class="toolbar">
        <div style="margin-bottom: 20px;">
          <el-button @click="clickFullScreen" type="primary" size="mini">全屏</el-button>
        </div>
        <el-card class="box-card">
          <div slot="header">
            <span>分屏</span>
          </div>
          <el-select v-model="iWndowType" @change="changeWndNum(iWndowType)">
            <el-option
              v-for="item in screenOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-card>
        <el-card class="box-card yt">
          <div slot="header">
            <span>云台控制</span>
          </div>
          <cloud @mouseDownPTZControl="mouseDownPTZControl" @PTZControl="PTZControl"></cloud>
        </el-card>
        <el-card class="box-card" style="height: 45vh">
          <div slot="header">
            <span>监控点</span>
          </div>
          <div>
            <el-button class="yt-btn" @click="bindCamera" type="primary" size="mini">绑定摄像头</el-button>
            <el-button class="yt-btn" @click="handleAddMonitor" type="primary" size="mini">新增监控点</el-button>
            <el-button class="yt-btn" @click="handleDeleteMonitor" type="danger" size="mini">删除监控点</el-button>
          </div>
          <ul class="monitor-list">
            <li :key="idx" :class="{'active': idx == activeNum}" v-for="(item, idx) in monitorOptions" @click="monitorSel(item, idx)">{{item.monitorName}}</li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import '@/assets/js/plugins/hkvVideo/jquery-1.7.1.min.js'
import VideoFunc from '@/utils/video'
import cloud from './cloud/index.vue'
import videoDialog from './video.vue'
import videoConfigAPI from '@/api/video/videoConfig'
import monitorAPI from '@/api/video/monitor'
export default {
  data() {
    return {
      g_bPTZAuto: false,
      screenOption: [
        {
          value: 1,
          label: '1 × 1'
        }, {
          value: 2,
          label: '2 × 2'
        }, {
          value: 3,
          label: '3 × 3'
        }
      ],
      iWndowType: 2, // 分屏类型
      ytForm: {
        name: 1
      },
      sel_monitorOptions: [], // 选择的监控点列表，用于绑定摄像头、删除监控点
      monitorOptions: [], // 监控点列表
      dialogObj: {
        isShow: false,
        g_iWndIndex: 0, //当前选中的窗口
        cameraIdArr: [], // 由数据库 cameraIds 拆分数组
        cameraNum: '', // 分屏类型
        monitorId: '', // 监控点 ID
        monitorName: '', // 监控点名称
        monitorNo: '', // 监控点编号
        nvr: ''
      },
      dif_devOptions: [], // 记录不同的登录设备，用于防止重复登录同一台设备
      activeNum: 0
    }
  },
  methods: {
    // 全屏
    clickFullScreen() {
      VideoFunc.clickFullScreen();
    },
    // 登录
    loginVideo(szJson) {
      VideoFunc.loginVideo(szJson, function (szJson, szDeviceIdentify) {
        this.dif_devOptions.push({szIP: szJson.szIP, szPort: szJson.szPort});
      });
    },
    // 退出当前监控组所有视频
    loginCurrentMonitorOut(dev) {
      for (var i = 0; i < dev.length; i++) {
        VideoFunc.loginVideoOut(dev[i].szIP + '_' + dev[i].szPort);
      }
    },
    // 停止当前监控组所有预览
    stopCurrentRealPlay(cameraIdArrLen) {
      for (let i = 0; i < cameraIdArrLen; i++) {
        VideoFunc.stopRealPlay(i);
      }
    },
    // 分屏
    changeWndNum(iType) {
      VideoFunc.changeWndNum(iType);
      let screenNum = Math.pow(this.iWndowType, 2);
      let cameraIdLen = this.dialogObj.cameraIdArr.length;
      if (cameraIdLen < screenNum) {
        this.inScreen(screenNum, cameraIdLen);
      }
      if (cameraIdLen > screenNum) {
        this.deScreen(screenNum, cameraIdLen);
      }
    },
    // 云台操控
    mouseDownPTZControl(iPTZSpeed, iPTZIndex) {
      let PTZJson = {
        g_iWndIndex: this.dialogObj.g_iWndIndex,
        iPTZSpeed: iPTZSpeed,
        iPTZIndex: iPTZIndex,
        g_bPTZAuto: this.g_bPTZAuto
      }
      VideoFunc.mouseDownPTZControl(PTZJson);
      this.g_bPTZAuto = PTZJson.g_bPTZAuto;
    },
    PTZControl(iPTZSpeed, iPTZIndex, status) {
      let g_iWndIndex = this.dialogObj.g_iWndIndex;
      VideoFunc.PTZControl(g_iWndIndex, iPTZSpeed, iPTZIndex, status);
    },
    // 绑定摄像头
    bindCamera() {
      this.dialogObj.isShow = true;
      this.getMonitorItem(this.monitorOptions[this.activeNum]);
      this.dialogObj.cameraNum = this.iWndowType;
    },
    // 增加屏幕
    inScreen(screenNum, cameraIdLen) {
      let iChannelID = ''
      if (this.dialogObj.nvr == '0') {
        iChannelID = 1;
      }
      for (let i = 0; i < screenNum - cameraIdLen; i++) {
        this.dialogObj.cameraIdArr.push({
          id: '',
          iChannelID: iChannelID
        });
      }
    },
    // 减少屏幕
    deScreen(screenNum, cameraIdLen) {
      this.loginCurrentMonitorOut(this.dif_devOptions);
      this.stopCurrentRealPlay(cameraIdLen);
      this.dialogObj.cameraIdArr = [];
      let iChannelID = ''
      if (this.dialogObj.nvr == '0') {
        iChannelID = 1;
      }
      for (let i = 0; i < screenNum; i++) {
        this.dialogObj.cameraIdArr.push({
          id: '',
          iChannelID: iChannelID
        });
      }
    },
    handleAddMonitor() {
      this.dialogObj.isShow = true;
      this.dialogObj.cameraNum = this.iWndowType;
      this.dialogObj.monitorId = '';
      this.dialogObj.monitorName = '';
      this.dialogObj.monitorNo = '';
      this.dialogObj.nvr = '';
      this.dialogObj.cameraIdArr = [];
      let screenNum = Math.pow(this.iWndowType, 2);
      let iChannelID = ''
      if (this.dialogObj.nvr == '0') {
        iChannelID = 1;
      }
      for (let i = 0; i < screenNum; i++) {
        this.dialogObj.cameraIdArr.push({
          id: '',
          iChannelID: iChannelID
        });
      }
    },
    doDelete(ids){ 
      monitorAPI.doDelete(ids).then(res=>{
        if(res){
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.getMonitorInfo();
        }else{
          this.$message.error('服务器错误');
        }
      })
    },
    handleDeleteMonitor() {
      this.sel_monitorOptions = [this.dialogObj.monitorId];
      if(this.sel_monitorOptions.length != 0){
          var idList=[];
          this.sel_monitorOptions.map(item=>{
            idList.push(item);
          })
          this.doDelete(idList)
      }else{
        this.$message({
          type: 'warning',
          message: '请先选择一条记录'
        });
      }
    },
    // 监控点列表
    getMonitorInfo () {
      monitorAPI.getList('', '', '').then(res=>{
        this.monitorOptions = res.data.data.records;
      })
    },
    // 选择监控点
    monitorSel (e, i) {
      // 退出登录并清空登录设备
      this.loginCurrentMonitorOut(this.dif_devOptions);
      this.dif_devOptions = [];
      // ===============================

      // 获取监控点下的所有摄像头
      this.dialogObj.cameraIdArr = [];
      this.getMonitorItem(e);
      this.activeNum = i;
      if (e.rowId) {
        // 视频组
        if (e.cameraIds) {
          var _cameraIdArr = e.cameraIds.split(',');
          for (var i = 0; i< _cameraIdArr.length; i++) {
            var item = _cameraIdArr[i].split('_');
            this.dialogObj.cameraIdArr.push({
              id: item[0],
              iChannelID: item[1]
            });
          }
        }
        // 分屏
        if (this.iWndowType != e.cameraNum) {
          this.iWndowType = e.cameraNum;
          this.changeWndNum(e.cameraNum);
        }
        this.initCameraItemGroup(this.dialogObj.cameraIdArr);
      }
    },
    getMonitorItem(e) {
      this.dialogObj.monitorName = e.monitorName;
      this.dialogObj.monitorId = e.rowId;
      this.dialogObj.monitorNo = e.monitorNo;
      this.dialogObj.nvr = e.nvr;
    },
    // 初始化视频组
    initCameraItemGroup(cameraIdArr) {
      // 插件下标
      this.dialogObj.g_iWndIndex = 0;
      this.getCameraItemGroup(cameraIdArr);
    },
    // 视频组
    getCameraItemGroup(cameraIdArr) {
      for (let j = 0; j < cameraIdArr.length; j++) {
        if (cameraIdArr[j].id) {
          this.getCameraItem(cameraIdArr[j], j);
        } else {
          VideoFunc.stopRealPlay(j);
        }
      }
    },
    // 视频信息
    getCameraItem(devInfo, iWndIndex) {
      videoConfigAPI.getItem(devInfo.id).then(res=>{
        let data = res.data.data;
        let szJson = {
          szIP: data.ip,
          szPort: data.port,
          szUsername: data.cameraUser,
          szPassword: data.cameraPassword,
          iWndIndex: iWndIndex,
          iChannelID: devInfo.iChannelID,
          isStartRealPlay: true
        }
        if (szJson.szIP) {
          if (this.dif_devOptions.length == 0) {
            this.loginVideo(szJson);
          } else {
            var szDeviceIdentify = szJson.szIP + '_' + szJson.szPort;
            for (let i = 0; i < this.dif_devOptions.length; i++) {
              var itemDeviceIdentify = this
              
              .dif_devOptions[i].szIP + '_' + this.dif_devOptions[i].szPort;
              if (szDeviceIdentify != itemDeviceIdentify) {
                this.loginVideo(szJson);
              } else {
                VideoFunc.startRealPlay(szDeviceIdentify, szJson.iWndIndex, szJson.iChannelID);
              }
            }
          }
        }
      });
    }
  },
  created() {
    this.getMonitorInfo();
  },
  mounted () {
    let _this = this;
    VideoFunc.videoInitPlugin('divPlugin', this.iWndowType, function (xmlDoc) {
      _this.dialogObj.g_iWndIndex = parseInt($(xmlDoc).find("SelectWnd").eq(0).text(), 10);
    });
    setTimeout(() => {
      if (this.monitorOptions.length > 0) {
        this.monitorSel(this.monitorOptions[0], 0);
      }
    },500);
  },
  destroyed: function () {
    this.stopCurrentRealPlay(this.dialogObj.cameraIdArr.length);
    this.loginCurrentMonitorOut(this.dif_devOptions);
  },
  components:{
    cloud,
    videoDialog
  }
}
</script>

<style lang="scss">
  .bg-grey-dark {
    background: #000;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .screen-box {
    width: calc(100% - 430px);
  }

  #divPlugin {
    height: 85vh;
  }

  #monitor {
    &>div {
      margin: 0 !important;
    }
    .el-dialog__wrapper {
      left: calc(100% - 420px);
      .el-dialog {
        margin-top: 0 !important;
        height: 100%;
        width: 100%;
      }
    }
    .toolbar {
      width: 430px;
      .box-card {
        margin-bottom: 15px;
        overflow: visible;
        background-color: #fff;
        .el-card__header {
          padding: 5px 20px;
          border-bottom: 0;
        }
        .el-card__body {
          position: relative;
          .el-select {
            display: block;
          }
          .monitor-list {
            height: calc(45vh - 24px);
            overflow: auto;
            li {
              padding: 5px;
              cursor: pointer;
              &:hover, &.active {
                background: #ddd;
              }
            }
          }
        }
      }
    }
  }
</style>