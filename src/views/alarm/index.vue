<template>
  <div style="background: #fff;">
    <el-row>
      <el-col :span="16">
        <el-button type="success" @click="handleAdd">新增</el-button>
        <el-button @click="handleEdit">编辑</el-button>
        <el-button type="danger" @click="handleDelete">删除</el-button>
      </el-col>
      <!-- <el-col :span="6">
        <el-input type="text" placeholder="搜索" v-model="searchInfo"></el-input>
      </el-col> -->
      <!-- <el-col :span="2">
        <el-button type="primary" @click="init">搜索</el-button>
      </el-col> -->
    </el-row>
    <el-row>
      <el-col>
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
            prop="deviceNo"
            label="设备编号">
          </el-table-column>
          <el-table-column
            prop="lampPostCode"
            label="归属灯杆">
          </el-table-column>
         <!--  <el-table-column
            prop="statusFlag"
            label="设备状态"
            >
            <template slot-scope="scope">
              <div>
                {{ scope.row.statusFlag===2 || !scope.row.statusFlag ?'离线':'在线' }}
              </div>
            </template>
          </el-table-column> -->
          <el-table-column
            prop="updateTime"
            label="更新时间">
            <template slot-scope="scope">
              <div>
                {{  modelDateFormat(scope.row.updateTime) }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <div style="text-align: center;margin-top: 30px;">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
        :page-size="pageCount"
        @current-change="current_change"  
        @size-change="handleSizeChange"
        :current-page="pageIndex"
        >
      </el-pagination>
    </div>
		<div class="ui-mask" v-if="dialogObj.isShow" id="mask" onselectstart="return false"></div>
    <edit ref="editAlarm" @init="init" @handleClose="handleClose" :dialogObj="dialogObj" :singInfo="multipleSelection"></edit>
  </div>
</template>
<style>
	.ui-mask{ 
		width: 100%;height:100%;background: #000;
		position: absolute;top: 0px;height: 0px;z-index: 2000;
		opacity:0.4; filter: Alpha(opacity=40);
	}
</style>

<script>
import api from '@/api/alarm/alarm'
import edit from './edit.vue'
import { parseTime } from '@/utils/index'

export default {
  data() {
    return {
      total: 0,
      pageCount: 10,
      pageIndex: 1,
      tableData: [],
      multipleSelection: [],
      searchInfo: '',
      dialogObj: {
        isShow: false,
        title: '',
        tid: '',
      },
      volumeDialog:{
        isHidden:false
      },
      controlVideoInfo: {},
    } 
  },//利用计算属性
  computed: {
    alarmInfo() {
      return this.$store.state.alarm.alarmInfo;
    }
  },
  mounted(){
    this.initDataByProjectId();
  },
  methods: {    
    initDataByProjectId(){
      this.getTableData();
      this.$refs.editAlarm.getDeviceType();
    },
    init() {
      this.getCurrentPage()
      this.getTableData();

    },
    getTableData(){
      let _this = this
      let data = {
        pageNum: _this.pageIndex-1,
        pageSize: _this.pageCount,
      }
      api.getList(data).then(res=>{
        this.tableData = res.data.data.records;
        this.total = parseInt(res.data.data.total);
      })
    },
    getCurrentPage() {
      let data = this.$route.query;
      if (data) {
        if (data.page) {
          this.pageIndex = parseInt(data.page)
        } else {
          this.pageIndex = 1;
        }
      }
    },
    handleClose() {
      this.dialogObj.isShow = false;
      this.dialogObj.tid = '';
    },
    handleAdd(){ 
      this.dialogObj.isShow = true;
      this.dialogObj.title = '新增';
    },
    handleEdit(){ 
      if (this.multipleSelection.length != 0) {
        if(this.multipleSelection.length === 1){
          this.dialogObj.tid = this.multipleSelection[0].rowId;
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
    doDelete(ids){ 
      api.doDelete(ids).then(res=>{
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
    handleDelete(){
      if(this.multipleSelection.length == 1){
        this.$confirm('确定要删除此条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var idList;
          let ids = this.multipleSelection.map(item=>item.rowId)
          this.doDelete(ids);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }else if(this.multipleSelection.length > 1){
        this.$message({
          type: 'warning',
          message: '只能选择一条记录'
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
      this.pageIndex = currentPage;
      this.getTableData();
    },
    //每页显示数据量变更
    handleSizeChange(val) {
      this.pageCount = val;
       this.getTableData();
    },
    modelDateFormat(val){  //日期格式化
      return parseTime(val,'{y}-{m}-{d} {h}:{m}:{s}')
    },

  },
  destroyed(){
      let loginout = VSPOcxClient.LogoutServer();//退出登录，避免重复监听
      this.$store.commit('setAlarmInfo', {});//避免未报警进入时打开监控
  },
  components:{
    edit,
  },
}
</script>