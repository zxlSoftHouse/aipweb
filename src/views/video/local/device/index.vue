<template>
  <el-row class="app-container videoCloudDevice">
    <el-col>
      <el-row>
        <el-col :span="16">
          <el-button
            type="success"
            @click="handleAdd">新增</el-button>
          <el-button
            @click="handleEdit">编辑</el-button>
          <el-button
            type="danger"
            @click="handleDelete">删除</el-button>
        </el-col>
        <el-col :span="6">
          <el-input type="text" placeholder="请输入设备名称" v-model="searchInfo"></el-input>
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
          prop="cameraName"
          label="设备名称">
        </el-table-column>
        <el-table-column
          prop="ip"
          label="IP地址">
        </el-table-column>
        <el-table-column
          prop="port"
          label="端口号">
        </el-table-column>
        <el-table-column
          prop="cameraNo"
          label="设备编号"
          >
        </el-table-column>
        <!-- <el-table-column
          prop="cameraModel"
          label="设备型号">
        </el-table-column> -->
        <el-table-column
          prop="cameraType"
          label="摄像头类型">
          <template slot-scope="scope">
            <div>
              {{ scope.row.cameraType | cameraType }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="cameraType"
          label="监控类型">
          <template slot-scope="scope">
            <div>
              {{ scope.row.nvr | isNVR }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="installTime"
          label="安装时间">
          <template slot-scope="scope">
            <div>
              {{ scope.row.installTime | date }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="statusFlag"
          label="设备状态">
          <template slot-scope="scope">
            <div>
              {{ scope.row.statusFlag | cameraStatusFlag }}
            </div>
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
      <edit @handleClose="handleClose" @init="initDataByProjectId" :dialogObj="dialogObj" :projectId="projectId"></edit>
    </el-col>
  </el-row>
</template>

<script>
import videoConfigAPI from '@/api/video/videoConfig'
import edit from './edit.vue'

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
    getTableData(){
      videoConfigAPI.getList(this.currentPage, this.pageSize, this.searchInfo, '0', this.projectId).then(res=>{
        this.tableData = res.data.data.records;
        this.total = res.data.data.total;
      })
    },
    doDelete(ids){ 
      videoConfigAPI.doDelete(ids).then(res=>{
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
        }).then(()=>{
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
      this.getCurrentPage()
      this.getTableData();
    },
  },
  mounted() {
    if (this.projectId) {
      this.initDataByProjectId();
    }
  },
  components:{
    edit,
  },
  computed: {
    projectId() {
      return this.$store.state.project.projectId;
    }
  },
  watch: {
    projectId(val, oldVal) {
      if (val) {
        this.initDataByProjectId();
      }
    }
  },
}
</script>

<style lang="scss">
  .icon-monitor-play {
    font-size: 10px;
  }
</style>