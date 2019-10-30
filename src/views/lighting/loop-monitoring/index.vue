<template>
  <div>
    <el-row type="flex" align="middle" :gutter="22">
      <div style="margin-left:20px">回路</div>
      <el-col :xl="3" :lg="4">
        <el-select v-model="selectedLoop" multiple placeholder="请先选择一个集控器">
          <el-option
            v-for="item in loops"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :xl="8" :lg="12">
          <el-button @click="closedloop(1)">闭合回路</el-button>
          <el-button @click="closedloop(0)">断开回路</el-button>
          <el-button @click="getRealtimeData">读取</el-button>
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
        prop="controlerName"
        label="集控器名称">
      </el-table-column>
      <el-table-column
        prop="tenderName"
        label="集控器厂家"
        >
      </el-table-column>
      <el-table-column
        prop="modelName"
        label="集控器型号"
        >
      </el-table-column>
      <el-table-column
        prop="controlerAddress"
        label="集控器地址"
        >
      </el-table-column>
      <el-table-column
        prop="loopNum"
        label="回路数量"
        >
      </el-table-column>
      <el-table-column
        prop="onlinestate"
        label="在线状态"
        :formatter="formatOnLine"
        >
      </el-table-column>
<!--       <el-table-column
        prop="loopTime"
        label="轮询时间"
        >
      </el-table-column> -->
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
      selectedLoop:[],  //选中回路
      loops:[],  //回路下拉框
    } 
  },
  mounted(){
    this.initDataByProjectId();
  },
  methods: {
    initDataByProjectId(){
      this.getTableData();
    },
    formatOnLine: function (row, column) {
      return row.onlinestate === '0' ? '在线' : '离线';
    },
    getTableData(){  //获取表格数据
      api.getList(this.currentPage,this.pageSize).then(res=>{
        this.total = res.total;
        this.tableData = res.records;
      })
    },
    closedloop(val){  //闭合回路

    },
    getRealtimeData(){  //获取实时数据

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
