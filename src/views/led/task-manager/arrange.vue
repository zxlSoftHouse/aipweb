<template>
  <el-dialog
    width="60%"
    class="arrangeTaskDialog"
    ref="dialog"
    title="时间安排"
    :visible.sync="dialogObj.isShow"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <el-row :gutter="20">
      <el-col :span="10">
        <el-card>
          <div slot="header">
            <label>
              <span>增加时间安排</span>
            </label>
          </div>
          <div class="body">
            <el-form style="height: 298px;" ref="form" :model="form" label-width="80px">
              <el-form-item label="日期范围" prop="dateType">
                <el-radio v-model="form.dateType" label="All">永久</el-radio>
                <el-radio v-model="form.dateType" label="Range">自定义</el-radio>
              </el-form-item>
              <el-row v-if="form.dateType === 'Range'" label="" prop="date">
                <el-date-picker
                  v-model="date"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="selectDate"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-row>
              <el-form-item label="时间范围" prop="name">
                <el-radio v-model="form.timeType" label="All">永久</el-radio>
                <el-radio v-model="form.timeType" label="Range">自定义</el-radio>
              </el-form-item>
              <el-row v-if="form.timeType === 'Range'">
                <el-time-picker
                  is-range
                  v-model="time"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  format="HH:mm"
                  value-format="HH:mm"
                  @change="selectTime"
                >
                </el-time-picker>
              </el-row>
              <el-form-item label="指定星期" prop="name">
                <el-radio v-model="form.filterType" label="None" @change="filterTypeChange">永久</el-radio>
                <el-radio v-model="form.filterType" label="Week" @change="filterTypeChange">自定义</el-radio>
              </el-form-item>
              <el-row v-if="form.filterType === 'Week'">
                <el-checkbox-group v-model="form.weekFilter">
                  <div>
                    <el-checkbox label="1">星期一</el-checkbox>
                    <el-checkbox label="2">星期二</el-checkbox>
                    <el-checkbox label="3">星期三</el-checkbox>
                    <el-checkbox label="4">星期四</el-checkbox>
                  </div>
                  <div>
                    <el-checkbox label="5">星期五</el-checkbox>
                    <el-checkbox label="6">星期六</el-checkbox>
                    <el-checkbox label="7">星期天</el-checkbox>
                  </div>
                </el-checkbox-group>
              </el-row>
            </el-form>
            <el-row style="text-align: center">
              <el-button type="primary" size="mini" @click="handleAdd()">
                <i class="iconfont icon-xinzeng"></i>
              </el-button>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card>
          <div slot="header">
            <label>
              <span>时间安排列表</span>
            </label>
          </div>
          <div class="body">
          <el-table height="280" 
          ref="multipleTable" 
          :data="tableData" 
          tooltip-effect="dark" 
          style="width: 100%">
            <el-table-column width="200" :formatter="dateRangeFmt" label="日期范围"></el-table-column>
            <el-table-column width="200" :formatter="timeRangeFmt" label="时间范围"></el-table-column>
            <el-table-column width="200" :formatter="weekFilterFmt" label="指定星期">
              <template></template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="55">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="handleDelete(scope.$index)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="edit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogObj: Object
  },
  data() {
    return {
      tableData: [],
      form: {
        dateType: "All",
        startDate: "",
        endDate: "",
        timeType: "All",
        startTime: "",
        endTime: "",
        filterType: "None",
        weekFilter: [],
      },
      date: [],
      time: null
    };
  },
  methods: {
    closeDialog() {
      this.$emit("handleClose");
      this.resetForm();
    },
    edit() {
      this.$emit("edit", this.tableData);
      this.tableData = [];
      this.closeDialog();
    },
    handleAdd() {
      if (this.date.length == 0 && this.form.dateType != 'All') {
        this.$message.warning('自定义日期范围不能为空！');
        return;
      }
      if (!this.time && this.form.timeType != 'All') {
        this.$message.warning('自定义时间范围不能为空！');
        return;
      }
      if (!this.form.weekFilter == 0 && this.form.filterType != 'None') {
        this.$message.warning('自定义指定星期至少选择一个！');
        return;
      }
      this.tableData.push(this.form);
      this.resetForm();
    },
    handleDelete(index) {
      //删除一条时间计划
      this.tableData.splice(index, 1);
    },
    resetForm() {
      this.form = {
        dateType: "All",
        startDate: "",
        endDate: "",
        timeType: "All",
        startTime: "",
        endTime: "",
        filterType: "None",
        weekFilter: []
      };
      this.date = [];
      this.time = null;
    },
    dateRangeFmt(val) {
      if (val.dateType === "All") return "永久";
      return val.startDate + "~" + val.endDate;
    },
    timeRangeFmt(val) {
      if (val.timeType === "All") return "永久";
      return val.startTime + "~" + val.endTime;
    },
    weekFilterFmt(val) {
      if (val.filterType === "None") return "无指定星期";
      var str = "";
      val.weekFilter.map(item => {
        var week = [
          "周一,",
          "周二,",
          "周三,",
          "周四,",
          "周五,",
          "周六,",
          "周日,"
        ][Number.parseInt(item) - 1];
        str = str.concat(week);
      });
      return str.substr(0, str.length - 1);
    },
    selectDate() {
      this.form.startDate = this.date[0];
      this.form.endDate = this.date[1];
    },
    selectTime() {
      this.form.startTime = this.time[0];
      this.form.endTime = this.time[1];
    },
    filterTypeChange() {
      if (this.form.filterType == 'None') {
        this.form.weekFilter = [];
      }
    }
  },
  watch: {
    dialogObj: {
      handler(val, oldVal) {
        if (val.isShow) {
          this.tableData = [].concat(val.data);
        }
      },
      deep: true
    },
    form: {
      handler(val, oldVal) {
        if (val.dateType == 'All') {
          this.date = [];
        }
        if (val.timeType == 'All') {
          this.time = null;
        }
      },
      deep: true
    },
  }
};
</script>

<style lang="scss">
  .arrangeTaskDialog {
    .el-card {
      height: 100%;
      .el-card__header {
        border-bottom: 0;
        label {
          padding: 10px 50px 10px 0;
          border-bottom: 2px solid #60b8f6;
          font-size: 16px;
          i {
            font-size: 20px;
            color: rgb(87, 87, 87);
          }
        }
      }
      .body {
        height: 310px;
        .el-form {
          .el-form-item {
            margin-bottom: 5px;
          }
          .el-row {
            margin-bottom: 20px;
          }
        }
        .el-table__body-wrapper {
          &::-webkit-scrollbar {
            width: 6px;
            height: 6px;
            background-color: #fff;
          }

          &::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
            border-radius: 0;
            background-color: lightgray;
          }

          &::-webkit-scrollbar-thumb {
            border-radius: 0;
            -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
            background-color: rgb(121, 121, 121);
          }
          &::-webkit-scrollbar-button {
            background-color: #fff;
            border: 0;
          }
        }
      }
    }
  }
</style>
