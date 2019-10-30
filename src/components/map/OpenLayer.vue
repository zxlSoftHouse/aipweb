<template>
  <div>
    <vl-map :load-tiles-while-animating="true" :load-tiles-while-interacting="true"
             data-projection="EPSG:4326" style="height: 840px">
      <vl-view :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation"></vl-view>

      <vl-geoloc @update:position="geolocPosition = $event">
        <template slot-scope="geoloc">
          <vl-feature v-if="geoloc.position" id="position-feature">
            <vl-geom-point :coordinates="geoloc.position"></vl-geom-point>
            <vl-style-box>
              <vl-style-icon src="_media/marker.png" :scale="0.4" :anchor="[0.5, 1]"></vl-style-icon>
            </vl-style-box>
          </vl-feature>
        </template>
      </vl-geoloc>
      <vl-layer-tile id="osm">
        <vl-source-osm></vl-source-osm>
      </vl-layer-tile>
      <vl-overlay 
        class="customOverlay"
        v-for="(mark,index) in lampPostAddr"
        v-bind:key="index"
        :position="[mark.lng,mark.lat]" >
        <template>
          <i class="iconfont icon-tubiao-zhihuidenggan" @click="openDialog(index)"></i>
        </template>
      </vl-overlay>
    </vl-map>
    <div class="myDialog">
      <el-dialog
          :title="title"
          :visible.sync="dialogVisible"
          :modal-append-to-body='false'
          :modal="false"
          width="30%">
          <div class="sub-title">
              <span>实时数据</span>
          </div>
          <el-form v-for="item in lampsInfo" :key="item.rowId" :inline="true"
              label-position="left" class="demo-table-expand">
              <div v-if="item.lampRunData != null">
              <el-form-item label="灯名">
                  <span>{{ item.lampName }}</span>
              </el-form-item>
              <el-form-item label="亮度">
                  <span>{{ item.lampRunData.brightness }}</span>
              </el-form-item>
              <el-form-item label="电压">
                  <span>{{ item.lampRunData.voltage }}</span>
              </el-form-item>
              <el-form-item label="电流">
                  <span>{{ item.lampRunData.electriccurrent }}</span>
              </el-form-item>
              <el-form-item label="有用功">
                  <span>{{ item.lampRunData.availablework }}</span>
              </el-form-item>
              <el-form-item label="无用功">
                  <span>{{ item.lampRunData.uselesswork }}</span>
              </el-form-item>
              <el-form-item label="有功电能">
                  <span>{{ item.lampRunData.activepower }}</span>
              </el-form-item>
              <el-form-item label="视在电能">
                  <span>{{ item.lampRunData.apparentpower }}</span>
              </el-form-item>
              <el-form-item label="频率">
                  <span>{{ item.lampRunData.frequency }}</span>
              </el-form-item>
              <el-form-item label="温度">
                  <span>{{ item.lampRunData.temperature }}</span>
              </el-form-item>
              <el-form-item label="设备状态">
                  <span>{{ item.lampRunData.devicestatus | devicestatus}}</span>
              </el-form-item>
              <el-form-item label="在线状态">
                  <span>{{ item.lampRunData.onlinestate | onlinestate }}</span>
              </el-form-item>
              </div>
          </el-form>
          <div class="sub-title">
              <el-row>
                  <el-col :span="8">
                      <div>操作</div>
                  </el-col>
              </el-row>
              <el-row type="flex" align="middle">
                  <el-col :span="24">
                      <el-button @click="trigger_light(1)">开灯</el-button>
                      <el-button @click="trigger_light(0)">关灯</el-button>
                      <el-button @click="getLampInfo">读取</el-button>
                  </el-col>
              </el-row>
              <el-row>
                  <el-col :span="8">
                      <div>亮度调节</div>
                  </el-col>
              </el-row>
              <el-row>
                  <el-col :span="16">
                      <el-slider :min="1" v-model="lightLevel" @change="changeLightLevel"></el-slider>
                  </el-col>
              </el-row>
          </div>
          <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">关 闭</el-button>
          </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import mapAPI from '@/api/common/map'

export default {
  data () {
    return { 
      dialogVisible:false,  //对话框
      index:'',  //选取灯的下标
      title:'',  //对话框标题
      lampList:[],  //灯杆列表
      zoom: 12,
      center: [0, 0],
      rotation: 0,
      geolocPosition: undefined,
      lampPostAddr:[],  //灯杆位置信息
      lampsInfo:[],  //灯杆上灯的信息
      lightLevel:0  //灯亮度
    }
  },
  beforeCreate(){
    debugger;
    mapAPI.getLampPost().then(res=>{
        this.lampList = res;
        res.map(item=>{
            this.lampPostAddr.push({lng:item.longitude,lat:item.latitude})
        })
        this.center = [this.lampPostAddr[0].lng,this.lampPostAddr[0].lat]
    })
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
  methods:{
    openDialog(val){  //打开对话框
      this.index = val;
      this.dialogVisible = true;
      this.title = this.lampList[val].lampPostCode;
      this.getLampInfo();
    },
    getLampInfo(){  //获取单灯数据
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          target:'.el-dialog__body',
          background: 'rgba(0, 0, 0, 0.7)'
      });
      mapAPI.queryOneLampPost(this.lampList[this.index].rowId).then(res=>{
          var ids = [];
          res.lampList.map(item=>{
              ids.push(item.rowId);
          })
          mapAPI.queryLampById(ids).then(res=>{
              loading.close();
              this.lampsInfo = res;
          })
      })
    },
    trigger_light(val){  //开关灯
      var ids = [];
      this.lampsInfo.map(item=>{
          ids.push(item.rowId)
      })
      var data = {
          aimingValue: "",
          onOff: val,
          lampIdList: ids
      }
      mapAPI.onOffLight(data).then(res=>{
          if(res.result === 'poll'){
              this.checkActionStatus(res.actionKeyList,3);
          }else{
              this.$message('error',res.errorMsg)
          }
      })
    },
    changeLightLevel(val){  //调节亮度
      var ids = [];
      this.lampsInfo.map(item=>{
          ids.push(item.rowId)
      })
      var data = {
          aimingValue: val,
          onOff: '2',
          lampIdList: ids
      }
      mapAPI.onOffLight(data).then(res=>{
          if(res.result === 'poll'){
              this.checkActionStatus(res.actionKeyList,3);
          }else{
              this.$message('error',res.errorMsg)
          }
      })
    },
    checkActionStatus(actionKeyList,times){  //轮询
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      var data = {
        actionList: actionKeyList,
        isLastTime: times===0?true:false
      }
      mapAPI.checkActionStatus(data).then(res=>{
        var flag = true;
        res.map(item=>{
            if(item.result === "wait"){
                flag = false;
            }
        })
        if(res === [] || flag){
            loading.close();
            this.getLampInfo();
            this.$message({
                type: 'success',
                message: '操作成功'
            });
            return;
        }
        this.sleep(500);
        this.checkActionStatus(res,times-1);
      })
    },
    sleep(delay) {
        var start = (new Date()).getTime();
        while ((new Date()).getTime() - start < delay) {
            continue;
        }
    },
  }
}
</script>
<style lang="scss">
  .customOverlay i{
    font-size: 100px;
  }
  .myDialog{
    .demo-table-expand {
      font-size: 0;
      padding: 15px;
      border-bottom: 1px solid white;
    }
    .demo-table-expand span{
      color: #ffffff;
    }
    .demo-table-expand label {
      width: 90px;
      color: #ffffff;
    }
    .demo-table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
    .el-dialog__body{
      padding: 10px 20px;
      .sub-title{
        color: #ffffff;
        font-size: 20px;
      }
    }
    .el-dialog__title{
      color: #ffffff;
    }
    .el-dialog{
      margin-right: 15vh;
      background-color: #08304a;
      opacity: 0.8;
    }
  }
  .sub-title{
    .el-row{
      margin-bottom: 10px;
    }
  }
</style>
