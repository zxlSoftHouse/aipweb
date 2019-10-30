<template>
<div class="app-container ledConfig">
  <el-row class="operate-bar">
    <el-col>
      <label @click="shot()">
        <i class="iconfont icon-jieping"></i>
        屏幕截图
      </label>
      <label @click="handleOperateOpen('true', 'powerObj')">
        <i class="iconfont icon-dianyuan"></i>
        屏幕开关
      </label>
      <label @click="handleOperateOpen('true', 'brightnessObj')">
        <i class="iconfont icon-liangdu1"></i>
        屏幕亮度
      </label>
      <label @click="handleOperateOpen('true', 'volumeObj')">
        <i class="iconfont icon-yinliang"></i>
        音量控制
      </label>
      <label @click="restart()">
        <i class="iconfont icon-zhongqi"></i>
        重启系统
      </label>
      <label @click="handleOperateOpen('true', 'realTimeMsgObj')">
        <i class="iconfont icon-wenzi"></i>
        实时消息
      </label>
      <label @click="handleOperateOpen('false', 'syncSetObj')">
        <i class="iconfont icon-tongbu"></i>
        同步设置
      </label>
    </el-col>
  </el-row>
  <el-row>
    <el-col>
      <el-button type="success" @click="handleAdd()">
        <i class="iconfont icon-xinzeng"></i>
        新增</el-button>
      <el-button type="primary" @click="handleEdit()">
        <i class="iconfont icon-bianji1"></i>
        编辑
      </el-button>
      <el-button type="warning" @click="handleDelete()">
        <i class="iconfont icon-shanchu"></i>
        删除
      </el-button>
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
      prop="ipAddress"
      label="ID">
    </el-table-column>
    <el-table-column
      prop="ledName"
      label="屏幕名称">
    </el-table-column>
    <el-table-column
      prop="program"
      label="正在播放节目">
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
      prop="devicestatus"
      label="屏幕状态">
      <template slot-scope="scope">
        <div>
          {{ scope.row.devicestatus | devicestatusFilter }}
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="netWork"
      label="网络类型">
    </el-table-column>
    <el-table-column
      prop="screenWidth"
      label="宽">
    </el-table-column>
    <el-table-column
      prop="screenHeight"
      label="高">
    </el-table-column>
    <el-table-column
      prop="brightness"
      label="亮度">
    </el-table-column>
    <el-table-column
      prop="volume"
      label="音量">
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
  <edit @handleClose="handleClose" @init="initDataByProjectId" :dialogObj="editDialogObj"></edit>
  <shot @handleClose="handleOperateClose('shotObj')" :dialogObj="shotObj"></shot> 
  <power @handleClose="handleOperateClose('powerObj')" @init="initDataByProjectId" :dialogObj="powerObj" :idList="idList"></power>
  <brightness @handleClose="handleOperateClose('brightnessObj')" @init="initDataByProjectId" :dialogObj="brightnessObj" :idList="idList"></brightness>
  <volume @handleClose="handleOperateClose('volumeObj')" @init="initDataByProjectId" :dialogObj="volumeObj" :idList="idList"></volume>
  <realTimeMsg @handleClose="handleOperateClose('realTimeMsgObj')" :dialogObj="realTimeMsgObj" :idList="idList"></realTimeMsg>
  <syncSet @handleClose="handleOperateClose('syncSetObj')" :dialogObj="syncSetObj" :idList="idList"></syncSet>    
</div>
</template>
<script>
import ledConfAPI from '@/api/led/ledConfAPI'
import edit from './edit.vue'
import shot from './shot.vue'
import power from './power.vue'
import brightness from './brightness.vue'
import volume from './volume.vue'
import realTimeMsg from './realTimeMsg.vue'
import syncSet from './syncSet.vue'

export default {
  data() {
    return {
      // 新增编辑
      editDialogObj: {
        isShow: false,
        title: '',
        rowId: ''
      },
      // 屏幕截图
      shotObj: {
        isShow: false,
        ipAddress: null,
        imgSrc: null
      },
      // 屏幕开关
      powerObj: {
        isShow: false
      },
      // 屏幕亮度
      brightnessObj: {
        isShow: false
      },
      // 音量控制
      volumeObj: {
        isShow: false
      },
      // 实时文字
      realTimeMsgObj: {
        isShow: false
      },
      // 同步设置
      syncSetObj: {
        isShow: false
      },
      idList: [],
      total: 0,  //数据总条数
      pageSize: 10,  //每页容量
      currentPage: 1,  //当前页
      tableData: [],  //表格数据
      multipleSelection: [],  //表格多选框选中项
    }
  },
  components:{
    edit,
    shot,
    power,
    brightness,
    volume,
    realTimeMsg,
    syncSet
  },
  created() {
    this.initDataByProjectId();
  },
  methods: {
    handleClose() {
      this.editDialogObj.isShow = false;
      this.editDialogObj.rowId = '';
    },
    handleAdd(){  //打开新增框
      this.editDialogObj.isShow = true;
      this.editDialogObj.title = '新增';
    },
    handleEdit(){ 
      if (this.multipleSelection.length != 0) {
        if(this.multipleSelection.length === 1){
          this.editDialogObj.rowId = this.multipleSelection[0].rowId;
          this.editDialogObj.isShow = true;
          this.editDialogObj.title = '编辑';
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
    handleDelete(){  //删除选中记录
      if(this.multipleSelection.length != 0){ //判断是否选中
        this.$confirm('确定要删除此条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          var idList = [];
          this.multipleSelection.map(item=>{
            idList.push(item.rowId);
          })
          this.doDelete(idList);
        }).catch(() => {
          this.$message({
            type   : 'info',
            message: '已取消删除'
          });
        });
      }else{
        this.$message({
          type   : 'warning',
          message: '请先选择一条记录'
        });
      }
    },
    doDelete(ids){  //处理删除请求
      ledConfAPI.doDelete(ids).then(res=>{
        if(res){
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.initDataByProjectId();
        }else{
          this.$message.error('服务器错误，请联系管理员！');
        }
      })
    },
    handleSelectionChange(val) {  //获取选中项
      this.multipleSelection = val;
    },
    current_change(currentPage){
      this.currentPage = currentPage;
      this.getTableData();
    },
    getTableData(){  //获取所有LED信息
      ledConfAPI.getList(this.currentPage,this.pageSize).then(res=>{
        this.total = res.total;
        this.tableData = res.records;
      })
    },
    restart(){  //重启
      if(this.multipleSelection.length != 0){ //判断是否选中
        this.$confirm('确定要重启吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          let ipList = [];
          this.multipleSelection.map(item=>{
            ipList.push(item.rowId);
          })
          ledConfAPI.ctrlScreen(ipList, 2, 1).then(res=>{
          })
        }).catch(() => {
          this.$message({
            type   : 'info',
            message: '已取消'
          });
        });
      }else{
        this.$message({
          type   : 'warning',
          message: '请先选择一条记录'
        });
      }
    },
    handleOperateOpen(isSingle, k) { // 操控台弹框打开
      this.idList = [];
      if(this.multipleSelection.length != 0){ //判断是否选中
        if (isSingle == 'true') {
          if(this.multipleSelection.length === 1){ //判断是否选中单条
            if (this.multipleSelection[0].onlinestate != 1) {
              this.$message.warning('该设备不在线或不存在,暂不支持操作该设备！');
              return;
            }
          }else{
            this.$message.warning('不支持多条操作');
            return;
          }
        }
        this[k].isShow = true;
        this.multipleSelection.map(item=>{
          this.idList.push(item.rowId);
        });
      }else{
        this.$message({
          type   : 'warning',
          message: '请先选择一块led屏'
        });
      }
    },
    handleOperateClose(k) { // 操作台弹框关闭
      this[k].isShow = false;
    },
    queryScreenInfo() {
      ledConfAPI.ledCtrl([this.multipleSelection[0].ipAddress], deviceType).then(res=>{
        this.getTableData();
      });
    },
    shot(){
      if(this.multipleSelection.length != 0){ //判断是否选中
        if(this.multipleSelection.length === 1){ //判断是否选中单条
          if (this.multipleSelection[0].onlinestate != 1) {
            this.$message.warning('该设备不在线或不存在,暂不支持操作该设备！');
          } else {
            let data = {
              type: "callCardService", 
              fn: "screenshot", 
              arg1: 100,
              arg2: 100 
            }
            ledConfAPI.ledCtrl(this.multipleSelection[0].ipAddress, data).then(res=>{
              this.shotObj.imgSrc = "data:image/png;base64,"+ res.result.replace(/[\n]/g, "");
              this.shotObj.isShow = true;
            })
          }
        }else{
          this.$message({
            type   : 'warning',
            message: '不支持多条操作'
          });
        }
      }else{
        this.$message({
          type   : 'warning',
          message: '请先选择一块led屏'
        });
      }
    },
    initDataByProjectId() {
      this.getTableData();
    }
  },
  filters: {
    devicestatusFilter: function(value){
      if (value == 1) {
        return 'on'
      } else {
        return 'off'
      }
    }
  },
}
</script>

<style lang="scss">
  .ledConfig {
    .operate-bar {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px 20px;
      margin-bottom: 20px;
      font-size: 16px;
      color: #337ab7;
      label {
        padding: 10px 20px;
        cursor: pointer;
        // background: #ddd;
        &:hover {
          background: #eee;
          // color: #fff;
        }
      }
    }
  }
</style>
