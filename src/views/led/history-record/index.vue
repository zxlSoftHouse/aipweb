<template>
  <div class="app-container">
    <el-table 
    ref="multipleTable" 
    @selection-change="handleSelectionChange"
    :data="tableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column prop="ledTaskName" label="任务名"></el-table-column>
      <el-table-column prop="ledScreenIpAddress" label="屏幕ID"></el-table-column>
      <el-table-column prop="ledScreenName" label="屏幕名称"></el-table-column>
      <el-table-column prop="ipAddress" label="IP"></el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="scope">
          {{scope.row.createTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column prop="progress" label="状态">
        <template slot-scope="scope">
          <el-progress :percentage="scope.row.progress"></el-progress>
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
  </div>
</template>
<script>
import historyRecordAPI from "@/api/led/historyRecordAPI";
import { parseTime } from "@/utils/index";

export default {
  data() {
    return {
      total: 0,
      pageSize: 10,
      currentPage: 1,
      multipleSelection: [],
      tableData: [],
    }
  },
  mounted() {
    this.initDataByProjectId();
  },
  methods: {
    initDataByProjectId() {
      this.getTableData();
    },
    getTableData() {
      historyRecordAPI.getList(this.currentPage, this.pageSize).then(res => {
        this.total = res.total;
        this.tableData = res.records;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    current_change(currentPage) {
      this.currentPage = currentPage;
      this.getTableData();
    },
  },
  computed: {
    getWebsockCode() {
      console.log(this.$store.state.websock.returnCode);
      return this.$store.state.websock.returnCode;
    }
  },
  watch: {
    getWebsockCode(newer, older) {
      if (newer == 'led') {
        this.getTableData();
      }
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      return parseTime(date,'{y}-{m}-{d} {h}:{i}:{s}')
    }
  },
  components:{
  },
};
</script>
