<template>
<div>
    <el-row type="flex" align="middle">
      <el-col :span="8" style="margin-right:auto;">
        <el-button
          type   = "success"
          @click = "handleAdd()">新增</el-button>
        <el-button
          @click="handleEdit()">编辑</el-button>
        <el-button
          type   = "danger"
          @click = "handleDelete()">删除</el-button>
      </el-col>
    </el-row>
    <el-table
      ref               = "multipleTable"
      :data             = "tableData"
      tooltip-effect    = "dark"
      style             = "width: 100%"
      @selection-change = "handleSelectionChange">
      
      <el-table-column type="expand">
          <template slot-scope="scope">
              <el-row :gutter="24" v-for="item in scope.row.scheduleConfigList" :key="item.rowId">
                <el-col :span="8">策略类型：{{item.scheduleType | scheduleTypeFilter(formSelection.scheduleTypeOptions)}}</el-col>
                <el-col :span="8">时间：{{item.theTime}}</el-col>
                <el-col :span="8" v-if="item.scheduleType==='3'">调光值：{{item.brightness}}</el-col>
              </el-row>
          </template>
      </el-table-column>

      <el-table-column
        type  = "selection"
        width = "55">
      </el-table-column>
      <el-table-column 
        v-for="col in cityTableCol"
        :prop="col.prop" :label="col.label"  :formatter="col.formatter" :key="col.prop">
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


    <el-dialog class="dialog-common-sys" width="90%" :title="dialogTitle" :visible.sync="showDialog" :modal-append-to-body='false' :close-on-click-modal='false' @close="cancelUpdate()">
      
      <el-form :inline="true" :model="strategy" :rules="rules" ref="Form">
          <el-row type="flex" align="middle">
            <el-form-item label="策略名称" :label-width="formLabelWidth" prop="scheduleName">
                <el-input v-model="strategy.scheduleName" auto-complete="off" placeholder="请填写策略名称"></el-input>
            </el-form-item>
            <el-button type="primary" @click="addScheduleConfig()">新增类型</el-button>
          </el-row>

          <el-row v-for="(scheduleConfig,index) in strategy.scheduleConfigList" :key="scheduleConfig.rowId">
            <el-col :span="7">
              <el-form-item  class="el-row--flex" label="策略类型" :label-width="formLabelWidth" prop="scheduleType">
                <el-select v-model="scheduleConfig.scheduleType" placeholder="请选择所策略类型">
                  <el-option
                    v-for="item in formSelection.scheduleTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item  class="el-row--flex" v-if="scheduleConfig.scheduleType === '3'"  label="调光值" :label-width="formLabelWidth" prop="brightness">
                <el-slider v-model="scheduleConfig.brightness" style="width:200px"></el-slider>
              </el-form-item>
            </el-col>
            
            <el-col :span="7">
              <el-form-item  class="el-row--flex"  label="时间" :label-width="formLabelWidth" prop="theTime">
                <el-time-picker
                  v-model="scheduleConfig.theTime"
                  format='HH:mm' 
                  placeholder="任意时间点">
                </el-time-picker>
              </el-form-item>
            </el-col>

              <el-col :span="3">
              <el-form-item  class="el-row--flex"  label="" :label-width="formLabelWidth" prop="">
                
                  <el-button type="" @click="delScheduleConfig(index)">删除</el-button>
              </el-form-item>
            </el-col>
          </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer"> 
        <el-button @click="cancelUpdate()">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
      </div>
    </el-dialog>
    

  </div>
</template>

<script>
import strategyAPI from '@/api/lighting/strategyAPI'
import lampConfAPI from '@/api/config/lampConf'
import { mapState } from 'vuex';
import { formatTime , parseTime } from '@/utils/index'
import { validForbid } from '@/utils/validate'


  
export default {
  data() {
    return {
      flag:'',  //判断新增还是修改
      total            : 0,  //数据总条数
      pageSize         : 10,  //每页容量
      currentPage      : 1,  //当前页
      tableData        : [],  //表格数据
      multipleSelection: [],  //表格多选框选中项
      showDialog       : false,
      showDetailDialog : false, //太阳能绑定
      showCityDetailDialog: false, //市灯绑定
      dialogTitle      : '',  //弹出框标题
      tableCol : [], //table列参数
      strategy:{  //策略信息
        scheduleName:'',
        scheduleConfigList:[ //策略操作明细
         {
            scheduleType:'',
            brightness:0,
            theTime:''
         }
        ]
      },
      cityTableCol : [{
        label:'策略名称',
        prop:'scheduleName'
      },{
        label:'更新时间',
        prop:'updateTime',        
        formatter: this.timeFormat
      }],
      searchInfo:{  //查询条件
        scheduleName:'', //策略名字
        strategyState:'',  //策略写入状态
        lampName: '',//路灯名称
      },
      formLabelWidth: '120px',
      rules:{
        scheduleName: [
          { required: true, message: '请输入策略名', trigger: 'blur' },
          { trigger: 'blur', validator: validForbid }
        ],
      },
      bandingDetail:[],  //绑定详情(展示)
      bandingTableDetail: [],//绑定详情(缓存)  
      selectedStrategy:'',  //选中的策略id
      formSelection:{  //表单下拉选项
        projects:[  //项目
        ],
        roads:[  //路段
        ],
        scheduleTypeOptions:[],//策略类型
      }
    } 
  },
  components:{
  },
  computed:{
    ...mapState({
      projectId: state=>state.project.projectId,
    }),
  },
  created(){
    
  },
  beforeMount(){
    this.getScheduleTypeMap();//获取策略类型
  },
  mounted(){
    this.initDataByProjectId();
  },
  filters: {
    scheduleTypeFilter:function(value,args1){  //策略写入状态格式化
      let item = args1.find(res=>res.value==value)
      return item?item.label:'-'
    },
  },
  methods: {
    initDataByProjectId(){
      this.getTableData();
    },
    getTableData(){  //获取所有策略信息
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        policyName:this.searchInfo.strategyName
      };      
      strategyAPI.getList(params).then(res=>{
        this.total = res.total;
        this.tableData = res.records;
      })
    },
    getScheduleTypeMap(){//获取策略类型
      strategyAPI.getScheduleTypeMap().then(res=>{
        this.formSelection.scheduleTypeOptions = res;
      })
    },
    addScheduleConfig(){//新增策略明细
      this.strategy.scheduleConfigList.push(
        {scheduleType: '',brightness: 0,theTime: ''}
      )
    },
    delScheduleConfig(index){//删除策略明细    
      if(this.strategy.scheduleConfigList.length==1){
        this.$message({
          type   : 'error',
          message: '至少保留一条策略动作'
        });
      }else{
        this.strategy.scheduleConfigList.splice(index,1);
        this.$message({
          type   : 'success',
          message: '已删除'
        });
      }
     
    },
    formatTooltip(val){  //滑块格式化
        return val/100;
    },
    nullFormatter1(val){  //null数据格式化
      if(val.bandNum===null){
        return 0;
      }else{
        return val.bandNum;
      }
    },
    nullFormatter2(val){  //null数据格式化
      if(val.successNum===null){
        return 0;
      }else{
        return val.successNum;
      }
    },    
    timeFormat(val){  //时间格式化
        if(val.updateTime === null){
            return "-"
        }
        return parseTime(val.updateTime,'{y}-{m}-{d} {h}:{i}')
    },
    handleAdd(){  //打开新增框
      this.strategy.rowId = "";
      this.flag = 'add';
      this.dialogTitle = '新增';
      this.showDialog  = true;   

      this.$nextTick(() => {
        if(this.$refs['Form']){
          this.$refs['Form'].resetFields();
        }
      });
    },
    handleEdit(){  //打开编辑框
      this.flag = 'edit';
      if(this.multipleSelection.length != 0){  //判断是否选中
        if(this.multipleSelection.length === 1){ //判断是否选中单条
          var selected = this.multipleSelection[0];   
          setTimeout(() => {
            this.strategy = JSON.parse(JSON.stringify(selected));
            this.strategy.scheduleConfigList.map(res=>{
              res.theTime = new Date(2016, 9, 9, res.theTime.split(":")[0], res.theTime.split(":")[1])
            })
            this.dialogTitle = '编辑';
            this.showDialog  = true;
          }, 0);
         
        }else{
          this.$message({
            type   : 'warning',
            message: '不支持多条编辑'
          });
        }
      }else{
        this.$message({
          type   : 'warning',
          message: '请先选择一条记录'
        });
      }
    },
    handleDelete(){  //删除选中记录
      if(this.multipleSelection.length != 0){ //判断是否选中
        this.$confirm('确定要删除此条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          var idList = [];
          this.multipleSelection.map(item=>{
            idList.push(item.rowId);
          })
          this.doDelete(idList);
        }).catch(() => {
          this.$message({
            type   : 'info',
            message: '已取消删除'
          });
        });
      }else{
        this.$message({
          type   : 'warning',
          message: '请先选择一条记录'
        });
      }
    },
    doDelete(ids){  //处理删除请求
      strategyAPI.doDelete(ids).then(res=>{
        if(res){
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.getTableData();
        }else{
          this.$message.error('服务器错误');
        }
      })
    },
    saveOrUpdate(){  //处理新增或编辑
      this.$refs['Form'].validate((valid) => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.strategy))
          this.strategy.scheduleConfigList.map((res,index)=>{
            let h = res.theTime.getHours();
            h = h>9?h:"0"+h;
            let mm = res.theTime.getMinutes();
            mm =  mm>9?mm:"0"+mm;
            let theTime = h + ":"+mm +":00"; 
            params.scheduleConfigList[index].theTime = theTime;  
          })
          params.projectId = this.projectId;

          strategyAPI.updateScheduleConfigList(params).then(res=>{
            if(res.result){
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
      })
        
    },
    cancelUpdate(){  //取消新增或编辑
      this.showDialog = false;
      this.$refs['Form'].resetFields();
    },
    handleSelectionChange(val) {  //获取选中项
      this.multipleSelection = val;
    },
    current_change(currentPage){  //翻页
      this.currentPage = currentPage;
      this.getTableData();
    },
    getBandingDetail(row){  //获取策略绑定详情
      if(row) {
        this.selectedStrategy = row;
      }
      strategyAPI.queryBandLampConList(this.selectedStrategy.rowId).then(res=>{
        var vm = this;
        function filterFunc(item){
          if(vm.searchInfo.strategyState==='0'){
            return item.policyResult === vm.searchInfo.strategyState || item.policyResult === null
          }else{
            return item.policyResult === vm.searchInfo.strategyState
          }
        }
        this.bandingDetail = this.searchInfo.strategyState===""?res:res.filter(filterFunc);
        this.showDetailDialog = true;
      })
    },

    getBandingDetailCity(row){//获取策略绑定详情市灯
      this.selectedStrategy = row;
      strategyAPI.queryLampListByProject(this.selectedStrategy).then(res=>{
        this.bandingDetail = res;
        this.bandingTableDetail = this.bandingDetail;
        this.showCityDetailDialog = true;
        this.bindLampListQuery(); //勾选已绑定灯具
      })
    },

  }
}
</script>
<style scoped>
  .el-form-item{
    margin-bottom:0;
  }
  .el-row--flex{
    margin-bottom:20px;
  }
</style>
