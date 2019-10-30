<template>
  <div>
    <div v-if="isIE()">
     <!--  <table style="width:100%;">
        <tr>
          <td>
            <el-tooltip placement="top">
              <div slot="content">播放</div>
              <el-button type="" icon="iconfont icon-bofang">播放</el-button> 
            </el-tooltip>
            <el-tooltip placement="top">
              <div slot="content">停止播放</div>
              <el-button type="primary" icon="iconfont icon-zanting" @click="CloseAllVideo();">停止</el-button> 
            </el-tooltip>
          </td>
        </tr>
      </table> -->
      <OBJECT
        id="VSPOcxClient"
        classid="CLSID:DBD3400F-F12D-40C4-ACBF-3E1AE70F1558"
        :width="showWidth"
        :height="showHeight"
        style="z-index:-1;padding-top:0px;display:block"
      >
        <param name="wmode" value="transparent">
      </OBJECT>
      
    </div>
    <div v-else>
        非IE浏览器无法预览,请用IE打开
    </div>
  </div>
</template>

<script>
import api from '@/api/alarm/alarm'
export default {
  name: "alarmShow",
  data(){
    return {
      showWidth:1024,
      showHeight:592,
      PausebutImgIdx: 1,
      PausebutImg : '/static/imgs/alarm/暂停2.jpg',
      StopbutImg : ['../../assets/images/alarm/停止1.jpg','../../assets/images/alarm/停止2.jpg'],
      FullbutImg : ['../../assets/images/alarm/全屏1.jpg','../../assets/images/alarm/全屏2.jpg']
    }
  },
  props: ["info"],
  watch:{
    info: {
　　　　handler(newValue, oldValue) {
          //父组件param对象改变会触发此函数
          console.log(newValue)
　　　　},
　　　　deep: true
　　}

  },
  computed: {
  },
  mounted(){

    this.isOcx();
    this.showWidth = this.$el.clientWidth;
    this.showHeight = this.$el.clientWidth/1.7;
    this.$on('PlayVideo',(val)=>{
        this.PlayVideo(val);
    });
    this.$on('hideObj',(val)=>{
        this.hideObj(val);
    });
    this.$on('CloseAllVideo',(val)=>{
        this.CloseAllVideo();
    });
    this.$on('SetLayout',(val)=>{
        this.SetLayout(val);
    });

    
  },
  destroyed(){
    this.CloseAllVideo();
  },
  methods: {
    //是否IE
    isIE() {
      let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
      let isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器 
      let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
      return isIE || isIE11;
    },
    //是否已安装OCX控件
    isOcx(){
      if(this.isIE()){
        if(document.all.VSPOcxClient.object == null) {
          this.openConfirm();
        }
      }
    },
    //控件未安装提示
    openConfirm() {
      this.$confirm('对不起，您暂未安装过插件，点击“下载”按钮进行下载安装，安装完成后请重新打开浏览器！', '提示', {
        confirmButtonText: '下载',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.ocxDown();
      }).catch(() => {    
      });
    },
    //OCX控件下载
    ocxDown(){//模板下载      
      api.downloadOcx().then(blob=>{
          let filename = "VSPOcxClientSetup_1.8.exe"
         if (window.navigator.msSaveOrOpenBlob) {
              navigator.msSaveBlob(blob, filename);
          } else {
              const link = document.createElement('a');
              const body = document.querySelector('body');
              link.href = URL.createObjectURL(blob);
              link.download = filename;
              // fix Firefox
              link.style.display = 'none';
              body.appendChild(link);
              link.click();
              body.removeChild(link);
              window.URL.revokeObjectURL(link.href);
          }
      })
    },
    PlayVideo(CameraID) {
      if(this.isIE()){
        this.CloseAllVideo();
        this.$alarm.PlayVideo(CameraID)
      }
		},
    //关闭所有视频
		CloseAllVideo() {      
      if(this.isIE()){
			  this.$alarm.CloseAllVideo()
      }
    },
    //设置窗口布局 支持1，4，5，8，9，13，16
		SetLayout(num) {
      if(this.isIE()){
			  this.$alarm.SetLayout(num)
      }
		},
		//关闭指定视频
		closeVideo(index) {
			this.$alarm.closeVideo(index)
    },
  }
};
</script>

<style scoped>

</style>
