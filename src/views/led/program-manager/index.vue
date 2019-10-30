<template>
<div class="app-container">
  <el-row>
    <el-col>
      <el-button type="success" @click = "handleAdd()">
        <i class="iconfont icon-xinzeng"></i>
        新增
      </el-button>
      <el-button type="primary" @click="handleEdit()">
        <i class="iconfont icon-bianji1"></i>
        编辑
      </el-button>
      <el-button type="warning" @click="handleDelete()">
        <i class="iconfont icon-shanchu"></i>
        删除
      </el-button>
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
      prop="itemName"
      label="节目名称">
    </el-table-column>
    <el-table-column
      prop="fileSize"
      label="节目大小">
    </el-table-column>
    <el-table-column
      prop="itemWidth"
      label="宽">
    </el-table-column>
    <el-table-column
      prop="itemHeight"
      label="高">
    </el-table-column>
  </el-table>
  <div style="text-align: center;margin-top: 30px;">
    <el-pagination
      background
      layout="total, prev, pager, next, jumper"
      :total="total"
      @current-change="current_change"
      :page-size="pageSize"
    ></el-pagination>
  </div>
  <edit @handleClose="handleClose" @init="initDataByProjectId" :dialogObj="editDialogObj"></edit>
</div>
</template>
<script>
import programManagerAPI from '@/api/led/programManagerAPI'
import edit from './edit.vue'

export default {
  data() {
    return {
      // 新增编辑
      editDialogObj: {
        isShow: false,
        title: '',
        rowId: ''
      },
      total: 0,  //数据总条数
      pageSize: 10,  //每页容量
      currentPage: 1,  //当前页
      tableData: [],  //表格数据
      multipleSelection: [],  //表格多选框选中项
      showDialog: false,
      dialogTitle: '',  //弹出框标题
      program:{
        rowId:'',
      },
      rules: {
      },
      formLabelWidth: '80px',
    }
  },
  components: {
    edit
  },
  created(){
    this.initDataByProjectId();
  },
  methods: {
    initDataByProjectId() {
      this.getTableData();
    },
    getTableData(){  //获取所有节目信息
      programManagerAPI.getList(this.currentPage,this.pageSize).then(res=>{
        this.total = res.total;
        this.tableData = res.records;
      })
    },
    handleClose() {
      this.editDialogObj.isShow = false;
      this.editDialogObj.rowId = '';
    },
    handleAdd(){  //打开新增页面
      this.editDialogObj.isShow = true;
      this.editDialogObj.title = '新增';
    },
    handleEdit(id){  //打开编辑页面
      if (this.multipleSelection.length != 0) {
        if(this.multipleSelection.length === 1){
          this.editDialogObj.rowId = this.multipleSelection[0].rowId;
          this.editDialogObj.isShow = true;
          this.editDialogObj.title = '编辑';
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
    handleDelete() {
      if(this.multipleSelection.length != 0){
        if(this.multipleSelection.length === 1){
          this.$confirm('确定要删除此条记录?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.doDelete(this.multipleSelection[0].rowId)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }else{
          this.$message({
            type: 'warning',
            message: '不支持多条删除'
          });
        }
      }else{
        this.$message({
          type: 'warning',
          message: '请先选择一条记录'
        });
      }
    },
    doDelete(id){  //处理删除请求
      programManagerAPI.doDelete(id).then(res=>{
        if(res.result){
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.getTableData();
        }else{
          this.$message.error(res.errorMsg);
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
    current_change(currentPage){
      this.currentPage = currentPage;
      this.getTableData();
    },
  }
}
</script>
