<template>
  <div class="sensorHistory">
    <div class="rt search-box">
      <el-date-picker
        v-model="dateTime"
        type="datetimerange"
        value-format="yyyy-MM-dd hh:mm:ss"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        align="right">
      </el-date-picker>
      <el-button type="primary" @click="getTableData">搜索</el-button>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      >
      <el-table-column
        prop="humidity"
        label="湿度">
      </el-table-column>
      <el-table-column
        prop="pressure"
        label="气压">
      </el-table-column>
      <el-table-column
        prop="temperature"
        label="温度">
      </el-table-column>
      <el-table-column
        prop="windSpeed"
        label="风速">
      </el-table-column>
      <el-table-column
        prop="windDirectionDes"
        label="风向">
      </el-table-column>
      <el-table-column
        prop="noise"
        label="噪声">
      </el-table-column>
      <el-table-column
        prop="pmValue1"
        label="PM2.5">
      </el-table-column>
      <el-table-column
        prop="pmValue2"
        label="PM10">
      </el-table-column>
      <el-table-column width="155" property="createTime" label="时间" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.createTime | formatDate }}
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
import sensorRunAPI from "@/api/sensor/sensorRun";
import { parseTime } from '@/utils/index'
export default {
  data() {
    return {
      total: null,
      pageSize: 4,
      currentPage: null,
      tableData: [],
      dateTime: '',
      startTime: '',
      endTime: ''
    }
  },
  methods: {
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
    current_change(currentPage){  //翻页
      this.currentPage = currentPage;
      this.getTableInfo();
    },
    getTableInfo() {
      this.startTime = this.dateTime[0];
      this.endTime = this.dateTime[1];
      sensorRunAPI.getList(this.currentPage, this.pageSize, this.startTime, this.endTime).then(res => {
        this.tableData = res.records;
        this.total = res.total;
      });
    },
    getTableData() {
      this.getCurrentPage();
      this.getTableInfo();
    },
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      return parseTime(date,'{y}-{m}-{d} {h}:{i}:{s}')
    }
  },
  created() {
    this.getTableData();
  },
  watch: {
  }
}
</script>

<style lang="scss">
  .dark {
    .el-table th, .el-table tr,
    .el-table, .el-table__expanded-cell {
      background: transparent;
      color: #fff;
    }
  }
  .sensorHistory {
    .search-box {
      margin-bottom: 20px;
    }
  }
</style>