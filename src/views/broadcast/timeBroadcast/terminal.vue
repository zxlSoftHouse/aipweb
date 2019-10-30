<template>
   <el-dialog id="terminalDialog" ref="dialog" title="选择操作音频" 
    :visible.sync="terminalDialog.isShow" 
    :modal-append-to-body='false' 
    :close-on-click-modal='false'
    :append-to-body="true" 
    @close="terminalCloseDialog">
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
      <el-button @click="terminalCloseDialog">取 消</el-button>
      <el-button type="primary" :loading="isLoading" @click="terminalBtn">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import request from '@/utils/request'
import Cookies from 'js-cookie';
import equipConfigAPI from '@/api/broadcast/equipConfig'
// import '@/assets/js/plugins/hkvVideo/jquery-1.7.1.min.js'

export default {
  props: {
    terminalDialog: Object,
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
      let _this = this
      let data = {
        pageIndex: _this.pageIndex,
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
    terminalCloseDialog() {
      this.$refs.multipleTable.clearSelection();
      this.$emit('terminalClose');
    },
    handleSelectionChange(val) {  //获取选中项
      this.multipleSelection = val;
    },
    terminalBtn(){
      this.$emit('terminalDialogClose',this.multipleSelection);
      this.$emit('terminalClose');
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