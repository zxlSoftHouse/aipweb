<template>
<div>
    <el-row type="flex" align="middle"> 
      <el-col :span="2">
        分组类型：
      </el-col>
      <el-col :span="4" >
        <el-select v-model="searchInfo.groupTypeFlag" placeholder="请选择分组类型" @change="getTableData">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in formSelection.groupTypeOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-button
          type="success"
          @click="handleAdd()">新增</el-button>
        <el-button
          @click="handleEdit()">编辑</el-button>
        <el-button
          type="danger"
          @click="handleDelete()">删除</el-button>
      </el-col>

   <!--    <div>开关</div>
      <el-col :xl="4" :lg="6">
          <el-button id="trigger" @click="groupAiming({type:'trigger_light',val:1})">开灯</el-button>
          <el-button id="trigger" @click="groupAiming({type:'trigger_light',val:0})">关灯</el-button>
          <el-button id="trigger" @click="groupAiming({type:'lampListLiveQuery'})">读取</el-button>
      </el-col> -->

      
      <div>亮度调节</div>
      <el-col :span="4" :offset="1">
          <el-slider :min="0" v-model="lightLevel" @change="groupAiming({type:'changeLightLevel'})"></el-slider>
      </el-col>
    </el-row>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="groupName"
        label="分组名称">
      </el-table-column>
      <el-table-column
        prop="groupTypeFlag"
        label="分组类型"
        :formatter="bindingFormat">
      </el-table-column>
      <el-table-column
        prop="groupNum"
        label="灯具数量">
      </el-table-column>
      <el-table-column
        label="实时监控">
        <template slot-scope="scope">
            <div @click.stop>
                <i class="iconfont icon-shishishuju cursor" @click="getRealTime(scope.row)"></i>
            </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="groupAiming({type:'trigger_light',id:scope.row.rowId,val:1})">开灯</el-button>
          <el-button
            size="mini"
            type="warning"
            @click="groupAiming({type:'trigger_light',id:scope.row.rowId,val:0})">关灯</el-button>
          <el-button
            type="info"
            size="mini"
            @click="groupQuery({id:scope.row.rowId})">读取</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: center;margin-top: 30px;">
      <el-pagination
        background
        layout          = "prev, pager, next"
        :total          = "total"
        @current-change = "current_change">
      </el-pagination>
    </div>
    <groupEditStep ref="groupEditStep" :groupModalInfo="groupModalInfo"></groupEditStep>


    <el-dialog title="正在操作中" class="dialog-common-sys" :center="true" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="progressShow" :show-close="false" :modal-append-to-body='false' width="30%">
           <el-progress :text-inside="true" :stroke-width="26" :percentage="progress"></el-progress>
    </el-dialog>
  </div>
</template>

<script>
import singleControllerConfAPI from '@/api/config/singleControllerConf'
import api from '@/api/lighting/groupAPI'
import groupEditStep from '@/components/groupEditStep/index'
import { mapState } from 'vuex';

const groupModalInfo = {
    step:1,//1设置分组名称 2分配灯具
    editType: 1,//1新增 2修改
    showDialog:false,
    groupInfo:{
        centralizedControlId:'',
        groupType: '0',
        groupName:'',
        groupNo:'',
        rowId:'0'
    },
    checkList:[],
    lampList: [],//列表展示灯具
    leftData:[],
    rightData:[],
}
export default {
  data() {
    return {   
      lightLevel:0,  //灯的亮度
      progress:0,//操作进度
      progressShow: false,
      searchInfo:{  //筛选条件
          projectId:'',
          groupTypeFlag: '',//分组类型
      },
      groupModalInfo: {},
      flag:'', //判断新增或编辑
      total:0,
      pageSize:10,
      currentPage:1,
      tableData: [],  //表格数据
      multipleSelection: [],  //选中项
      showDialog:false,
      dialogTitle:'',
      formLabelWidth:'100px',
      rules:{
        controlType: [
          { required: true, message: '请选择单控器类型', trigger: 'change' },
        ],
        controlName: [
          { required: true, message: '请填写单控器名称', trigger: 'blur' }
        ]
      },
      lampControl:{
        rowId:'',
        controlName:'',  //单控器名称
        protocolXml:'',  //协议
        // controlType:'',  //类型
        controlCode:'',  //编号
        controlModelId:'',  //型号
        controlTenderId:'',  //厂家
        bindingFlag:'',  //绑定状态
        controlAddress:'',  //单控器地址
        solarPolicyId:'', //策略
        lampControlParamList:[  //参数项
        ]
      },
      formSelection:{  //表单下拉
        project:[],
        centralizedController:[],
        groupTypeOption:[]
      },
      actionKeyList: [],//socket等待结果数据
      totalActionKeyList:[],
      sucActionKeyList:[],
      failActionKeyList:[],
      progressShow: false,
      progressTimeOut: '',
    } 
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
  components:{
    groupEditStep
  },
  beforeMount(){
    this.groupModalInfo = JSON.parse(JSON.stringify(groupModalInfo))  //初始化时将静态数据转成字符串后赋值
  },
  mounted(){
    this.initDataByProjectId();
  },
  destroyed(){    
        clearTimeout(this.progressTimeOut);
  },
  methods: {
    initDataByProjectId(){
      this.getTableData();
      this.getFormSelection();
    },
    actionKeyListCheck(actionKey){
        this.actionKeyList.splice(this.actionKeyList.findIndex(item => item === actionKey), 1)
        let failLen = this.failActionKeyList.length||0;
        let sucLen = this.sucActionKeyList.length||0;
        let TolLen  = this.totalActionKeyList.length||0;
        this.progress = parseFloat(sucLen/TolLen).toFixed(2)*100;//当前进度
        if(this.actionKeyList.length===0){
          this.clearStatus();            
          this.$alert(sucLen+'条成功，'+failLen+'条失败！', '指定发送完成', {
              confirmButtonText: '确定',
          });
        }
    },
    getTableData(){  //获取表格数据
      //获取分组列表
      let data = {
          projectId:this.projectId,
          groupTypeFlag:this.searchInfo.groupTypeFlag,
          pageNum:this.currentPage,
          pageSize:this.pageSize
      }
      api.getGroupList(data).then(res=>{
        this.total = res.total;
        this.tableData = res.records;
      })
    },    
    getFormSelection(){  //获取表单下拉框数据/基础数据
      this.getGroupTypeFlagMap();
      // this.queryModelOptions();
    },
    
    progressTimeOutFun(){
      this.progressTimeOut = setTimeout(() => {
          this.progressShow=false;          
          this.$alert('指定发送超时', '指定发送超时', {
              confirmButtonText: '确定',
          });
      }, 1000 * 180);
    },
        
    getGroupTypeFlagMap(){  ///获取分组类型
        api.getGroupTypeFlagMap().then(res=>{
            this.formSelection.groupTypeOption = res;
        })
    },
    goGroupEditInit(){
      this.$refs.groupEditStep.showDialog = true;
      this.$refs.groupEditStep.active = 0;
      this.$refs.groupEditStep.groupTypeOption = this.formSelection.groupTypeOption;
      this.$refs.groupEditStep.projectId = this.projectId;
    },
    handleAdd(){  //打开新增框
      this.lampControl.rowId = "";
      this.flag = 'add';
      this.groupModalInfo.groupInfo = {
        centralizedControlId:'',
        groupType: '0',
        groupName:'',
        groupNo:'',
        projectId: this.searchInfo.projectId,
        rowId:'0'
      };
      this.groupModalInfo.editType = 1;
      this.goGroupEditInit();
    },
    handleEdit(){  //打开编辑框，填充表单
      if(this.multipleSelection.length != 0){
        this.flag = 'edit';
        if(this.multipleSelection.length === 1){
          var selected = this.multipleSelection[0];
          setTimeout(() => {
            this.groupModalInfo.groupInfo = JSON.parse(JSON.stringify(selected));
            this.groupModalInfo.editType = 2;
            this.goGroupEditInit();
          }, 0);
        }else{
          this.$message({
            type: 'warning',
            message: '不支持多条编辑'
          });
        }
      }else{
        this.$message({
          type: 'warning',
          message: '请先选择一条记录'
        });
      }
    },
    handleDelete(){  //删除选中项
      if(this.multipleSelection.length != 0){
        this.$confirm('确定要删除此条记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          let delList = this.multipleSelection.map(it=>it.rowId)
          api.deleteByIdList(delList).then(res=>{
              this.getTableData();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }else{
        this.$message({
          type: 'warning',
          message: '请先选择一条记录'
        });
      }
    },
    doDelete(ids){  //删除请求
      singleControllerConfAPI.doDelete(ids).then(res=>{
        this.$message({
          type: 'success',
          message: '删除成功'
        });
        this.getTableData()
      }).catch(()=>{
        this.$message.error('服务器错误');
      })
    },
    cancelUpdate(){  //取消新增或更新
      this.$refs['Form'].resetFields();
      this.lampControl.lampControlParamList = [];
      this.showDialog = false;
    },
    saveOrUpdate(){  //处理新增或更新
      this.$refs['Form'].validate((valid) => {
        if (valid) {
          singleControllerConfAPI.addOrEdit(this.lampControl).then(res=>{
            if(res.rowId){
              this.showDialog = false;
              this.$message({
                type: 'success',
                message: this.flag == 'add' ? '新增成功' : '修改成功'
              });
              this.getTableData();
            }else{
              this.$message.error('服务器错误');
            }
          })
        }
      });
    },
    current_change(currentPage){  //翻页
      this.currentPage = currentPage;
      this.getTableData();
    },
    handleSelectionChange(val) {  //处理选中值
      this.lightLevel = 0;
      this.multipleSelection = val;
    },
    bindingFormat(val){  //绑定集控器名称
      let item = this.formSelection.groupTypeOption.find(res=>res.value==val.groupTypeFlag)
      return item?item.label:'-'
    },
    getByTenderId(val){  //根据id获取名称
      let row = this.formSelection.tenderOptions.filter(it=>it.rowId==val.controlTenderId);
      return row.length>0?row[0].venderName:"未知厂家"
    },
  
    //调用结束后初始化
    clearStatus(){        
        this.progressShow = false;           
        clearTimeout(this.progressTimeOut);
        this.$refs.multipleTable.clearSelection();
    },
    
    groupAiming(data){//开关/调光控制,groupIdList-分组id列表,onOff-开关,aimingValue-调光值
        console.log(data)
        let params = {
            groupIdList: [data.id],
            onOff:'',
            aimingValue:''
        }
        switch (data.type) {
            case "trigger_light":
                params.onOff = data.val;
                break;
            case "changeLightLevel":                
                if(this.multipleSelection.length != 0){
                  if(this.multipleSelection.length === 1){
                    params.groupIdList = this.multipleSelection.map(it=>it.rowId)
                    params.onOff = "2";
                    params.aimingValue = this.lightLevel;                    
                    break;
                  }else{
                    this.$message({
                      type: 'warning',
                      message: '不支持多条编辑'
                    });
                    break;
                  }
                }else{
                  this.$message({
                    type: 'warning',
                    message: '请先选择一条记录'
                  });
                  break;
                }
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
            groupIdList: [data.id]
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
    getRealTime(groupInfo){//查看实时监控
      console.log(groupInfo)
     this.$router.push({
          path:'/lighting/realTimeMonitoring',//跳转路径
          name: 'realTimeMonitoring',//跳转路径的name值，不写跳转后页面取不到参数
          // 参数
          params: { 
              groupInfo: groupInfo
          }
      })
  }
  },
  
}
</script>
