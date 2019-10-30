<template>
  <div id="playback">
    <el-row type="flex" align="top" :gutter="22">
      <el-col :span="18" class="screen-box">
        <div id="playPlugin" class="bg-grey-dark"></div>
        <div class="playback-ctrl">
          <timeBar @playback="playback" @typeChange="typeChange" ref="getChild" :data="tConfig"></timeBar>
          <!-- <el-tooltip v-if="!isReverse" class="item" effect="dark" content="倒放" placement="bottom">
            <a @click="reversePlayback" class="iconfont icon-bofang reverse"></a>
          </el-tooltip> -->
          <!-- <el-tooltip v-if="isReverse" class="item" effect="dark" content="倒放" placement="bottom">
            <a @click="clickPause" class="iconfont icon-bofang1"></a>
          </el-tooltip> -->
          <el-tooltip class="item" effect="dark" content="停止" placement="bottom">
            <a @click="clickStopPlayback" class="iconfont icon-zanting"></a>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="'慢放X' + speedElem" placement="bottom">
            <a :class="{'disabled': !isPlay}" @click="clickPlaySlow" class="iconfont icon-zuokuaifang kf"></a>
          </el-tooltip>
          <el-tooltip v-if="!isPlay" class="item" effect="dark" content="播放" placement="bottom">
            <a @click="playback" class="iconfont icon-bofang"></a>
          </el-tooltip>
          <el-tooltip v-if="isPlay" class="item" effect="dark" content="暂停" placement="bottom">
            <a @click="clickPause" class="iconfont icon-bofang1"></a>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="'快放X' + speedElem" placement="bottom">
            <a :class="{'disabled': !isPlay}" @click="clickPlayFast" class="iconfont icon-youkuaifang kf"></a>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="抓图" placement="bottom">
            <a :class="{'disabled': !isPlay}" @click="clickCapturePic" class="iconfont icon-tubiao_zhuatu- kf"></a>
          </el-tooltip>
          <el-tooltip v-if="!isCut" class="item" effect="dark" content="开始剪辑" placement="bottom">
            <a :class="{'disabled': !isPlay}" @click="clickStartRecord" class="iconfont icon-kaishijianji kf"></a>
          </el-tooltip>
          <el-tooltip v-if="isCut" class="item" effect="dark" content="停止剪辑" placement="bottom">
            <a @click="clickStopRecord" class="iconfont icon-jieshujianji kf"></a>
          </el-tooltip>
          <!-- <el-tooltip class="item" effect="dark" content="单帧" placement="bottom">
            <a :class="{'disabled': !isPlay}" @click="clickFrame" class="iconfont icon-frame-play"></a>
          </el-tooltip> -->
        </div>
      </el-col>
      <el-col class="toolbar">
        <el-card class="box-card">
          <label class="title">日期选择</label>
          <el-date-picker
            v-model="dateSel"
            :clearable="false"
            @change="dateChange"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-card>
        <el-card class="box-card">
          <label class="title">监控点</label>
          <el-collapse v-model="activeNames" @change="handleChange" accordion>
            <el-collapse-item :key="idx" v-for="(item, idx) in nvrOptions" :title="item.cameraName" :name="idx">
              <div :class="{'active': idx == cameraItemActive}" @click="clickCameraItem(idx)" class="camera-item" :key="idx" v-for="(item, idx) in cameraOptions">
                <i :class="item.online == 'false'?'icon-buzaixian':'icon-zaixian1'" class="iconfont"></i>
                {{item.name}}
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import VideoFunc from '@/utils/video'
import timeBar from './timeBar.vue'
import videoConfigAPI from '@/api/video/videoConfig'
import monitorAPI from '@/api/video/monitor'
export default {
  data() {
    return {
      // 进度条
      tConfig: {
        interval: 1000
      },
      BarMove: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      type: -1,
      isReverse: false,
      isCut: false,
      isPlay: false,
      ip: '',
      activeNames: ['1'],
      cameraItemActive: -1,
      nvrOptions: [],
      cameraOptions: [],
      szDeviceIdentify: '',
      bZeroChannel: false, // 是否播放零通道
      szInfo: '',
      szStartTime: '',
      szEndTime: '',
      dateSel: '',
      online: false,
      iChannelID: 1, // 播放通道号
      speedElem: 1
    }
  },
  computed: {
  },
  methods: {
    // 退出当前监控组所有视频
    loginCurrentMonitorOut(dev) {
      for (var i = 0; i < dev.length; i++) {
        VideoFunc.loginVideoOut(dev[i].ip + '_' + dev[i].port);
      }
    },
    // 登录
    loginVideo(szIP, iProtocol, szPort, szUsername, szPassword) {
      var _this = this;
      _this.cameraOptions = [];
      WebVideoCtrl.I_Login(szIP, iProtocol, szPort, szUsername, szPassword, {
        async: true,
        success: function (xmlDoc) {
          // console.log(xmlDoc);//不能删除
          _this.szDeviceIdentify = szIP + '_' + szPort;
          _this.getDigitalChannelInfo();
        },
        error: function () {
          console.log("登录失败");
        }
      });
    },
    // 获取数字通道
    getDigitalChannelInfo() {
      var iAnalogChannelNum = 0;
      if (this.szDeviceIdentify == null) {
        return;
      }
      var _this = this;
      // 模拟通道
      WebVideoCtrl.I_GetAnalogChannelInfo(this.szDeviceIdentify, {
        async: true,
        success: function (xmlDoc) {
          iAnalogChannelNum = $(xmlDoc).find("VideoInputChannel").length;
        },
        error: function () {}
      });
      // 数字通道
      WebVideoCtrl.I_GetDigitalChannelInfo(this.szDeviceIdentify, {
        async: true,
        success: function (xmlDoc) {
          var oChannels = $(xmlDoc).find("InputProxyChannelStatus");
          $.each(oChannels, function () {
            var id = parseInt($(this).find("id").eq(0).text(), 10), // 通道ID
                name = $(this).find("name").eq(0).text(),
                ipAddress = $(this).find("ipAddress").eq(0).text(), // IP 地址
                srcInputPort = $(this).find("srcInputPort").eq(0).text(), // IP 通道号
                managePortNo = $(this).find("managePortNo").eq(0).text(), // 管理端口号
                online = $(this).find("online").eq(0).text(), // 是否在线 (true / false)
                proxyProtocol = $(this).find("proxyProtocol").eq(0).text(); // 接入协议
            _this.cameraOptions.push({
              id: id,
              name: name,
              ipAddress: ipAddress,
              srcInputPort: srcInputPort,
              managePortNo: managePortNo,
              online: online,
              proxyProtocol: proxyProtocol
            });
          });
        },
        error: function (status, xmlDoc) {
        }
      });
    },
    clickCameraItem(idx) {
      this.cameraItemActive = idx;
      this.iChannelID = this.cameraOptions[idx].id; //通道号
      this.online = this.cameraOptions[idx].online; //是否在线
      this.clickStopPlayback();
    },
    // 回放
    playback() {
      var _this = this;
      if (this.online == 'false') {
        VideoFunc.msgTip('该摄像头不在线哦！');
        return;
      }
      if (this.cameraItemActive == -1) {
        VideoFunc.msgTip('您的监控还没选择哦！');
        return;
      }
      if (this.dateSel == '') {
        VideoFunc.msgTip('您还没选择日期哦！');
        return;
      }
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(0);
      if (this.szDeviceIdentify == null) {
        return;
      }
      if (this.bZeroChannel) {// 零通道不支持回放
        return;
      }
      if (oWndInfo != null) {// 已经在播放了，先停止
        if (this.type == 1) {
          WebVideoCtrl.I_Stop({
            success: function () {
              _this.startPlayback();
            }
          });
        } else {
          this.clickResume();
        }
      } else {
        this.startPlayback();
      }
    },
    startPlayback() {
      var _this = this;
      this.szStartTime = this.dateSel + ' ' + this.$refs.getChild.barBeginTime;
      this.szEndTime = this.dateSel + ' ' + '23:59:59';
      console.log(this.iChannelID);
      WebVideoCtrl.I_StartPlayback(this.szDeviceIdentify, {
        iChannelID: _this.iChannelID, // 数字通道
        szStartTime: _this.szStartTime, // 开始时间
        szEndTime: _this.szEndTime, // 结束时间
        success: function () {
          if (_this.$refs.getChild.barBeginTime == '00:00:00') {
            setTimeout(() => {
              _this.$refs.getChild.openBar();
            }, 1500);
          } else {
            _this.speedElem = 1;
            _this.tConfig.interval = 1000 / _this.speedElem;
            _this.$refs.getChild.openBar();
          }
          _this.szInfo = "开始回放成功！";
          _this.isPlay = true;
          _this.isReverse = false;
          _this.type = 0;
        },
        error: function (status, xmlDoc) {
          if (403 === status) {
            _this.szInfo = "设备不支持Websocket取流！";
          } else {
            _this.szInfo = "开始回放失败！";
          }
        }
      });
    },
    // 停止回放
    clickStopPlayback() {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(0),
          _this = this;
      if (oWndInfo != null) {
        WebVideoCtrl.I_Stop({
          success: function () {
            _this.isPlay = _this.isReverse = _this.isCut = false;
            _this.szInfo = "停止回放成功！";
            _this.$refs.getChild.resetTime();
          },
          error: function () {
            _this.szInfo = "停止回放失败！";
          }
        });
      }
    },
    // 倒放
    reversePlayback() {
      var _this = this;
      if (this.cameraItemActive == -1) {
        VideoFunc.msgTip('您的监控还没选择哦！');
        return;
      }
      if (this.dateSel == '') {
        VideoFunc.msgTip('您还没选择日期哦！');
        return;
      }
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(0);
      if (this.szDeviceIdentify == null) {
        return;
      }
      if (this.bZeroChannel) {// 零通道不支持倒放
        return;
      }
      if (oWndInfo != null) {// 已经在播放了，先停止
        if (this.type == 0) {
          WebVideoCtrl.I_Stop({
            success: function () {
              _this.startReversePlayback();
            }
          });
        } else {
          this.clickResume(1);
        }
      } else {
        this.startReversePlayback();
      }
    },
    startReversePlayback() {
      var _this = this;
      var iRet = WebVideoCtrl.I_ReversePlayback(this.szDeviceIdentify, {
        iChannelID: _this.iChannelID,
        szStartTime: _this.szStartTime,
        szEndTime: _this.szEndTime
      });
      if (iRet == 0) {
        this.isPlay = false;
        this.szInfo = "开始倒放成功！";
        this.isReverse = true;
        this.type = 1;
      } else {
        this.szInfo = "开始倒放失败！";
      }
    },
    // 暂停
    clickPause() {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(0),
          _this = this;
      if (oWndInfo != null) {
        WebVideoCtrl.I_Pause({
          success: function () {
            _this.$refs.getChild.stopBar();
            _this.isPlay = _this.isReverse = _this.isCut = false;
            _this.szInfo = "暂停成功！";
          },
          error: function () {
            _this.szInfo = "暂停失败！";
          }
        });
      }
    },
    // 恢复
    clickResume(type) {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(0),
          _this = this;
      if (oWndInfo != null) {
        WebVideoCtrl.I_Resume({
          success: function () {
            _this.speedElem = 1;
            if (type == 1) {
              _this.isReverse = true;
            } else {
              _this.isPlay = true;
              setTimeout(() => {
                _this.$refs.getChild.openBar();
              }, 700);
            }
            _this.szInfo = "恢复成功！";
          },
          error: function () {
            _this.szInfo = "恢复失败！";
          }
        });
      }
    },
    // 快放
    clickPlayFast() {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(0),
          _this = this;
      if (oWndInfo != null && this.isPlay) {
        WebVideoCtrl.I_PlayFast({
          success: function () {
            _this.szInfo = "快放成功！";
            _this.speedElem = _this.speedElem * 2;
            _this.tConfig.interval = 1000 / _this.speedElem;
            _this.$refs.getChild.openBar();
            console.log(oWndInfo.szDeviceIdentify + " " + _this.szInfo);
          },
          error: function () {
            _this.szInfo = "快放失败！";
            console.log(oWndInfo.szDeviceIdentify + " " + _this.szInfo);
          }
        });
      }
    },
    // 慢放
    clickPlaySlow() {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(0),
          _this = this;
      if (oWndInfo != null && this.isPlay) {
        WebVideoCtrl.I_PlaySlow({
          success: function () {
            _this.szInfo = "慢放成功！";
            _this.speedElem = _this.speedElem/2;
            _this.tConfig.interval = 1000 / _this.speedElem;
            console.log(_this.tConfig.interval);
            _this.$refs.getChild.openBar();
            console.log(oWndInfo.szDeviceIdentify + " " + _this.szInfo);
          },
          error: function () {
            _this.szInfo = "慢放失败！";
            console.log(oWndInfo.szDeviceIdentify + " " + _this.szInfo);
          }
        });
      }
    },
    // 单帧
    clickFrame() {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(0),
          _this = this;
      if (oWndInfo != null && this.isPlay) {
        WebVideoCtrl.I_Frame({
          success: function () {
            _this.szInfo = "单帧播放成功！";
            console.log(oWndInfo.szDeviceIdentify + " " + _this.szInfo);
          },
          error: function () {
            _this.szInfo = "单帧播放失败！";
            console.log(oWndInfo.szDeviceIdentify + " " + _this.szInfo);
          }
        });
      }
    },
    // 抓图
    clickCapturePic() {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(0);
      if (oWndInfo != null && this.isPlay) {
        var xmlDoc = WebVideoCtrl.I_GetLocalCfg();
        var szCaptureFileFormat = "0";
        if (xmlDoc != null) {
          szCaptureFileFormat = $(xmlDoc).find("CaptureFileFormat").eq(0).text();
        }
        var szPicName = oWndInfo.szDeviceIdentify + "_" + this.iChannelID + "_" + new Date().getTime();
        szPicName += ("0" === szCaptureFileFormat) ? ".jpg": ".bmp";
        var iRet = WebVideoCtrl.I_CapturePic(szPicName, {
          bDateDir: true  //是否生成日期文件
        });
        if (0 == iRet) {
          this.szInfo = "抓图成功！";
        } else {
          this.szInfo = "抓图失败！";
        }
        VideoFunc.msgTip(oWndInfo.szDeviceIdentify + " " + this.szInfo, 1);
      }
    },
    // 开始剪辑
    clickStartRecord() {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(0);
      if (oWndInfo != null && this.isPlay) {
        var szFileName = oWndInfo.szDeviceIdentify + "_" + this.iChannelID + "_" + new Date().getTime();
        var _this = this;
        WebVideoCtrl.I_StartRecord(szFileName, {
          bDateDir: true, //是否生成日期文件
          success: function () {
            _this.isCut = true;
            _this.szInfo = "开始剪辑成功！";
            VideoFunc.msgTip(oWndInfo.szDeviceIdentify + " " + _this.szInfo, 1);
          },
          error: function () {
            _this.szInfo = "开始剪辑失败！";
            VideoFunc.msgTip(oWndInfo.szDeviceIdentify + " " + _this.szInfo);
          }
        });
      }
    },
    // 停止剪辑
    clickStopRecord() {
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(0);
      if (oWndInfo != null) {
        var _this = this;
        WebVideoCtrl.I_StopRecord({
          success: function () {
            _this.isCut = false;
            _this.szInfo = "停止剪辑成功！";
            VideoFunc.msgTip(oWndInfo.szDeviceIdentify + " " + _this.szInfo, 1);
          },
          error: function () {
            _this.szInfo = "停止剪辑失败！";
            VideoFunc.msgTip(oWndInfo.szDeviceIdentify + " " + _this.szInfo);
          }
        });
      }
    },
    // 监控点列表
    getNVRInfo() {
      videoConfigAPI.getNVRList('1').then(res=>{
        this.nvrOptions = res;
      });
      var _this = this;
      setTimeout(() => {
        console.log(_this.nvrOptions);
      }, 1000);
    },
    handleChange(i) {
      for (let j = 0; j < this.nvrOptions.length; j++) {
        if (j != i) {
          let szDeviceIdentify = this.nvrOptions[j].ip + '_' + this.nvrOptions[j].port
          VideoFunc.loginVideoOut(szDeviceIdentify);
        }
      }
      let item = this.nvrOptions[i];
      console.log(this.nvrOptions);
      console.log(i);
      if (!this.activeNames) {
        let szDeviceIdentify = item.ip + '_' + item.port;
        VideoFunc.loginVideoOut(szDeviceIdentify);
      }
      if (item) {
        this.loginVideo(item.ip, 1, item.port, item.cameraUser, item.cameraPassword);
      }
    },
    dateChange(e) {
      this.$refs.getChild.resetTime();
      this.clickStopPlayback();
    },
    typeChange(type) {
      this.type = type;
    }
  },
  created() {
    this.getNVRInfo();
  },
  mounted () {
    VideoFunc.videoInitPlugin('playPlugin', 1);
  },
  destroyed: function () {
    this.loginCurrentMonitorOut(this.nvrOptions);
    this.$refs.getChild.stopBar();
  },
  components:{
    timeBar
  }
}

</script>

<style lang="scss">
  .bg-grey-dark {
    background: #000;
  }

  .screen-box {
    width: calc(100% - 430px);
  }

  #playPlugin {
    height: 80vh;
  }

  #playback {
    padding: 10px 0;
    &>div {
      margin: 0 !important;
    }
    .playback-ctrl {
      height: 65px;
      background: rgba(0, 0, 0, .8);
      color: #bababa;
      text-align: center;
      .iconfont {
        font-size: 16px;
        margin-right: 20px;
        &.reverse {
          transform: rotate(180deg);
          position: relative;
        }
        &.disabled {
          color: #565656;
          cursor: not-allowed;
        }
        &.kf {
          position: relative;
          font-size: 22px;
          top: 2px;
        }
      }
    }
    .toolbar {
      width: 430px;
      .box-card {
        margin-bottom: 30px;
        overflow: visible;
        background-color: #fff;
        .el-card__body {
          position: relative;
          .title {
            position: absolute;
            top: -10px;
            display: inline-block;
          }
          .el-collapse {
            border-top: 1px solid transparent;
            border-bottom: 1px solid transparent;
            .el-collapse-item__header {
              background: transparent;
              border-bottom: 1px solid transparent;
            }
            .el-collapse-item__wrap {
              background: transparent;
              border-bottom: 1px solid transparent;
              .el-collapse-item__content {
                .camera-item {
                  cursor: pointer;
                  padding: 10px 5px;
                  border-radius: 3px;
                  &:hover,
                  &.active {
                    background: rgba(18, 122, 195, 0.8);
                  }
                  .iconfont {
                    position: relative;
                    top: 1px;
                    margin-right: 5px;
                    color: #67C23A;
                    &.icon-buzaixian {
                      color: #F56C6C;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
