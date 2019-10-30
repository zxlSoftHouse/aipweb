<template>
<div>
    <el-row type="flex" align="middle" :gutter="22">
        
        <div>
            分组
        </div>
        <el-col :span="2">
            <el-select v-model="groupModalInfo.groupInfo.rowId" @change="selectGroup">
                <el-option label="不分组" value="0"></el-option>
                <el-option
                    v-for="item in options.group"
                    :key="item.rowId"
                    :label="item.groupName"
                    :value="item.rowId"
                ></el-option>
            </el-select>
        </el-col>
        <div>控制方式</div>
        <el-col :span="2">
            <el-select v-model="searchInfo.controller">
                <el-option value="1" label="单灯控制"></el-option>
                <el-option v-if="groupModalInfo.groupInfo.rowId!=='0'" value="2" label="分组控制"></el-option>
            </el-select>
        </el-col>
        <div>开关</div>
        <el-col :xl="4" :lg="6">
            <el-button id="trigger" @click="trigger_light(1)">开灯</el-button>
            <el-button id="trigger" @click="trigger_light(0)">关灯</el-button>
            <el-button id="trigger" @click="lampListLiveQuery()">读取</el-button>
        </el-col>
        <div>亮度调节</div>
        <el-col :span="4">
            <el-slider :min="0" v-model="lightLevel" @change="changeLightLevel"></el-slider>
        </el-col>
    </el-row>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%;margin-top:10px;"
      @selection-change="handleSelectionChange"
      :row-key="getRowKeys" >
     <!--    <el-table-column type="expand">
            <template slot-scope="scope">
                <span v-if="scope.row.lampType === '0'&&scope.row.lampRunData===null">暂无数据</span>
            </template>
        </el-table-column> -->
        <el-table-column
            type  = "selection"
            width = "55"
            :reserve-selection="true">
        </el-table-column>
        <el-table-column
            prop  = "controlerName"
            sortable
            label = "灯具名称">
        </el-table-column>
        <el-table-column
            prop  = ""
            label = "在线状态"
            sortable
            align="center">
            <template slot-scope="scope">
                <span>
                    <i class="iconfont icon-zaixian" :class="scope.row.onlinestate === '0'?'colorGreen':'colorGray'">
                    </i>
                </span>
            </template>
        </el-table-column>
        <el-table-column
            prop  = ""
            align="center"
            sortable
            label = "设备状态">            
            <template slot-scope="scope">
                <!-- 市灯 -->
                <span>
                    <i  class="iconfont icon-yikaideng" 
                        :class="scope.row.devicestatus === '0' && scope.row.onlinestate === '0'?'colorGreen':'colorGray'">
                    </i>
                </span>
            </template>
        </el-table-column>
        <el-table-column
            prop  = "lampPostCode"
            label = "灯杆编号">
        </el-table-column>
        <el-table-column
            label = "亮度">
            <template slot-scope="scope">
                <span v-if="scope.row.devicestatus === '0' && scope.row.onlinestate === '0'">
                    {{ scope.row.brightness }}
                </span>
                <span v-else>-</span>
            </template>
        </el-table-column>
        <el-table-column
            label = "温度">
            <template slot-scope="scope">
                <span v-if="scope.row.devicestatus === '0' && scope.row.onlinestate === '0'">
                    {{ scope.row.temperature }}
                </span>
                <span v-else>-</span>
            </template>
        </el-table-column>
        <el-table-column
            label = "电压(V)">
            <template slot-scope="scope">
                <span v-if="scope.row.devicestatus === '0' && scope.row.onlinestate === '0'">
                    {{ scope.row.voltage }}
                </span>
                <span v-else>-</span>
            </template>
        </el-table-column>
        <el-table-column
            label = "电流(A)">
            <template slot-scope="scope">
                <span v-if="scope.row.devicestatus === '0' && scope.row.onlinestate === '0'">
                    {{ scope.row.electriccurrent }}
                </span>
                <span v-else>-</span>
            </template>
        </el-table-column>
        <el-table-column
            label = "能源趋势">
            <template slot-scope="scope">
                <div @click.stop>
                    <i class="iconfont icon-qushi cursor" @click="getElectricityConsumption(scope.row.rowId)"></i>
                </div>
            </template>
        </el-table-column>
        <el-table-column
            prop  = ""
            label = "更新时间">
            <template slot-scope="scope">
                <span v-if="scope.row.updateTime!=null">{{ updateTimeFormat(scope.row.updateTime) }}</span>
                <span v-else>-</span>
            </template>
        </el-table-column>
    </el-table>
    <div style="text-align: center;margin-top: 30px;">
      <el-pagination
        background
        layout          = "prev, pager, next, sizes, total"
        :total          = "total"
        :page-sizes="[10, 50, 100, 200]"
        @size-change="handleSizeChange"
        @current-change = "current_change">
      </el-pagination>
    </div>
    <el-dialog class="dialog-common-sys" :visible.sync="showDialog" :modal-append-to-body='false' width="70%" @close="closeDialog()">
        <div>
            <el-radio-group v-model="dateFlag">
                <el-radio-button label="year">月累计</el-radio-button>
                <el-radio-button label="month">日累计</el-radio-button>
            </el-radio-group>
            <span style="margin-right:20px;">选择日期</span>
            <el-date-picker
                v-model="date"
                :type="dateFlag"
                @change="selectDate"
                :value-format="dateFlag==='year'?'yyyy':'yyyy-MM'">
            </el-date-picker>
        </div>
        <div style="height:450px;margin-top: 70px;">
            <echart :chartData="electricityConsumption" className="lightingDataChart" ref="myChart"></echart>
        </div>
    </el-dialog>
    <el-dialog title="正在操作中" class="dialog-common-sys" :center="true" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="progressShow" :show-close="false" :modal-append-to-body='false' width="30%">
           <el-progress :text-inside="true" :stroke-width="26" :percentage="progress"></el-progress>
    </el-dialog>

    </div>
</template>
<script>
import api from '@/api/lighting/realTimeMonitoringAPI'
import { formatTime, parseTime } from '@/utils/index'
import echart from '@/components/echart/index'
import { Message, MessageBox } from 'element-ui'
import { mapState } from 'vuex';

export default {
  data() {
    return {
        groupModalInfo:{
            step:1,//1设置分组名称 2分配灯具
            editType: 1,//1新增 2修改
            showDialog:false,
            groupInfo:{
                controlModelId:'',
                groupName:'',
                groupNo:'',
                rowId:'0'
            },
            checkList:[],
            lampList: [],//列表展示灯具
            leftData:[],
            rightData:[],
        },
        checkType:'',//轮询方法标识
        reviewType: 1,//是否为轮询后再次调用  1等待 2启用 3结束  
        failList: [],//轮询失败后的列表
        onOff:false,
        progressShow: false,
        progress:0,//操作进度
        loading: '',
        websock: null,
        total:0,
        pageSize:10,
        currentPage:1,
        tableData:[],  //表格数据
        expandTableData:{},  //展开表格数据
        multipleSelection: [],  //选中项
        lightTrigger:'',  //灯的开关
        lightLevel:0,  //灯的亮度
        // 获取row的key值
        getRowKeys(row) {
          return row.rowId;
        },
        expands: [],
        searchInfo:{  //筛选条件
            projectId:'',
            roadId:'',
            controller:'1',//控制方式  1单等 2分组
        },
        options:{  //下拉框数据
            project:[],
            road:[],
            group:[],
            centralizedController:[]
        },
        formLableWidth:'100px',
        selectedId:'',  //选中灯具id
        showDialog:false,
        date:'',  //日期选择
        dateFlag:'year',  //日期选择框类型
        electricityConsumption:{  //灯具用电量数据图表
            tooltip : {
                trigger: 'axis',
            },
            legend: {
                data:['用电量']
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    data : []
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name:'用电量',
                    axisLabel : {
                        formatter: function(value){
                            return value + 'Kwh';
                        }
                    }
                },
            ],
            series : [
                {
                    name:'用电量',
                    type:'line',
                    smooth:true,  //这句就是让曲线变平滑的 
                    data:[],
                }
            ]
        },
        actionKeyList: [],//socket等待结果数据
        totalActionKeyList:[],
        sucActionKeyList:[],
        failActionKeyList:[],
        progressTimeOut: '',
    } 
  },
  components: {
    echart,
  },
  computed:{
    ...mapState({
      websocketData: state=>state.websock.websocketData,
      projectId: state=>state.project.projectId,
    }),
  },
  watch:{
      websocketData(newer, older){
        if(newer.result!=='resend' && this.totalActionKeyList.indexOf(newer.actionKey)!==-1){
            if(newer.result==='fail'){
                this.failActionKeyList.push(newer.actionKey)
            }else if(newer.result==='success'){                
                this.sucActionKeyList.push(newer.actionKey)
            }
            this.actionKeyListCheck(newer.actionKey)
        }
      },
      deep:true
  },
  mounted(){
      this.initDataByProjectId();
  },
  destroyed(){
      clearTimeout(this.progressTimeOut);
  },
  methods: {
    initDataByProjectId(){
        let groupInfo = this.$route.params.groupInfo//parms包含传递的所有参数=
        this.getTableData();
        this.getGroupList();

    },
    actionKeyListCheck(actionKey){
        this.actionKeyList.splice(this.actionKeyList.findIndex(item => item === actionKey), 1)
        let failLen = this.failActionKeyList.length||0;
        let TolLen = this.totalActionKeyList.length;
        let sucLen = this.sucActionKeyList.length||0;
        this.progress = parseFloat(sucLen/TolLen).toFixed(2)*100;//当前进度
        if(this.actionKeyList.length===0){
            this.clearStatus();            
            this.$alert(sucLen+'条成功，'+failLen+'条失败！', '指定发送完成', {
                confirmButtonText: '确定',
            });
            this.getTableData();
        }
    },

    progressTimeOutFun(){
      this.progressTimeOut = setTimeout(() => {
        this.progressShow=false;          
        this.$alert('指定发送超时', '指定发送超时', {
            confirmButtonText: '确定',
        });
      }, 1000 * 90);
    },
    handleChange(value, direction, movedKeys) {
        console.log(value, direction, movedKeys);
    },
    groupAiming(data){//开关/调光控制,groupIdList-分组id列表,onOff-开关,aimingValue-调光值
        let params = {
            groupIdList:[this.groupModalInfo.groupInfo.rowId],
            onOff:'',
            aimingValue:''
        }
        switch (data.type) {
            case "trigger_light":
                params.onOff = data.val;
                break;
            case "changeLightLevel":
                params.onOff = "2";
                params.aimingValue = this.lightLevel;
                break;
            default:
                break;
        }
        api.groupAiming(params).then(res=>{
            if(res.result==="success") {
              this.$message({
                type: 'success',
                message: '指定发送成功',
              });
            }else if(res.result==="error"){
              this.$message({
                type: 'error',
                message: res.errorMsg,
              });
            }else{
                this.progressShow = true;
                this.progress = 0;
                this.progressTimeOutFun();
                this.sucActionKeyList=[];
                this.failActionKeyList=[];
                this.actionKeyList = res.actionKeyList.map(it=>it.actionKey);
                this.totalActionKeyList = res.actionKeyList.map(it=>it.actionKey);
            }
        })
    },
    
    groupQuery(data){//分组读取
        let params = {
            groupIdList: [this.groupModalInfo.groupInfo.rowId]
        }
        api.groupQuery(params).then(res=>{
            if(res.result==="success") {
              this.$message({
                type: 'success',
                message: '指定发送成功',
              });
            }else if(res.result==="error"){
              this.$message({
                type: 'error',
                message: res.errorMsg,
              });
            }else{
                this.progressShow = true;
                this.progress = 0;
                this.progressTimeOutFun();
                this.sucActionKeyList=[];
                this.failActionKeyList=[];
                this.actionKeyList = res.actionKeyList.map(it=>it.actionKey);
                this.totalActionKeyList = res.actionKeyList.map(it=>it.actionKey);
            }
        })
    },
    //根据项目查询所有灯具
    queryLampListByProject(){
        let params = {
            projectId: this.searchInfo.projectId,
            roadId: this.searchInfo.roadId
        }
        api.queryLampListByProject(params).then(res=>{
            this.groupModalInfo.lampList = res.map(it=>{
                let lampInfo = {
                    key: it.rowId,
                    label: it.lampName,
                    groupNo: it.groupNo
                }
                return lampInfo;
            })
            //获取已选列表
            this.groupModalInfo.checkList = [];
            this.groupModalInfo.lampList.map(it=>{
                if(this.groupModalInfo.groupInfo.groupNo===it.groupNo){
                    this.groupModalInfo.checkList.push(it.key);
                }
            })
        })
    },
      //获取分组列表
    getGroupList(groupInfo){
        let data = {
            projectId:this.groupModalInfo.groupInfo.projectId,
            pageNum:1,
            pageSize:100
        }
        api.getGroupList(data).then(res=>{      
            this.options.group = res.records;
            groupInfo?this.groupModalInfo.groupInfo=groupInfo:this.groupModalInfo.groupInfo.rowId='0';      
        })
    },
    //分组trasnfer格式化
    renderFunc(h, option) {
        return <span>{ option.groupNo?option.groupNo:'未分组' } - { option.label }</span>;
    },
    modelDateFormat(val){  //日期格式化
      return parseTime(val.modelDate,'{y}-{m}-{d}')
    },
    getTableData(){
        this.expands = [];  //收起下拉框
        var data = {  //数pageNum-当前第几页,pageSize-每页大小,projectName-项目名称, roadName-路段名称
            pageNum:this.currentPage,
            pageSize:this.pageSize,
            projectId:this.projectId,
            roadId:this.searchInfo.roadId,
            groupRowId: this.groupModalInfo.groupInfo.rowId!=='0'?this.groupModalInfo.groupInfo.rowId:null
        }
        api.queryLampDataPage(data).then(res=>{
            this.tableData = res.records;
            this.total = res.total;
        })
    },
    updateTimeFormat(val){  //上报时间格式化
        if(val === null){
            return "暂无数据"
        }
        // return formatTime(val,'{y}-{m}-{d} {h}:{i}')
        return parseTime(val,'{y}-{m}-{d} {h}:{i}:{s}')
    },
    formatNull(val){  //空置格式化
        return val?val:"-";
    },
    queryRoadOptions(){  //获取路段下拉框数据
      api.queryRoadOptions(this.searchInfo.projectId).then(res=>{
        this.options.road = res;
      })
    },
    selectGroup(){//选择分组        
        this.getTableData();
    },
    current_change(currentPage){  //翻页
        this.currentPage = currentPage;
        this.getTableData();
    },
    handleSizeChange(val) {
        this.pageSize = val;
        this.currentPage = 1;
        this.getTableData();
    },
    handleSelectionChange(val) {  //处理选中值
        this.multipleSelection = val;
        if(this.multipleSelection.length===1){
            (this.multipleSelection[0].onlinestate==='1' || this.multipleSelection[0].devicestatus==='1') ? this.lightLevel=0:this.lightLevel = this.multipleSelection[0].brightness;            
        }else{
            this.lightLevel = 0;
        }
    },
    //根据状态判断ids数值
    getIdsByType(){
        let ids = [];
        if(this.reviewType===1){
            ids = this.multipleSelection.map(item=>item.rowId)
        }else{            
            ids = this.failList.map(item=>item.lampId)
        }
        return ids;
    },
    //调用结束后初始化
    clearStatus(){        
        this.reviewType = 1;
        this.progressShow = false;   
        clearTimeout(this.progressTimeOut);
        this.$refs.multipleTable.clearSelection();
    },
    setGroupLamp(){  //修改分组
        var data = {
            groupNo: this.groupModalInfo.groupInfo.groupNo,
            lampConIdList: this.groupModalInfo.checkList
        }
        this.progressShow = true;
        this.progress = 0;
        this.progressTimeOutFun();
        api.lampListGroup(data).then(res=>{
            if(res.result === 'poll'){
                this.checkType = "setGroupLamp";
                if(this.reviewType===1) this.reviewType=2;
                this.checkActionStatus(res.actionKeyList,5);
            }else{
                this.clearStatus();
                this.$message('error',res.errorMsg)
            }
        }).catch((err) => {
            this.clearStatus();
        });
    },
    trigger_light(val){  //开关灯
        this.onOff = val;
        if(this.searchInfo.controller==='2'){//分组操作
            this.groupAiming({type:'trigger_light',val:val})
            return;
        }
        if(this.multipleSelection.length != 0){
            var data = {
                aimingValue: "",
                onOff: val,
                lampConIdList: this.getIdsByType()
            }
            this.progressShow = true;
            this.progress = 0;
            this.progressTimeOutFun();
            api.onOffLight(data).then(res=>{
                this.sucActionKeyList=[];
                this.failActionKeyList=[];
                this.actionKeyList = res.actionKeyList.map(it=>it.actionKey);
                this.totalActionKeyList = res.actionKeyList.map(it=>it.actionKey);
            }).catch((err) => {
                this.clearStatus();
            });
        }else{
            this.$message({
            type: 'warning',
            message: '请先选择一条记录'
            });
        }
    },
    lodingShow(){        
        this.loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
    },
    lampListLiveQuery(){ //读取
    
        if(this.searchInfo.controller==='2'){//分组操作
            this.groupQuery({type:'lampListLiveQuery'})
            return;
        }
        if(this.multipleSelection.length != 0){
                var data = {
                    lampConIdList: this.getIdsByType()
                }
                this.progressShow = true
                this.progress = 0;
                this.progressTimeOutFun();
                api.lampListLiveQuery(data).then(res=>{
                    this.sucActionKeyList=[];
                    this.failActionKeyList=[];
                    this.actionKeyList = res.actionKeyList.map(it=>it.actionKey);
                    this.totalActionKeyList = res.actionKeyList.map(it=>it.actionKey);
                    /* if(res.result === 'poll'){
                        this.checkType = "lampListLiveQuery";//读取
                        if(this.reviewType===1) this.reviewType=2;
                        this.checkActionStatus(res.actionKeyList,5);
                    }else{
                        this.clearStatus();
                        this.$message('error',res.errorMsg)
                    } */
                }).catch((err) => {
                    this.clearStatus();
                });
        }else{
            this.$message({
            type: 'warning',
            message: '请先选择一条记录'
            });
        }
    },
    changeLightLevel(){  //调节亮度    
        if(this.searchInfo.controller==='2'){//分组操作
            this.groupAiming({type:'changeLightLevel'})
            return;
        }
        if(this.multipleSelection.length != 0){
            // if(this.multipleSelection.length === 1){
                var ids = [];
                var data = {
                    aimingValue: this.lightLevel,
                    onOff: '2',
                    lampConIdList: this.getIdsByType()
                }
                this.progressShow = true;
                this.progress = 0;
                this.progressTimeOutFun();
                api.onOffLight(data).then(res=>{
                    this.sucActionKeyList=[];
                    this.failActionKeyList=[];
                    this.actionKeyList = res.actionKeyList.map(it=>it.actionKey);
                    this.totalActionKeyList = res.actionKeyList.map(it=>it.actionKey);
                }).catch((err) => {
                    this.clearStatus();
                });
            // }else{
            //     this.$message({
            //     type: 'warning',
            //     message: '请先选择一条记录'
            //     });
            // }
        }else{
            this.$message({
            type: 'warning',
            message: '请先选择一条记录'
            });
        }
    },
    getLampData(){  //读取单一灯的数据
        
    },
    getElectricityConsumption(id){  //获取单灯用电量
        this.showDialog = true;
        this.selectedId = id;
        return false;
    },
    closeDialog(){
        this.showDialog = false;
        this.date = "";
    },
    selectDate(){  //选择日期
        var data = {
            lampId : this.selectedId,
            year: '',
            month:''
        }
        if(this.dateFlag==="year"){
            data.year = this.date;
        }else{
            var arr = this.date.split("-");
            data.year = arr[0];
            data.month = arr[1];
        }
        api.getElectricityConsumptionData(data).then(res=>{
            this.electricityConsumption.series[0].data=[];
            this.electricityConsumption.xAxis[0].data=[];
            res.map(item=>{
                this.electricityConsumption.series[0].data.push(item.activepower.toFixed(2));
                this.electricityConsumption.xAxis[0].data.push(item.theNum);
            })
            this.$refs.myChart.reload();
        })
    },
    }
}
</script>
<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .cursor:hover{
    cursor:pointer
    }
    .colorGreen{
        color: green;
    }
    .colorGray{
        color: gray;
    }
    .transfer-footer {
        margin-left: 20px;
        padding: 6px 5px;
    }
    .el-dropdown-menu{
        background-color: #ffffff;
    }
    .el-dropdown-menu--medium .el-dropdown-menu__item:hover{
        background-color: #ffffff;
    }
</style>