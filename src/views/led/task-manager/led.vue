<template>
  <el-dialog
    ref="dialog"
    title="选择LED屏"
    :visible.sync="dialogObj.isShow"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        prop="ipAddress"
        label="ID">
      </el-table-column>
      <el-table-column prop="ledName" label="LED屏名称"></el-table-column>
      <el-table-column
        prop="onlinestate"
        label="在线状态"
        align="center">
        <template slot-scope="scope">
          <span>
            <i class="iconfont icon-zaixian" :style="{color: scope.row.onlinestate === '0'?'#ddd':'#67C23A'}"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="devicestatus"
        label="屏幕状态">
        <template slot-scope="scope">
          <div>
            {{ scope.row.devicestatus | devicestatusFilter }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="netWork"
        label="网络类型">
      </el-table-column>
      <el-table-column
        prop="screenWidth"
        label="宽">
      </el-table-column>
      <el-table-column
        prop="screenHeight"
        label="高">
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
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="edit()" :loading="isLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ledConfAPI from '@/api/led/ledConfAPI'
import taskManagerAPI from '@/api/led/taskManagerAPI'
export default {
  props: {
    dialogObj: Object
  },
  data() {
    return {
      isLoading: false,
      total: null,
      pageSize: 10,
      currentPage: 1,
      multipleSelection: [],
      tableData: []
    }
  },
  methods: {
    closeDialog() {
      this.$emit('handleClose');
      this.getTableData();
    },
    getTableData() {
      ledConfAPI.getList(this.currentPage, this.pageSize).then(res=>{
        this.total = res.total;
        this.tableData = res.records;
      })
    },
    current_change(currentPage){  //翻页
      this.currentPage = currentPage;
      this.getTableData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    edit() {
      if (this.multipleSelection.length != 0) {
        this.isLoading = !this.isLoading
        // taskManagerAPI.getTaskDetail(this.dialogObj.rowId).then(res => {
          this.multipleSelection.map(item => {
            taskManagerAPI.sendTask(item.rowId, this.dialogObj.rowId).then(res => {
              this.$router.push({
                path: '/led/history-record'
              })
            });
          });
        // });
      } else {
        this.$message({
          type: "warning",
          message: "请先选择LED屏"
        });
      }
    },
  },
  filters: {
    devicestatusFilter: function(value){
      if (value == 0) {
        return 'off'
      } else if (value == 1) {
        return 'on'
      }
    }
  },
  created() {
    this.getTableData();
  }
};
</script>

<style>
</style>
