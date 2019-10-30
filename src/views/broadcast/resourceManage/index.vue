<template>
<div>
    <el-row type="flex" align="middle">
        <el-col :span="3">
            <el-upload
            class="upload-demo"
            action="/audioSer/php/addmediadata.php"
            multiple
            :data="fileData"
            accept="audio/mp3"
            :headers="{'access_token':token,'Authorization':'bearer '+token}"
            :show-file-list="false"
            :before-upload="beforeSrcUpload"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :on-progress="uploadVideoProcess">
            <el-button type="primary">点击上传</el-button>
            </el-upload>
        </el-col>
        <el-col :span="5" v-if="videoFlag == true">
            <el-progress type="line" :percentage="videoUploadPercent"></el-progress>
        </el-col>
        <el-col>
            <el-button
            type   = "danger"
            @click = "handleDelete()">删除文件</el-button>
        </el-col>
    </el-row>
    <el-row>
        <!-- <div  class="el-upload__tip">只能上传jpeg/gif/png/bmp/mp4格式的文件</div> -->
    </el-row>
    <el-table
        ref               = "multipleTable"
        :data             = "tableData"
        tooltip-effect    = "dark"
        style             = "width: 100%"
        @selection-change = "handleSelectionChange">
        <el-table-column
        type  = "selection"
        width = "55">
        </el-table-column>
        <el-table-column
        prop  = "name"
        label = "文件名称">
        </el-table-column>
        <el-table-column
        prop  = "time"
        label = "文件大小"
        >
        </el-table-column>
        <!-- <el-table-column
        prop  = "durations"
        label = "播放时长"> -->
        <!-- </el-table-column> -->
        <el-table-column
        label="试听">
        <template slot-scope="scope">
          <i class="icon-listen" @click="listen(scope.row)"></i>
        </template>
        </el-table-column>
    </el-table>
    <div style="text-align: center;margin-top: 30px;">
        <el-pagination
        background
        layout          = "total, prev, pager, next, jumper"
        :total          = "total"
        @current-change = "current_change">
        </el-pagination>
    </div>
    <el-dialog class="dialog-common-audio" :title="dialogTitle" :visible.sync="showDialog" :modal-append-to-body='false' :close-on-click-modal='false'>
      <audio id="audioSrc" controls :src="audioSrc">
      </audio>  
    </el-dialog>
</div>
</template>
<script>
import request from '@/utils/request'
import Cookies from 'js-cookie';
import resourceConfigAPI from '@/api/broadcast/resourceConfig'
import '@/assets/js/plugins/hkvVideo/jquery-1.7.1.min.js'

export default {
  data() {
    return {
      total            : 0,  //数据总条数
      pageCount         : 10,  //每页容量
      pageIndex      : 0,  //当前页
      tableData        : [],  //表格数据
      multipleSelection: [],  //表格多选框选中项
      videoFlag:false,
      videoUploadPercent:0,
      showDialog: false,
      audioSrc:null,
      dialogTitle:null,
      fileData:{
        subpath:"",
        unformat:"1"
      }
    }
  },
  computed:{
    token:()=>Cookies.get("access_token")
  },
  mounted(){
    this.getTableData();
  },
  methods:{
    // 获取任务列表
    getTableData(){
      let data = {
        pageIndex: this.pageIndex,
        pageCount: this.pageCount,
        filter: "*"
      }
      resourceConfigAPI.getList(data).then(res=>{
        this.total = parseInt(res.total);
        this.tableData = res.rows;
      })
    },
    // 点击试听
    listen(val){
      this.showDialog = true;
      this.audioSrc =  "/audioSer/MediaFiles//" + val.name;
      this.dialogTitle = val.name;
    },
    fileSizeFormatter(val){
      return (val.fileSize/1000000).toFixed(3) + "M";
    },
    handleSelectionChange(val) {  //获取选中项
      this.multipleSelection = val;
    },
    current_change(currentPage){
      this.currentPage = currentPage;
      this.getTableData();
    },
    doDelete(ids){  //处理删除请求
      resourceConfigAPI.delMedia(ids).then(res=>{
        if(res.res == 1){
        this.$message({
            type: 'success',
            message: '删除成功'
        });
        }else{
        this.$message.error(res.errorMsg);
        }
        this.getTableData();
      })
    },
    handleDelete(){  //删除选中记录
      if(this.multipleSelection.length == 1){ //判断是否选中
          this.$confirm('确定要删除此条记录?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
              }).then(()=>{
              var idList;
              this.multipleSelection.map(item=>{
                idList = "//" + item.name
              })
              let data = {
                fileName: idList,
              }
              this.doDelete(data);
              }).catch(() => {
              this.$message({
                  type   : 'info',
                  message: '已取消删除'
              });
          });
      }else if(this.multipleSelection.length > 1){
        this.$message({
          type: 'warning',
          message: '只能选择一条记录'
        })
      }else{
        this.$message({
        type   : 'warning',
        message: '请先选择一条记录'
        });
      }
    },
   
    beforeSrcUpload(file){
      const allowList = ["audio/mp3"];
      let flag = allowList.some(item=>item==file.type);
      let fileNameStr = file.name.replace(/\s*/g,"");
      let findIndex = this.tableData.findIndex(it=>it.name==fileNameStr);
      if(findIndex !==-1){
        this.$message.error('此文件已上传,请重新选择！')
        return false;
      }
      if(!flag){
        this.$message.error('文件格式错误！只能上传mp3格式的文件')
        return false;
      }
    },
    uploadSuccess(res, file){
      this.videoFlag = false;
      this.videoUploadPercent = 0;
      this.$message({
        type   : 'success',
        message: '上传成功'
      });
      this.getTableData();
    },
    uploadError(err){
      this.$message.error(err);
    },
    uploadVideoProcess(event, file, fileList){
      this.videoFlag = true;
      this.videoUploadPercent = Number.parseInt(file.percentage.toFixed(0));
    },
  }
}
</script>
<style lang="scss">
  .dialog-common-audio {
    .el-dialog {
      width: 32%;
      background: rgba(0,0,0,0.7);
      -webkit-box-shadow: 0 5px 15px rgba(0,0,0,.5);
      box-shadow: 0 5px 15px rgba(0,0,0,.5);
      border: 1px solid rgba(0,0,0,.2);
      border-radius: 6px;
      audio {
        width: 100%;
        outline: none;
      }
      .el-dialog__header {
        padding: 12px 20px 10px;
      }
      .el-dialog__body {
        padding: 15px 20px;
      }
      .el-dialog__title {
        color: #fff;
        font-weight: 500;
        font-size: 20px;
      }
      .el-dialog__headerbtn .el-dialog__close {
        font-weight: 1000;
      }
    }
  }
  .icon-listen {
    cursor: pointer;
  }
</style>