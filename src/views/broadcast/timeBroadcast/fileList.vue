<template>
   <el-dialog id="fileDialog" ref="dialog" title="选择操作音频" 
    :visible.sync="fileDialog.isHidden" 
    :modal-append-to-body='false' 
    :close-on-click-modal='false'
    :append-to-body="true" 
    @close="fileCloseDialog">
    <el-table
      ref               = "multipleTable"
      :data             = "tableData"
      tooltip-effect    = "dark"
      style             = "width: 100%"
      @selection-change = "handleSelectionChange">
      <el-table-column type  = "selection"></el-table-column>
      <el-table-column prop  = "id" label = "文件编号"></el-table-column>
      <el-table-column prop  = "name" label = "文件名称"></el-table-column>
    </el-table>
    <div style="text-align: center;margin-top: 30px;">
        <el-pagination
        background
         layout="total, prev, pager, next, jumper"
        :total          = "total"
        @current-change = "current_change">
        </el-pagination>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="fileCloseDialog">取 消</el-button>
      <el-button type="primary" :loading="isLoading" @click="fileBtn">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import request from '@/utils/request'
import Cookies from 'js-cookie';
import resourceConfigAPI from '@/api/broadcast/resourceConfig'
// import '@/assets/js/plugins/hkvVideo/jquery-1.7.1.min.js'

export default {
  props: {
    fileDialog: Object,
    // fileInfo:Array
  },
  data() {
    return {
      total            : 0,  //数据总条数
      pageCount         : 10,  //每页容量
      pageIndex      : 0,  //当前页
      tableData        : [],  //表格数据
      showDialog: false,
      isLoading: false,
      multipleSelection: [],  //表格多选框选中项
    }
  },
  mounted(){
    this.getTableData();
  },
  methods:{
    // 获取任务列表
    getTableData(){
      let data = {
        pageIndex: this.pageIndex,
        pageCount: this.pageCount,
        filter: "*"
      }
      resourceConfigAPI.getList(data).then(res=>{
        this.total = parseInt(res.total);
        this.tableData = res.rows;
      })
    },
    fileCloseDialog() {
      this.$refs.multipleTable.clearSelection();
      this.$emit('fileClose');
    },
    handleSelectionChange(val) {  //获取选中项
      this.multipleSelection = val;
    },
    fileBtn(){
      this.$emit('fileDialogClose',this.multipleSelection);
      this.$emit('fileClose');
    },
    current_change(currentPage){
      this.currentPage = currentPage;
      this.getTableData();
    },
  }
}
</script>
<style lang="scss">
  .dialog-common-audio {
    .el-dialog {
      width: 32%;
      background: rgba(0,0,0,0.7);
      -webkit-box-shadow: 0 5px 15px rgba(0,0,0,.5);
      box-shadow: 0 5px 15px rgba(0,0,0,.5);
      border: 1px solid rgba(0,0,0,.2);
      border-radius: 6px;
      audio {
        width: 100%;
        outline: none;
      }
      .el-dialog__header {
        padding: 12px 20px 10px;
      }
      .el-dialog__body {
        padding: 15px 20px;
      }
      .el-dialog__title {
        color: #fff;
        font-weight: 500;
        font-size: 20px;
      }
      .el-dialog__headerbtn .el-dialog__close {
        font-weight: 1000;
      }
    }
  }
  .icon-listen {
    cursor: pointer;
  }
</style>