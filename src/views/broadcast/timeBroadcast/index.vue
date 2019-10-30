<template>
  <div style="background: #fff;">
    <el-row>
      <el-col :span="16">
        <el-button type="fault" class="button-start" style="width:75px;height:36px;" @click="taskStartEnd('runtaskinfo')">
          <img src="../../../assets/images/start.png" class="start-image">
          <span class="start-text">开始</span>
        </el-button>
        <el-button type="fault" class="button-start" style="width:75px;height:36px;">
          <img src="../../../assets/images/stop.png" class="start-image">
          <span class="start-text" @click="taskStartEnd('stoptaskinfo')">暂停</span>
        </el-button>
        <el-button type="success" @click="handleAdd">添加</el-button>
        <el-button type="primary" @click="handleEdit">编辑</el-button>
        <el-button type="danger" @click="handleDelete">删除</el-button>
        <!-- <el-button type="warning">定时关闭</el-button> -->
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
        prop="name"
        label="任务名称">
      </el-table-column>
      <el-table-column
        prop="state"
        label="状态"
        >
        <template slot-scope="scope">
          <div>
            {{ scope.row.state  | broadcastTaskFlag }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="触发器">
      </el-table-column>
      <el-table-column
        prop="operation"
        label="操作">
      </el-table-column>
    </el-table>
    <div style="text-align: center;margin-top: 30px;">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
        :page-size="pageCount"
        @current-change="current_change">
      </el-pagination>
    </div>
    <edit @handleClose="handleClose" @init="init" :dialogObj="dialogObj"></edit>
  </div>
</template>

<script>
import timeBroadcastConfigAPI from '@/api/broadcast/timeBroadcast'
 import { formatSeconds } from '@/utils/index'
import edit from './edit.vue'

export default {
  data() {
    return {
      total: 0,
      pageCount: 10,
      pageIndex: 0,
      tableData: [],
      multipleSelection: [],
      searchInfo: '',
      dialogObj: {
        isShow: false,
        title: '',
        id: ''
      },
      operation:''
    } 
  },
   methods: {
    getTableData(){
      let _this = this;
      let data = {
        pageIndex: _this.pageIndex,
        pageCount: _this.pageCount,
        user: "admin"
      }
      timeBroadcastConfigAPI.getList(data).then(res=>{
        _this.tableData = res.rows;
        _this.total = parseInt(res.total);
        let dataList = res.rows;
        let operationData;
        let newArr = dataList.map(item=>{
          operationData = formatSeconds(item.operation.split("|")[4]);
          if(item.operation.split("|")[3]==='0'){
            item.operation="[广播]文件,时长"+operationData;
          }else{
            item.operation="[广播]文件,持续"+formatSeconds(item.operation.split("|")[3]);
          }
          let weekdays = item.description.split("|")[5];
          weekdays = weekdays.replace(/1/g, "一");
          weekdays = weekdays.replace(/2/g, "二");
          weekdays = weekdays.replace(/3/g, "三");
          weekdays = weekdays.replace(/4/g, "四");
          weekdays = weekdays.replace(/5/g, "五");
          weekdays = weekdays.replace(/6/g, "六");
          weekdays = weekdays.replace(/7/g, "日");
          weekdays = weekdays.replace(/</g, ",");
          let days;
          if(item.description.split("|")[1] == "1"){
            days = '每周 ('+weekdays + ')';
          }else if(item.description.split("|")[1] == "0"){
            days = '每天';
          }
          item.description = "[定时]" + item.description.split("|")[4]+ days + item.description.split("|")[2] + '>'+item.description.split("|")[2];
          return item
        })
      })
    },
    // 开始按钮与暂停按钮
    taskStartEnd(tasktype){
      if(this.multipleSelection.length == 1){
        var idList;
        this.multipleSelection.map(item=>{
          idList = item.id
        })
        let data = {
          taskCommand:tasktype,
          taskId: idList
        }
        timeBroadcastConfigAPI.exetaskcmd(data).then(res=>{
        })
      }else if(this.multipleSelection.length > 1){
        this.$message({
          type: 'warning',
          message: '只能选择一条记录'
        });
      }else{
        this.$message({
          type: 'warning',
          message: '请先选择一条记录'
        });
      }
    },
    // 新增按钮
    handleAdd(){ 
      this.dialogObj.isShow = true;
      this.dialogObj.title = '新增';
    },
    getCurrentPage() {
      let data = this.$route.query;
      if (data) {
        if (data.page) {
          this.currentPage = parseInt(data.page)
        } else {
          this.currentPage = 1
        }
      }
    },
    // 编辑
    handleEdit(){ 
      if (this.multipleSelection.length != 0) {
        if(this.multipleSelection.length === 1){
          this.dialogObj.id = this.multipleSelection[0].id;
          this.dialogObj.isShow = true;
          this.dialogObj.title = '编辑';
        }else{
          this.$message({
            type: 'warning',
            message: '不支持多条编辑'
          });
        }
      } else{
        this.$message({
          type: 'warning',
          message: '请先选择一条记录'
        });
      }
    },
    // 弹框关闭
    handleClose() {
      this.dialogObj.isShow = false;
      this.dialogObj.id = '';
    },
    handleSelectionChange(val) {  //处理选中项
      this.multipleSelection = val;
    },
    doDelete(ids){ 
      timeBroadcastConfigAPI.exetaskcmd(ids).then(res=>{
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
    // 删除
    handleDelete(){
      if(this.multipleSelection.length == 1){
        this.$confirm('确定要删除此条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var idList;
          this.multipleSelection.map(item=>{
            idList = item.id
          })
          let data = {
            taskCommand:'deltaskinfo',
            taskId: idList,
          }

          this.doDelete(data);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }else if(this.multipleSelection.length > 1){
        this.$message({
          type: 'warning',
          message: '只能选择一条记录'
        });
      }else{
        this.$message({
          type: 'warning',
          message: '请先选择一条记录'
        });
      }
    },

    current_change(currentPage){  //翻页
      this.currentPage = currentPage;
      this.getTableData();
    },
    init() {
      this.getCurrentPage()
      this.getTableData();
    },
  },
  created() {
    this.init();
  },
  components:{
    edit
  },
}
</script>
<style lang="scss">
  .button-start {
    position: relative;
    .start-image {
      height: 18px;
      width: 18px;
      position: absolute;
      left: 10px;
      top: 9px;
    }
    .start-text {
      position: absolute;
      right: 10px;
      top: 12px;
    }
  }
</style>