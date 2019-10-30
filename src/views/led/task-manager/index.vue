<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-button type="success" @click="handleAdd">
          <i class="iconfont icon-xinzeng"></i>
          新增
        </el-button>
        <el-button type="primary" @click="handleEdit">
          <i class="iconfont icon-bianji1"></i>
          编辑
        </el-button>
        <el-button type="warning" @click="handleDelete">
          <i class="iconfont icon-shanchu"></i>
          删除
        </el-button>
      </el-col>
    </el-row>
    <el-table 
    ref="multipleTable" 
    @selection-change="handleSelectionChange"
    :data="tableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column prop="taskName" label="任务名称"></el-table-column>
      <el-table-column prop="createTime" width="200" label="创建时间" :formatter="timeFmt"></el-table-column>
      <el-table-column label="发送任务" width="100" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="发送任务" placement="top">
            <el-button
              type="primary"
              icon="el-icon-upload2"
              circle
              @click="handleLED(scope.row.rowId)"
            ></el-button>
          </el-tooltip>
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
    <edit @handleClose="handleClose('dialogObj')" @init="getTableData" :dialogObj="dialogObj"></edit>
    <led @handleClose="handleClose('ledDialogObj')" @init="getTableData" :dialogObj="ledDialogObj"></led>
  </div>
</template>
<script>
import taskManagerAPI from "@/api/led/taskManagerAPI";
import { parseTime } from "@/utils/index";
import edit from './edit.vue'
import led from './led.vue'

export default {
  data() {
    return {
      total: 0,
      pageSize: 10,
      currentPage: 1,
      multipleSelection: [],
      tableData: [],
      dialogObj: {
        isShow: false,
        title: '',
        rowId: ''
      },
      ledDialogObj: {
        isShow: false,
        rowId: ''
      }
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
      taskManagerAPI.getList(this.currentPage, this.pageSize).then(res => {
        this.total = res.total;
        this.tableData = res.records;
      });
    },
    timeFmt(val) {
      return parseTime(val.createTime, "{y}-{m}-{d}");
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    current_change(currentPage) {
      this.currentPage = currentPage;
      this.getTableData();
    },
    handleClose(key) {
      this[key].isShow = false;
      this[key].rowId = '';
    },
    handleAdd() {
      this.dialogObj.isShow = true;
      this.dialogObj.title = '新增';
    },
    handleEdit() {
      if (this.multipleSelection.length != 0) {
        if(this.multipleSelection.length == 1){
          this.dialogObj.rowId = this.multipleSelection[0].rowId;
          this.dialogObj.isShow = true;
          this.dialogObj.title = '编辑';
        }else{
          this.$message({
            type: 'warning',
            message: '不支持多条编辑'
          });
        }
      } else{
        this.$message({
          type: 'warning',
          message: '请先选择一条记录'
        });
      }
    },
    handleDelete() {
      if(this.multipleSelection.length != 0){
        if(this.multipleSelection.length === 1){
          this.$confirm('确定要删除此条记录?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.doDelete(this.multipleSelection[0].rowId)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }else{
          this.$message({
            type: 'warning',
            message: '不支持多条删除'
          });
        }
      }else{
        this.$message({
          type: 'warning',
          message: '请先选择一条记录'
        });
      }
    },
    doDelete(id) {
      taskManagerAPI.doDelete(id).then(res=>{
        if(res.result){
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.getTableData();
        }else{
          this.$message.error(res.errorMsg);
        }
      })
    },
    handleLED(id) {
      this.ledDialogObj.isShow = true;
      this.ledDialogObj.rowId = id;
    },
  },
  components:{
    edit,
    led
  },
};
</script>
