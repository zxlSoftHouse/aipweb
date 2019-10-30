<template>
<div class="app-container">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%">
      <!-- <el-table-column
        prop="operation"
        label="设备编号">
      </el-table-column> -->
      <el-table-column
        prop="deviceName"
        label="设备名称"
        >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="报警时间"
        :formatter="dateFormatter"
        >
      </el-table-column>
    </el-table>
    <div class="pagination-wrapper">
    <el-pagination @current-change="pagePost" @size-change="pageSizePost"
        :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="recordCount">
    </el-pagination>
    </div>
</div>
</template>

<script>
import api from '@/api/alarm/alarm'
import { formatTime,parseTime } from '@/utils/index'

export default {
  data() {
    return {
      total:0,
      pageSize:10,
      currentPage:1,
      tableData: [],
      searchInfo:"",
      recordCount: 0
    } 
  },
  mounted(){
    this.getTableData();
  },
  methods: {

    dateFormatter(val){  //上报时间格式化
      if(val.createTime === null){
        return "-"
      }
      return parseTime(val.createTime)
    },
    getTableData(){  //获取表格信息
      api.getAlarmLogList({ pageNum : this.currentPage, pageSize : this.pageSize}).then(res=>{
        this.recordCount = res.total;
        this.tableData = res.records;
      })
    },
    queryByProjectName(){  //按项目名称查询
      this.getTableData();
    },
    current_change(currentPage){  //翻页
      this.currentPage = currentPage;
      this.getTableData();
    },
    

    pagePost(val) {
      this.currentPage = val;
      this.getTableData();
    },

    //分页大小
    pageSizePost(val) {
      this.pageSize = val;
      this.getTableData();
    },

  }
}
</script>

<style lang="scss" scoped>

</style>

