import Vue from 'vue'
// 初始化插件
const VideoFunc = {
  videoInitPlugin (pluginId, iWndowType, cbSelWndFunc) {
    var iRet = WebVideoCtrl.I_CheckPluginInstall();
    if (iRet === -1) {
      alert("您还未安装过插件，双击开发包目录里的WebComponentsKit.exe安装！");
      return;
    }
    this.initPlugin(pluginId, iWndowType, cbSelWndFunc)
  },
  initPlugin (pluginId, iWndowType, cbSelWndFunc) {
    WebVideoCtrl.I_InitPlugin('100%', '100%', {
      bWndFull: true,//是否支持单窗口双击全屏，默I_CheckPluginInstall
      iPackageType: 2,    //2:PS 11:MP4
      iWndowType: iWndowType,
      bNoPlugin: true,
      cbSelWnd: function (xmlDoc) {
        if (cbSelWndFunc) {
          cbSelWndFunc(xmlDoc);
        }
      },
      cbInitPluginComplete: function () {
        WebVideoCtrl.I_InsertOBJECTPlugin(pluginId);
        // 检查插件是否最新
        if (WebVideoCtrl.I_CheckPluginVersion() === -1) {
          alert("检测到新的插件版本，双击开发包目录里的WebComponentsKit.exe升级！");
          return;
        }
      },
    });
  },
  // 登录
  loginVideo(szJson = {szIP: '', szPort: '', szUsername: '', szPassword: '', iWndIndex: 0, iChannelID: '', isStartRealPlay: false}, succFunc, errFunc) {
    var szDeviceIdentify = szJson.szIP + "_" + szJson.szPort;
    WebVideoCtrl.I_Login(szJson.szIP, 1, szJson.szPort, szJson.szUsername, szJson.szPassword, {
      async: true,
      success: function (xmlDoc) {
        console.log(szDeviceIdentify + '登录成功');
        if (succFunc) {
          succFunc(szJson, szDeviceIdentify);
        }
        if (szJson.isStartRealPlay) {
          setTimeout(()=>{ 
            VideoFunc.startRealPlay(szDeviceIdentify, szJson.iWndIndex, szJson.iChannelID); 
          }, 100);
        }
      },
      error: function () {
        VideoFunc.msgTip(szDeviceIdentify + '登录失败');
        if (errFunc) {
          errFunc();
        }
      }
    });
  },
  // 退出登录
  loginVideoOut(szDeviceIdentify) {
    if (szDeviceIdentify == null) {
      return;
    }
    var iRet = WebVideoCtrl.I_Logout(szDeviceIdentify);
    if (iRet == 0) {
      console.log('退出成功');
    } else {
    }
  },
  // 预览
  startRealPlay (szDeviceIdentify, iWndIndex, iChannelID) {
    WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
      iWndIndex: iWndIndex,
      iChannelID: iChannelID,
      success: function () {
      },
      error: function (status, xmlDoc2) {
        if (status === 403) {
        } else {
        }
      }
    });
  },
  // 停止预览
  stopRealPlay(iWndIndex) {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(iWndIndex);
    if (oWndInfo != null) {
      WebVideoCtrl.I_Stop({
        iWndIndex: iWndIndex,
        success: function () {
        },
        error: function () {
        }
      });
    }
  },
  // 全屏
  clickFullScreen() {
    WebVideoCtrl.I_FullScreen(true);
  },
  // 分屏
  changeWndNum(iType) {
    iType = parseInt(iType, 10);
    WebVideoCtrl.I_ChangeWndNum(iType);
  },
  // 云台
  PTZControl(g_iWndIndex, iPTZSpeed, iPTZIndex, status) {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);
    if (oWndInfo != null) {
      WebVideoCtrl.I_PTZControl(iPTZIndex, status, {
        iWndIndex: g_iWndIndex,
        iPTZSpeed: iPTZSpeed,
        success: function (xmlDoc) {
        },
        error: function (status, xmlDoc) {
        }
      });
    }
  },
  mouseDownPTZControl(PTZJson = {g_iWndIndex: '', iPTZSpeed: '', iPTZIndex: '',g_bPTZAuto: false}) {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(PTZJson.g_iWndIndex);
    if (oWndInfo != null) {
      if (9 == PTZJson.iPTZIndex && PTZJson.g_bPTZAuto) {
        // PTZJson.iPTZSpeed = 0;// 自动开启后，速度置为0可以关闭自动
      } else {
        PTZJson.g_bPTZAuto = false;// 点击其他方向，自动肯定会被关闭
      }
      WebVideoCtrl.I_PTZControl(iPTZIndex, false, {
        iPTZSpeed: PTZJson.iPTZSpeed,
        success: function (xmlDoc) {
          if (PTZJson.iPTZIndex == 9 && PTZJson.g_bPTZAuto) {
            VideoFunc.PTZControl(PTZJson.g_iWndIndex, PTZJson.iPTZSpeed, PTZJson.iPTZIndex, true);
          } else {
          }
          if (PTZJson.iPTZIndex == 9) {
            PTZJson.g_bPTZAuto = !PTZJson.g_bPTZAuto;
          }
        },
        error: function (status, xmlDoc) {
        }
      });
    }
  },
  // 信息提示
  msgTip(message, type) {
    var _title = '警告',
        _type = 'warning';
    if (type == 1) {
      _title = '成功';
      _type = 'success';
    }
    Vue.prototype.$notify({
      title: _title,
      message: message,
      type: _type,
      position: 'bottom-right'
    });
  }
}

export default VideoFunc