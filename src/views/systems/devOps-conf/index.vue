<template>
  <div class="app-container">
    <el-row>
      <el-col :span="16">
        <el-button
          type="success"
          @click="handleAdd">新增</el-button>
        <el-button
          @click="handleEdit">编辑</el-button>
        <el-button
          type="danger"
          @click="handleDelete">删除</el-button>
      </el-col>
      <el-col :span="6">
        <el-input type="text" placeholder="请输入姓名" v-model="searchInfo"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="init">搜索</el-button>
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
        prop="userName"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="telNum"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="emailAddress"
        label="邮箱地址">
      </el-table-column>
    </el-table>
    <div style="text-align: center;margin-top: 30px;">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        @current-change="current_change">
      </el-pagination>
    </div>
    <edit @handleClose="handleClose" @init="init" :dialogObj="dialogObj"></edit>
  </div>
</template>
<script>
import devOpsConfAPI from '@/api/config/devOpsConf'
import edit from './edit.vue'
export default {
  data() {
    return {
      total: null,
      pageSize: 10,
      currentPage: null,
      tableData: [],
      multipleSelection: [],
      searchInfo: '',
      dialogObj: {
        isShow: false,
        title: '',
        rowId: ''
      }
    } 
  },
  mounted(){
    this.initDataByProjectId();
  },
  methods: {
    initDataByProjectId(){
      this.getCurrentPage()
      this.getTableData();
    },
    getTableData(){
      let params = {
        pageNum: this.currentPage, pageSize:  this.pageSize, userName: this.searchInfo
      }
      devOpsConfAPI.getList(params).then(res=>{
        this.tableData = res.records;
        this.total = res.total;
      })
    },
    doDelete(ids){ 
      devOpsConfAPI.doDelete(ids).then(res=>{
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
    handleClose() {
      this.dialogObj.isShow = false;
      this.dialogObj.rowId = '';
    },
    handleAdd(){ 
      this.dialogObj.isShow = true;
      this.dialogObj.title = '新增';
    },
    handleEdit(){ 
      if (this.multipleSelection.length != 0) {
        if(this.multipleSelection.length === 1){
          this.dialogObj.rowId = this.multipleSelection[0].rowId;
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
    handleDelete(){
      if(this.multipleSelection.length != 0){
        this.$confirm('确定要删除此条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var idList=[];
          this.multipleSelection.map(item=>{
            idList.push(item.rowId);
          })
          this.doDelete(idList)
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
    handleSelectionChange(val) {  //处理选中项
      this.multipleSelection = val;
    },
    current_change(currentPage){  //翻页
      this.currentPage = currentPage;
      this.getTableData();
    },
  },
  components:{
    edit
  },
}
</script>