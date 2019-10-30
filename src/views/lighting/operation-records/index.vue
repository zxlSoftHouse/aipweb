<template>
  <div>
    <el-row type="flex" align="middle">
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
    </el-table>
    <div style="text-align: center;margin-top: 30px;">
      <el-pagination
        background
        layout          = "prev, pager, next"
        :total          = "total"
        @current-change = "current_change">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import api from '@/api/lighting/loopMonitoringAPI'

export default {
  data() {
    return {
      total:0,
      pageSize:10,
      currentPage:1,
      tableData: [],  //表格数据
      multipleSelection: [],  //选中表格项
    } 
  },
  mounted(){
    this.initDataByProjectId();
  },
  methods: {
    initDataByProjectId(){
      this.getTableData();
    },
    getTableData(){  //获取表格数据

    },
    current_change(currentPage){  //翻页
      this.currentPage = currentPage;
      this.getTableData();
    },
    handleSelectionChange(val) {  //处理选中值
      // this.multipleSelection = val;
      if (this.multipleSelection.length > 1) {
          this.$refs.multipleTable.toggleRowSelection(this.multipleSelection[0]);
      }
    },
  }
}
</script>
