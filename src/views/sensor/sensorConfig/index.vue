<template>
  <div class="app-container">
    <el-row>
      <el-col :span="16">
        <el-button 
          type="success" v-if="hasPerms('sensorConfig-xz001')"
          @click="handleAdd">
          <i class="iconfont icon-xinzeng"></i>
          新增
        </el-button>
        <el-button type="primary" v-if="hasPerms('sensorConfig-bj001')"
          @click="handleEdit">
          <i class="iconfont icon-bianji1"></i>
          编辑
        </el-button>
        <el-button
          type="warning" v-if="hasPerms('sensorConfig-sc001')"
          @click="handleDelete">
          <i class="iconfont icon-shanchu"></i>
          删除
        </el-button>
      </el-col>
      <el-col :span="6">
        <el-input type="text" placeholder="请输入传感器名称" v-model="searchInfo"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="initDataByProjectId">搜索</el-button>
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
        prop="sensorName"
        label="传感器名称">
      </el-table-column>
      <el-table-column
        prop="sensorModelName"
        label="传感器型号">
      </el-table-column>
      <el-table-column
        prop="registration"
        label="传感器注册包">
      </el-table-column>
      <el-table-column
        prop="modelCode"
        label="传感器协议">
      </el-table-column>
      <el-table-column
        prop="onlinestate"
        label="在线状态"
        align="center">
        <template slot-scope="scope">
          <span>
            <i class="iconfont icon-zaixian" :style="{color: scope.row.onlinestate === '1'?'#67C23A':'#ddd'}"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="lampPostCode"
        label="所属灯杆">
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
    <edit @handleClose="handleClose" @init="initDataByProjectId" :dialogObj="dialogObj"></edit>
  </div>
</template>

<script>
import sensorConfigAPI from '@/api/sensor/sensorConfig'
import edit from './edit.vue'
import { hasPermission } from '@/permission.js'

export default {
  data() {
    return {
      total: null,
      pageSize: 10,
      currentPage: null,
      tableData: [],
      multipleSelection: [],
      searchInfo: '',
      dialogObj: {
        isShow: false,
        title: '',
        rowId: ''
      }
    } 
  },
  methods: {
    hasPerms(perms) {
        // 根据权限标识和外部指示状态进行权限判断
        return hasPermission(perms) & !this.disabled
    },
    getTableData(){
      sensorConfigAPI.getList(this.currentPage, this.pageSize, this.searchInfo, this.projectId).then(res=>{
        this.tableData = res.records;
        this.total = res.total;
      })
    },
    doDelete(ids){ 
      sensorConfigAPI.doDelete(ids).then(res=>{
        if(res){
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.getTableData();
        }else{
          this.$message.error('服务器错误');
        }
      })
    },
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
    handleClose() {
      this.dialogObj.isShow = false;
      this.dialogObj.rowId = '';
    },
    handleAdd(){ 
      this.dialogObj.isShow = true;
      this.dialogObj.title = '新增';
    },
    handleEdit(){ 
      if (this.multipleSelection.length != 0) {
        if(this.multipleSelection.length === 1){
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
    handleDelete(){
      if(this.multipleSelection.length != 0){
        this.$confirm('确定要删除此条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var idList=[];
          this.multipleSelection.map(item=>{
            idList.push(item.rowId);
          })
          this.doDelete(idList)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }else{
        this.$message({
          type: 'warning',
          message: '请先选择一条记录'
        });
      }
    },
    handleSelectionChange(val) {  //处理选中项
      this.multipleSelection = val;
    },
    current_change(currentPage){  //翻页
      this.currentPage = currentPage;
      this.getTableData();
    },
    initDataByProjectId() {
      this.getCurrentPage();
      this.getTableData();
    }
  },
  created() {
    this.initDataByProjectId()
  },
  components:{
    edit
  },
}
</script>