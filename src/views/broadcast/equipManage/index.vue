<template>
  <div style="background: #fff;">
    <el-row>
      <el-col :span="16">
        <el-button type="success" @click="handleAdd">新增</el-button>
        <el-button @click="handleEdit">编辑</el-button>
        <el-button type="danger" @click="handleDelete">删除</el-button>
        <!-- <el-button type="primary" @click="volumeChange">调节音量</el-button> -->
      </el-col>
      <!-- <el-col :span="6">
        <el-input type="text" placeholder="搜索" v-model="searchInfo"></el-input>
      </el-col> -->
      <!-- <el-col :span="2">
        <el-button type="primary" @click="init">搜索</el-button>
      </el-col> -->
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
        prop="id"
        label="终端编号">
      </el-table-column>
      <el-table-column
        prop="name"
        label="终端名称">
      </el-table-column>
      <el-table-column
        prop="ip"
        label="IP地址">
      </el-table-column>
      <el-table-column
        prop="bcoutv"
        label="广播输出音量">
      </el-table-column>
      <!-- <el-table-column
        prop="bcinv"
        label="广播输入音量">
      </el-table-column> -->
      <el-table-column
        prop="state"
        label="终端状态"
        >
        <template slot-scope="scope">
          <div>
            {{ scope.row.state  | cameraStatusFlag }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="task"
        label="任务状态"
        >
        <template slot-scope="scope">
          <div>
            {{ scope.row.task | equipTaskFlag }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: center;margin-top: 30px;">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
        :page-size="pageCount"
        @current-change="current_change"  
        @size-change="handleSizeChange"
        :current-page="pageIndex"
        >
      </el-pagination>
    </div>
    <edit @handleClose="handleClose" @init="init" :dialogObj="dialogObj" :singInfo="multipleSelection"></edit>
    <volume :volumeDialog="volumeDialog" @init="init" :singVolume='multipleSelection' @handleVolumeClose='handleVolumeClose'></volume>
  </div>
</template>

<script>
import equipConfigAPI from '@/api/broadcast/equipConfig'
import edit from './edit.vue'
import volume from './volume.vue'

export default {
  data() {
    return {
      total: 0,
      pageCount: 10,
      pageIndex: 1,
      tableData: [],
      multipleSelection: [],
      searchInfo: '',
      dialogObj: {
        isShow: false,
        title: '',
        tid: '',
      },
      volumeDialog:{
        isHidden:false
      },
    } 
  },
  methods: {
    getTableData(){
      let _this = this
      let data = {
        pageIndex: _this.pageIndex-1,
        pageCount: _this.pageCount,
        groupName: "*",
        showType: 0,
        user: "admin",
        simple: 1
      }
      equipConfigAPI.getList(data).then(res=>{
        this.tableData = res.rows;
        _this.total = parseInt(res.total);
      })
    },
    getCurrentPage() {
      let data = this.$route.query;
      if (data) {
        if (data.page) {
          this.pageIndex = parseInt(data.page)
        } else {
          this.pageIndex = 1;
        }
      }
    },
    handleClose() {
      this.dialogObj.isShow = false;
      this.dialogObj.tid = '';
    },
    handleAdd(){ 
      this.dialogObj.isShow = true;
      this.dialogObj.title = '新增';
    },
    handleEdit(){ 
      if (this.multipleSelection.length != 0) {
        if(this.multipleSelection.length === 1){
          this.dialogObj.tid = this.multipleSelection[0].rowId;
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
    doDelete(ids){ 
      equipConfigAPI.doDelete(ids).then(res=>{
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
    // 调节音量
    volumeChange(){
      if(this.multipleSelection.length == 1){
        this.volumeDialog.isHidden = true;
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
    handleVolumeClose(){
      this.volumeDialog.isHidden = false;
    },
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
            tid: idList,
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
    handleSelectionChange(val) {  //处理选中项
      this.multipleSelection = val;
    },
    current_change(currentPage){  //翻页
      this.pageIndex = currentPage;
      this.getTableData();
    },
    //每页显示数据量变更
    handleSizeChange(val) {
      this.pageCount = val;
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
    edit,
    volume
  },
}
</script>