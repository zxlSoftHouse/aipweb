<template>
  <el-dialog
    ref="dialog"
    title="节目清单"
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
    >
      <el-table-column prop="itemName" label="节目名称"></el-table-column>
      <el-table-column prop="fileSize" label="大小"></el-table-column>
      <el-table-column prop="itemWidth" label="宽"></el-table-column>
      <el-table-column prop="itemHeight" label="高"></el-table-column>
      <el-table-column label="添加" width="100">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope)">
            <i class="iconfont icon-xinzeng"></i>
          </el-button>
        </template>
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
  </el-dialog>
</template>

<script>
import programManagerAPI from "@/api/led/programManagerAPI";
export default {
  props: {
    dialogObj: Object
  },
  data() {
    return {
      total: null,
      pageSize: 10,
      currentPage: null,
      tableData: []
    }
  },
  methods: {
    closeDialog() {
      this.$emit('handleClose');
    },
    getTableData() {
      programManagerAPI.getList(this.currentPage, this.pageSize).then(res => {
        this.tableData = res.records;
        this.total = res.total;
      });
    },
    current_change(currentPage){  //翻页
      this.currentPage = currentPage;
      this.getTableData();
    },
    edit(scope) {
      var item = scope.row;
      item.detailScheduleList = [];
      item.repeatTimes = "1";
      item.ledItemId = item.rowId;
      this.$emit('edit', item);
      this.closeDialog();
    },
  },
  created() {
    this.getTableData();
  }
};
</script>

<style>
</style>
