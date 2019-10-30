<template>
<div>
  <el-dialog
    id="ledTaskEditDialog"
    ref="dialog"
    :title="dialogObj.title"
    width="70%"
    :visible.sync="dialogObj.isShow"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    @close="closeDialog"
  >
  <el-form :inline="true" ref="form" :model="form" :rules="rules" label-width="80px">
    <el-form-item label="任务名" prop="taskName">
      <el-input clearable v-model.trim="form.taskName" placeholder="请输入任务名"></el-input>
    </el-form-item>
    <el-row>
      <el-button
      size="mini"
      type="success"
      @click="handleAdd">添加节目</el-button>
      <el-button
      size="mini"
      type="warning"
      @click="handleDelete"
      >删除节目</el-button>
    </el-row>
    <el-table 
    class="programTable" 
    :stripe="true"
    ref="multipleTable" 
    :data="tableData" 
    tooltip-effect="dark" 
    style="width: 100%"
    @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="40">
      </el-table-column>
      <el-table-column prop="itemName" label="节目名"></el-table-column>
      <el-table-column prop="fileSize" label="大小"></el-table-column>
      <el-table-column label="优先级">
        <template slot-scope="scope">{{scope.$index + 1}}</template>
      </el-table-column>
      <el-table-column label="重复次数">
        <template slot-scope="scope">
          <div>
            <el-input v-model="scope.row.repeatTimes" placeholder="请输入内容"></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="时间安排" width="100" align="center">
        <template slot-scope="scope">
          <!-- <el-tooltip class="item" effect="dark" content="将节目下移一行" placement="top">
            <el-button
              type="primary"
              icon="el-icon-caret-bottom"
              circle
              @click="moveItem(scope.$index)"
            ></el-button>
          </el-tooltip> -->
          <el-tooltip class="item" effect="dark" content="计划任务" placement="top">
            <el-button type="warning" icon="el-icon-time" circle @click="handleArrange(scope.$index)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="closeDialog">取 消</el-button>
    <el-button type="primary" @click="edit(form)" :loading="isLoading">确 定</el-button>
  </div>
  </el-dialog>
  <programList @handleClose="handleClose('proDialogObj')" @edit="programEdit" :dialogObj="proDialogObj"></programList>
  <arrange @handleClose="handleClose('arrangeDialogObj')" @edit="arrangeEdit" :dialogObj="arrangeDialogObj"></arrange>
</div>
</template>

<script>
import Sortable from 'sortablejs'
import taskManagerAPI from "@/api/led/taskManagerAPI"
import programList from './programList.vue'
import arrange from './arrange.vue'

export default {
  props: {
    dialogObj: Object
  },
  data() {
    return {
      isLoading: false,
      multipleSelection: [],
      tableData: [],
      arrangeDialogObj: {
        isShow: false,
        title: '',
        index: '',
        data: []
      },
      proDialogObj: {
        isShow: false,
        title: '',
        rowId: ''
      },
      form: {
        rowId: '',
        taskName: "",
        ledTaskDetailList: []
      },
      rules: {
        taskName: [
          { required: true, message: '请输入任务名', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符' }
        ]
      }
    }
  },
  updated() {
    this.$nextTick(function(){
      this.rowDrop();
    });
  },
  methods: {
    rowDrop() { 
      const tbody = document.querySelector('.programTable tbody');
      const _this = this;
      this.sortObj = Sortable.create(tbody, { 
        onEnd({ newIndex, oldIndex }) { 
            // _this.tableData = JSON.parse(JSON.stringify(_this.tableData.length==0?_this._programList:_this.tableData))
            // const currRow = _this.tableData.splice(oldIndex, 1)[0];
            // _this.tableData.splice(newIndex, 0, currRow); 
        } 
      }) 
    },
    closeDialog() {
      this.$emit('handleClose');
      this.form.rowId = '';
      this.form.ledTaskDetailList = this.tableData = [];
      this.$refs['form'].resetFields();
    },
    handleClose(key) {
      this[key].isShow = false;
    },
    getInfo(id) {
      taskManagerAPI.getItem(id).then(res=>{
        this.form = res;
        res.ledTaskDetailList.map(item => {
          item.detailScheduleList.map(item => {
            if (item.weekFilter) {
              item.weekFilter = item.weekFilter.split(',');
            } else {
              item.weekFilter = [];
            }
          });
        });
        this.tableData = res.ledTaskDetailList;
      });
    },
    handleAdd() {
      this.proDialogObj.isShow = true;
    },
    handleDelete() {
      if(this.multipleSelection.length != 0){
        for (let i = 0; i < this.multipleSelection.length; i++) {
          for (let j =0; j < this.tableData.length; j++) {
            if (this.multipleSelection[i].rowId == this.tableData[j].rowId) {
              this.tableData.splice(j, 1);
            }
          }
        }
      }else{
        this.$message({
          type: 'warning',
          message: '请先选择一条记录'
        });
      }
    },
    moveItem(index) {
      //下移节目
      if (index === this.tableData.length - 1) {
        this.$message({
          type: "error",
          message: "到底啦！"
        });
        return;
      }
      this.tableData[index] = this.tableData.splice(
        index + 1,
        1,
        this.tableData[index]
      )[0];
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    edit(form) {
      this.form.ledTaskDetailList = [];
      this.tableData.map(item => {
        item.detailScheduleList.map(item => {
          item.weekFilter = item.weekFilter.join(',');
        });
        var obj = {};
        obj.detailScheduleList = item.detailScheduleList;
        obj.ledItemId = item.ledItemId; // 节目id
        obj.repeatTimes = item.repeatTimes;
        this.form.ledTaskDetailList.push(obj);
      });
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.isLoading = !this.isLoading
          taskManagerAPI.addOrEdit(form).then(res=>{
            if(res.result){
              this.$message({
                type: 'success',
                message: this.dialogObj.title == '新增' ? '新增成功' : '修改成功'
              });
              setTimeout(() => {
                this.closeDialog();
                this.$emit('init');
                this.isLoading = !this.isLoading;
              }, 1500);
            }else{
              this.$message.error('服务器错误');
              this.isLoading = !this.isLoading;
            }
          })
        }
      });
    },
    // =========================== 添加节目 ===========================
    programEdit(item) {
      this.tableData.push(JSON.parse(JSON.stringify(item)));
    },
    // =========================== 时间安排 ===========================
    handleArrange(index) {
      this.arrangeDialogObj.index = index;
      this.arrangeDialogObj.isShow = true;
      this.arrangeDialogObj.data = this.tableData[index].detailScheduleList;
    },
    arrangeEdit(val) {
      this.tableData[this.arrangeDialogObj.index].detailScheduleList = val;
    }
  },
  components:{
    programList,
    arrange
  },
  watch: {
    dialogObj: {
      handler(val, oldVal) {
        if (val.isShow) {
          if (val.rowId) {
            this.getInfo(val.rowId);
          }
        }
      },
      deep: true
    },
  },
};
</script>
<style lang="scss">
#ledTaskEditDialog {
  .el-form {
    input {
      width: 220px;
    }
  }
}
</style>
