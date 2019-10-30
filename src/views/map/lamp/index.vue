<template>
  <bm-control>
    <el-dialog ref="dialog" :title="lampPostInfo.lampPostCode" width="30%"  class="mapLampDialog"
    :visible.sync="dialogVisible" 
    :modal-append-to-body='false' 
    :close-on-click-modal='false'
    @close="dialogVisible = false"
    :class="mapStyle">
      <h4>灯具实时监控</h4>
      <el-collapse v-model="activeNames" @change="handleChange" accordion>
        <el-collapse-item v-for="(item,index) in lampPostInfo.lampList" :title="item.controlerName" :name="item.rowId" :key="item.rowId">
          <el-form :inline="true"
              label-position="left" class="demo-table-expand">
              <div>
              <el-form-item label="亮度">
                <span  v-if="item.onlinestate=='1' || item.devicestatus=='1'">-</span>
                <span v-else>{{ item.brightness || '-' }}</span>
              </el-form-item>
              <el-form-item label="电压">
                <span  v-if="item.onlinestate=='1' || item.devicestatus=='1'">-</span>
                <span v-else>{{ item.voltage || '-' }}</span>
              </el-form-item>
              <el-form-item label="电流">
                <span  v-if="item.onlinestate=='1' || item.devicestatus=='1'">-</span>
                <span v-else>{{ item.electriccurrent || '-' }}</span>
              </el-form-item>
              <el-form-item label="有用功">
                <span  v-if="item.onlinestate=='1' || item.devicestatus=='1'">-</span>
                <span v-else>{{ item.availablework || '-' }}</span>
              </el-form-item>
              <el-form-item label="无用功">
                <span  v-if="item.onlinestate=='1' || item.devicestatus=='1'">-</span>
                <span v-else>{{ item.uselesswork || '-' }}</span>
              </el-form-item>
              <el-form-item label="有功电能">
                <span  v-if="item.onlinestate=='1' || item.devicestatus=='1'">-</span>
                <span v-else>{{ item.activepower || '-' }}</span>
              </el-form-item>
              <el-form-item label="视在电能">
                <span  v-if="item.onlinestate=='1' || item.devicestatus=='1'">-</span>
                <span v-else>{{ item.apparentpower }}</span>
              </el-form-item>
              <el-form-item label="频率">
                <span  v-if="item.onlinestate=='1' || item.devicestatus=='1'">-</span>
                <span v-else>{{ item.frequency || '-' }}</span>
              </el-form-item>
              <el-form-item label="温度">
                <span  v-if="item.onlinestate=='1' || item.devicestatus=='1'">-</span>
                <span v-else>{{ item.temperature || '-' }}</span>
              </el-form-item>
              <el-form-item label="设备状态">
                <span  v-if="item.onlinestate=='1'">关闭</span>
                <span v-else>{{ item.devicestatus | devicestatus}}</span>
              </el-form-item>
              <el-form-item label="在线状态">
                <span  v-if="item.lampRunData == null ">离线</span>
                <span v-else>{{ item.onlinestate | onlinestate }}</span>
              </el-form-item>
              </div>
          </el-form>


          <div class="controlButton">
            <el-row type="flex">
              <el-col :span="24">
                  <el-button :type="!mapStyle?'default':'primary'" @click="trigger_light(1,item.rowId)">开灯</el-button>
                  <el-button :type="!mapStyle?'default':'primary'" @click="trigger_light(0,item.rowId)">关灯</el-button>
                  <el-button :type="!mapStyle?'default':'primary'" @click="lampListLiveQuery(item.rowId)">读取</el-button>
              </el-col>
            </el-row>
            <el-row align="bottom">
                <el-col :span="4">
                    <div style="margin-top: 6px;">亮度调节</div>
                </el-col>
                <el-col :span="15" :offset="1">
                    <el-slider :min="1" v-model="lightLevel[index]" @change="changeLightLevel(item.rowId,lightLevel[index])"></el-slider>
                </el-col>
            </el-row>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
    
  </bm-control>

</template>

<script>
import mapAPI from '@/api/common/map'
import { mapState } from 'vuex';
export default {
  props: {
    rowId: String,
    mapStyle: String
  },
  data() {
    return {
      dialogVisible: false,
      activeNames: [],
      controlIndex: '',//控制灯具的索引  目前1个灯杆只有2个灯具
      controlRowId: "",
      controlLightLevel: "",
      loading: '',
      onOff:false,
      progressShow: false,
      progress:0,//操作进度
      lightLevel: [0,0],//调光亮度
      lampPostInfo:{
        lampPostCode:"",
        lampList:[],
      },
      progressTimeOut:'',
      actionKey:'',
    } 
  },
  mounted (){
  },
  destroyed(){
        clearTimeout(this.progressTimeOut);
  },
  computed:{
    ...mapState({
      websocketData: state=>state.websock.websocketData,
      projectId: state=>state.project.projectId,
    }),
  },
  watch: {
    dialogVisible(val, oldVal) {
      if (val) {
        this.$nextTick(() => {
          this.getInfo(this.rowId);
        })
      }
    },
    websocketData(newer, older){
        if(newer.result!=='resend' && newer.actionKey===this.actionKey){
            this.clearStatus();
            if(newer.result==='fail'){
                this.showWarn('操作失败',0)
            }else if(newer.result==='success'){     
                this.showWarn('操作成功',1)     
                this.getLampReal();      
            }
        }
    },
    deep:true
  },
  methods: {
    // 显示加载Loading
    lodingShow(){
        this.progressTimeOutFun();        
        this.loading = this.$loading({
            lock: true,
            text: '指令发送中请稍等',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });        
    },
    // 显示提示
    showWarn(message, type) {
      var _title = '警告',
          _type = 'warning';
      if (type == 1) {
        _title = '成功';
        _type = 'success';
      }
      this.$notify({
        title: _title,
        message: message,
        type: _type,
        position: 'bottom-right'
      });
    },
    
    progressTimeOutFun(){
      this.progressTimeOut = setTimeout(() => {
        if(this.loading){
          this.loading.close();    
          this.showWarn("指定发送超时",0)
        }
      }, 1000 * 90);
    },
     // 灯杆
    getInfo(id) {
      mapAPI.queryOneLampPost(id).then(res=>{
        this.lampPostInfo = res;
        this.lampPostInfo.lampList = [];
        this.getLampReal();
      });
    },
    getLampReal(){//查询灯杆下灯具实时数据      
    
      mapAPI.queryLightingLampConListByPostId(this.lampPostInfo.rowId).then(realRes=>{
        this.lampPostInfo.lampList = realRes;
        this.lampPostInfo.lampList.map((it,idx)=>{
          this.lightLevel[idx] = it.brightness;
        })
        if(this.lampPostInfo.lampList.length!==0){
             this.$nextTick(() => {  // 结构渲染完毕后执行
                this.activeNames = [this.lampPostInfo.lampList[0].rowId]
            })
        }
      })
    },
    //展开灯具折叠--查询实时监控数据
    handleChange(val){
        // this.activeNames = [];
        this.activeNames=[val]

    },
    //调用结束后初始化
    clearStatus(){        
        // this.progressShow = false;
        this.loading.close();
        clearTimeout(this.progressTimeOut);
    },
    getLampInfo(){//读取

    },
    trigger_light(val,rowId){  //开关灯
        if(rowId) this.controlRowId = rowId;
        this.onOff = val;
        var data = {
            aimingValue: "",
            onOff: val,
            lampConIdList: [this.controlRowId]
        }
        this.lodingShow();
        mapAPI.onOffLight(data).then(res=>{
          if(res.result === 'wait'){
              this.actionKey = res.actionKeyList[0].actionKey
          }else{
              this.clearStatus();
              this.$message('error',res.errorMsg)
          }
        }).catch((err) => {
            this.clearStatus();
        });
    },

    changeLightLevel(rowId,controlLightLevel){  //调节亮度    
      if(rowId) this.controlRowId = rowId;
      if(controlLightLevel) this.controlLightLevel = controlLightLevel;
      var data = {
          aimingValue: this.controlLightLevel,
          onOff: '2',
          lampConIdList: [ this.controlRowId ]
      }
      this.lodingShow();
      mapAPI.onOffLight(data).then(res=>{
          if(res.result === 'wait'){
              this.actionKey = res.actionKeyList[0].actionKey              
          }else{
              this.clearStatus();
              this.$message('error',res.errorMsg)
          }
      }).catch((err) => {
          this.clearStatus();
      });
    },
    
    lampListLiveQuery(rowId){ //读取
      
      if(rowId) this.controlRowId = rowId;
      var data = {
          lampConIdList: [this.controlRowId]
      }
      // this.progressShow = true
      this.lodingShow();
      mapAPI.lampListLiveQuery(data).then(res=>{
          if(res.result === 'wait'){
              this.actionKey = res.actionKeyList[0].actionKey
          }else{
              this.clearStatus();
              this.$message('error',res.errorMsg)
          }
      }).catch((err) => {
          this.clearStatus();
      });
    },
  },
  filters:{
    devicestatus:(val)=>{
      if(!val) return
      if(val === '0'){
          return '打开'
      }else{
          return '关闭'
      }
    },
    onlinestate:(val)=>{
      if(!val) return
      if(val === '0'){
          return '在线'
      }else{
          return '离线'
      }
    }
  },
}
</script>
<style>
    .mapLampDialog .el-collapse-item__header {
        color: #ffffff;
        background-color: #08304a !important;
    }

    .mapLampDialog   .el-collapse-item__wrap {
        background-color: #08304a !important;
    }
    .mapLampDialog .el-dialog__header{
        background-color: #08304a !important;
    }
    .mapLampDialog .el-dialog__title{
        color: #ffffff;
    }

    .mapLampDialog .el-dialog__body{
        background-color: #08304a !important;
    }

</style>


<style scoped>

    .el-dialog h4{
      color: #ffffff;
    }

  .demo-table-expand {
    font-size: 0;
    padding: 15px;
    border-bottom: 1px solid gray;
  }
  .demo-table-expand label {
    width: 90px;
    color: #ffffff;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
    color: #ffffff;
  }
  .controlButton{    
    text-align: center;
    margin-top: 20px;
    color: #ffffff;
  }
</style>
