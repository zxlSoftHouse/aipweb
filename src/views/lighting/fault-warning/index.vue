<template>
  <div>
    <el-row type="flex" align="middle" :gutter="22">
      <div>&nbsp;&nbsp;&nbsp;&nbsp;路段</div>
      <el-col :span="2">
          <el-select v-model="searchInfo.roadId" @change="getTableData">
              <el-option label="全部" value=""></el-option>
              <el-option
                  v-for="item in options.road"
                  :key="item.rowId"
                  :label="item.roadName"
                  :value="item.rowId"
              ></el-option>
          </el-select>
      </el-col>
        <div>选择日期&nbsp;&nbsp;</div>
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        &nbsp;&nbsp;
        <el-button @click="handleWarning">处理报警</el-button>
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
        prop="deviceName"
        label="设备名称">
      </el-table-column>
      <el-table-column
        prop="deviceType"
        label="设备类型"
        :formatter="deviceTypeFormat"
        >
      </el-table-column>
      <el-table-column
        prop="roadName"
        label="路段"
        >
      </el-table-column>
      <!-- <el-table-column
        prop="devicePowerSrc"
        label="设备能源类型"
        :formatter="devicePowerSrcFormat"
        >
      </el-table-column>
      <el-table-column
        prop="alarmType"
        label="告警类型"
        >
      </el-table-column> -->
      <el-table-column
        prop="alarmTime"
        label="告警时间"
        :formatter="alarmTimeFormat"
        >
      </el-table-column>
      <el-table-column
        prop="alarmContent"
        label="告警内容"
        >
      </el-table-column>
      <el-table-column
        prop="resolvedState"
        label="解决状态"
        :formatter="resolvedStateFormat"
        >
      </el-table-column>
      <el-table-column
        prop="resolvedTime"
        label="解决时间"
        :formatter="resolvedTimeFormat"
        >
      </el-table-column>
      <el-table-column
        prop="resolvedUser"
        label="解决人"
        >
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
import api from '@/api/lighting/faultWarningAPI'
import { formatTime , parseTime } from '@/utils/index'
import { mapState } from 'vuex';
export default {
  data() {
    return {
      total:0,
      pageSize:10,
      currentPage:1,
      tableData: [],  //表格数据
      multipleSelection: [],  //选中表格项
      date:[],  //日期
      searchInfo:{  //筛选条件
        projectId:'',
        roadId:''
      },
      options:{  //下拉框数据
        project:[],
        road:[]
    },
    } 
  },
  mounted(){
    this.initDataByProjectId();
  },  
  computed: {
    ...mapState({
      deviceTypeOptions: state=>state.baseData.deviceType,
    }),
  },
  methods: {
    initDataByProjectId(){
      this.searchInfo.roadId = "";
      this.getTableData();
      this.queryRoadOptions();
    },
    alarmTimeFormat(val){  //告警时间格式化
        if(val.alarmTime === null){
            return "-"
        }
        return parseTime(val.alarmTime,'{y}-{m}-{d} {h}:{i}')
    },
    resolvedTimeFormat(val){  //解决时间格式化
        if(val.resolvedTime === null){
            return "-"
        }
        return parseTime(val.resolvedTime,'{y}-{m}-{d} {h}:{i}')
    },
    deviceTypeFormat(val){  //设备类型格式化
        if(val.deviceType === null){
            return "-"
        }
        let item = this.deviceTypeOptions.find(res=>res.value==val.deviceType);
        if(item){return item.label}
        else{return "未知"}
    },
    devicePowerSrcFormat(val){  //设备能源类型格式化
        if(val.devicePowerSrc === null){
            return "-"
        }
        switch(val.devicePowerSrc){
          default : return '未知'
        }
        this.deviceTypeOptions.map(res=>{
          if(val.devicePowerSrc == res.value) return res.label;
        })
    },
    resolvedStateFormat(val){  //设备能源类型格式化
        if(val.resolvedState === null){
            return "-"
        }
        switch(val.resolvedState){
          case '0' : return '未解决';
          case '1' : return '解决';
          default : return '-'
        }
    },
    getTableData(){  //获取表格数据
      var data = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        projectId:this.searchInfo.projectId,
        roadId: this.searchInfo.roadId
      }
      api.getList(data).then(res=>{
        this.total = res.total;
        this.tableData = res.records;
      })
    },
    queryRoadOptions(){  //获取路段下拉框数据
      api.queryRoadOptions(this.searchInfo.projectId).then(res=>{
        this.options.road = res;
      })
    },
    handleWarning(){  //处理告警
      api.alarmResolved(this.multipleSelection.map(res=>res.rowId)).then(res=>{
        if(res){          
          this.$message({
            type   : 'success',
            message: '处理成功'
          });
          this.getTableData();
        }else{          
          this.$message({
            type   : 'warning',
            message: '处理失败！'
          });
        }
      })
    },
    current_change(currentPage){  //翻页
      this.currentPage = currentPage;
      this.getTableData();
    },
    handleSelectionChange(val) {  //处理选中值
      this.multipleSelection = val;
  /*     if (this.multipleSelection.length > 1) {
          this.$refs.multipleTable.toggleRowSelection(this.multipleSelection[0]);
      } */
    },
  }
}
</script>
