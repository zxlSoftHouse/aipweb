<template>
<div>
    <el-row  type="flex" align="middle">
      <el-col :span="16">
        <el-button
          type="success"
          @click="handleAdd()">新增</el-button>
        <el-button
          @click="handleEdit()">编辑</el-button>
        <el-button
          type="danger"
          @click="handleDelete()">删除</el-button>
        <el-button
        type="info"
        @click="modalDown()">模板下载</el-button>
        <el-upload ref="upload"
          class="upload-demo"
          action="api/SERVICE-AIP/lightingLampControl/uploadLampConExcel"
          :headers="{'access_token':token,'Authorization':'bearer '+token}"
          :data="fileData"
          :on-success="handleSuccess"
          :on-error="handleError"
          :show-file-list="false"
          :before-upload="beforeExcelUpload"
          :limit="1">
          <el-button size="" type="primary">点击上传</el-button>
          <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
        </el-upload>
      </el-col>
      <el-col :span="2" :offset="0">
        所属路段：
      </el-col>
      <el-col :span="4" :offset="0">
        <!-- <el-input type="text" v-model="searchInfo.roadName" placeholder="请填写路段名称" ></el-input> -->
        <el-select v-model="searchInfo.roadId" placeholder="请选择所属路段" @change="getTableData">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in formSelection.roads"
            :key="item.rowId"
            :label="item.roadName"
            :value="item.rowId">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="getTableData()">搜索</el-button>
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
        label="单控器名称">
      </el-table-column>
      <el-table-column
        prop="controlerCode"
        label="单控器编号">
      </el-table-column>
      <el-table-column
        prop="tenderId"
        :formatter="getByTenderId"
        label="单控器厂家">
      </el-table-column>
      <el-table-column
        prop="controlerCode"
        label="单控器型号">
      </el-table-column>
      <el-table-column
        prop="controlerAddress"
        label="单控器地址">
      </el-table-column>
      <el-table-column
        prop="lampPostCode"
        label="灯杆">
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
    <el-dialog class="dialog-common-sys" :title="dialogTitle" :visible.sync="showDialog" :modal-append-to-body='false' :close-on-click-modal='false' @close="cancelUpdate()">
      <el-form :model="lampControl" :rules="rules" :inline="true" ref="Form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="单控器名称" :label-width="formLabelWidth" prop="controlerName">
              <el-input v-model="lampControl.controlerName" auto-complete="off" placeholder="请填写单控器名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单控器编号" :label-width="formLabelWidth" prop="controlerCode">
              <el-input v-model="lampControl.controlerCode" auto-complete="off" placeholder="请填写单控器编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属路段" :label-width="formLabelWidth" prop="roadId">
              <el-select v-model="lampControl.roadId" placeholder="请选择所属路段" @change="selectRoad">
                <el-option
                  v-for="item in formSelection.roads"
                  :key="item.rowId"
                  :label="item.roadName"
                  :value="item.rowId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="灯杆" :label-width="formLabelWidth" prop="lampPostId">
              <el-select v-model.trim="lampControl.lampPostId" placeholder="请选择灯杆" >
                <el-option
                  v-for="item in formSelection.lampPostOptions"
                  :key="item.rowId"
                  :label="item.lampPostCode"
                  :value="item.rowId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单控器厂家" :label-width="formLabelWidth" prop="tenderId">
              <el-select v-model="lampControl.tenderId" placeholder="请选择单控器厂家" @change="queryModelOptions">
                <el-option
                  v-for="item in formSelection.tenderOptions"
                  :key="item.rowId"
                  :label="item.tenderName"
                  :value="item.rowId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单控器型号" :label-width="formLabelWidth" prop="modelId">
              <el-select v-model="lampControl.modelId" placeholder="请选择单控器型号" >
                <el-option
                  v-for="item in formSelection.modelOptions"
                  :key="item.rowId"
                  :label="item.modelName"
                  :value="item.rowId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="集控器" :label-width="formLabelWidth" prop="centralizedControlId">
              <el-select v-model="lampControl.centralizedControlId" placeholder="请选择集控器" >
                <el-option
                  v-for="item in formSelection.centralizedControlIdOptions"
                  :key="item.rowId"
                  :label="item.controlerName"
                  :value="item.rowId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单控器地址" :label-width="formLabelWidth" prop="controlerAddress">
              <el-input v-model="lampControl.controlerAddress" auto-complete="off" placeholder="请填写单控器地址"></el-input>
            </el-form-item>
          </el-col>
          
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer"> 
        <el-button @click="cancelUpdate()">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
      </div>
    </el-dialog>

    </div>
</template>

<script>
import singleControllerConfAPI from '@/api/config/singleControllerConf'
import { mapState } from 'vuex';
import Cookies from 'js-cookie';
import { validForbid } from '@/utils/validate'

export default {
  data() {
    return {
      flag:'', //判断新增或编辑
      total:0,
      pageSize:10,
      currentPage:1,
      tableData: [],  //表格数据
      multipleSelection: [],  //选中项
      showDialog:false,
      dialogTitle:'',
      formLabelWidth:'100px',
      rules:{
        controlerName: [
          { required: true, message: '请填写单控器名称', trigger: 'blur' },
          { trigger: 'blur', validator: validForbid }
        ],
        controlerCode: [
          { required: true, message: '请填写单控器编号', trigger: 'blur' },
          { trigger: 'blur', validator: validForbid }
        ],
        roadId: [
          { required: true, message: '请选择路段', trigger: 'change' }
        ],
        tenderId: [
          { required: true, message: '请选择集控器厂家', trigger: 'change' }
        ],
        modelId: [
          { required: true, message: '请选择型号', trigger: 'change' }
        ],
        lampPostId: [
          { required: true, message: '请选择灯杆', trigger: 'change' }
        ],
        centralizedControlId: [
          { required: true, message: '请选择集控器', trigger: 'change' }
        ],
        controlerAddress: [
          { required: true, message: '请填写单控器地址', trigger: 'change' }
        ],
        longitude: [
          { required: true, message: '请在地图选择灯杆位置', trigger: 'change' }
        ],
        latitude: [
          { required: true, message: '请在地图选择灯杆位置', trigger: 'change' }
        ],
      },
      deviceType:'',
      searchInfo:{
        roadId:""
      },
      lampControl:{
        rowId:'',
        controlerName:'',  //单控器名称
        controlerCode:'',  //编号
        roadId:'',//路段
        modelId:'',  //型号
        tenderId:'',  //厂家
        lampPostId:'',//灯杆
        centralizedControlId:'',//集控器ID
        controlerAddress:'',  //单控器地址
      },
      powerSrc:1,
      formSelection:{  //表单下拉
        tenderOptions:[  //厂家
        ],
        modelOptions:[  //型号
        ],
        strategy:[  //策略
        ],
        lampPostOptions:[],//灯杆
        centralizedControlIdOptions:[],//集控器
      },
      fileData:{},
    } 
  },
  components:{
  },
  computed:{
    ...mapState({
      projectId: state=>state.project.projectId,
    }),
    token:()=>Cookies.get("access_token")
  },
  mounted(){
    this.initDataByProjectId();
  },
  methods: {    
    initDataByProjectId(){
      this.getTableData();
      this.getFormSelection();
      this.fileData = {projectId: this.projectId}
    },
    beforeExcelUpload(file){
      // 文件类型进行判断  
      let Xls = file.name.split('.');
      const isXls = (Xls[1] === 'xls'||Xls[1] === 'xlsx');      
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isXls) {
        this.$message.error("只能上传 EXCEL 表格!");
      }
      if (!isLt2M) {
        // this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      // return isXls && isLt2M;
      return isXls
    },
    handleSuccess(response, file, fileList) {
      if(response.result){
        let errorNum = response.totalNum - response.successNum;
        this.$message({
          type: 'warning',
          message: '上传成功'+response.successNum+'条，失败'+errorNum+'条'
        });
        this.getTableData();
      }else{
        this.$message.error("上传失败");
      }
      this.$refs.upload.clearFiles()
    },
    handleError() {
      this.$message.error('上传失败');
      this.$refs.upload.clearFiles()
    },
    getTableData(){  //获取表格数据
      let params = {
        pageNum:this.currentPage,
        pageSize:this.pageSize,
        projectId:this.projectId,
        roadId: this.searchInfo.roadId
      }
      singleControllerConfAPI.getList(params).then(res=>{
        this.total = res.total;
        this.tableData = res.records;
      })
    },
    getFormSelection(){  //获取表单下拉框数据
      this.getDeviceTypeCode();
      this.queryRoadOptions();
      this.queryCentralizedControlIdOptions();
    },

     
    queryRoadOptions(){
      singleControllerConfAPI.queryRoadOptions(this.projectId).then(res=>{
        this.formSelection.roads = res;
      })
    },
    getDeviceTypeCode(){
      singleControllerConfAPI.getDeviceTypeCode().then(res=>{
        this.deviceType = res;
        this.queryTenderOptions();
      })
    },
    queryTenderOptions(){  //获取厂家下拉框数据
      singleControllerConfAPI.queryTenderOptions({deviceType:this.deviceType}).then(res=>{
        this.formSelection.tenderOptions = res;
      })
    },
    queryModelOptions(val){  //获取型号下拉框数据
      let params = {
        tenderId: val,
        deviceType: this.deviceType
      }
      singleControllerConfAPI.queryModelOptions(params).then(res=>{
        this.formSelection.modelOptions = res;
      })
    },
    queryCentralizedControlIdOptions(){
       let params = {
        projectId: this.projectId,
        roadId: this.searchInfo.roadId
      }
      singleControllerConfAPI.queryLightingCentConList(params).then(res=>{
        this.formSelection.centralizedControlIdOptions = res;
      })
    },

    queryLampPostList(flag){
      if(flag!=='init') this.lampControl.lampPostId = '';
      let params = {
        projectId: this.projectId,
        roadId: this.lampControl.roadId
      }
      singleControllerConfAPI.queryLampPostList(params).then(res=>{
        this.formSelection.lampPostOptions = res;
      })
    },

    
    selectRoad(val){//选中路段
      /* let roadInfo = this.formSelection.roads.find(res=>res.rowId === val);
      this.mapInfo.center.lng = roadInfo.longitude;
      this.mapInfo.center.lat = roadInfo.latitude;
      this.mapInfo.markerPoint = this.mapInfo.center; */
      this.lampControl.lampPostId = '';
      this.queryLampPostList();
    },


    handleAdd(){  //打开新增框
      this.lampControl.rowId = "";
      this.flag = 'add';
      this.dialogTitle = '新增';
      this.showDialog = true;
      this.formSelection.lampPostOptions = [];
      this.formSelection.modelOptions = [];
    },
    handleEdit(){  //打开编辑框，填充表单
      if(this.multipleSelection.length != 0){
        this.flag = 'edit';
        if(this.multipleSelection.length === 1){
          var selected = this.multipleSelection[0];
          setTimeout(() => {
            this.lampControl = JSON.parse(JSON.stringify(selected));
            this.queryModelOptions(this.lampControl.tenderId);
            this.dialogTitle = '编辑';
            this.showDialog = true;
            this.queryLampPostList('init');//传init表示初始化时，不置空
          }, 0);
        }else{
          this.$message({
            type: 'warning',
            message: '不支持多条编辑'
          });
        }
      }else{
        this.$message({
          type: 'warning',
          message: '请先选择一条记录'
        });
      }
    },
    handleDelete(){  //删除选中项
      if(this.multipleSelection.length != 0){
        this.$confirm('确定要删除此条记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          var idList=[];
          this.multipleSelection.map(item=>{
            idList.push(item.rowId);
              this.doDelete(idList)
          })
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
    doDelete(ids){  //删除请求
      singleControllerConfAPI.doDelete(ids).then(res=>{
        if(res.result){
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.getTableData()
        }else{
          this.$message.error(res.errorMsg);
        }
      }).catch(()=>{
        this.$message.error('服务器错误');
      })
    },
    cancelUpdate(){  //取消新增或更新
      this.$refs['Form'].resetFields();
      this.showDialog = false;
    },
    saveOrUpdate(){  //处理新增或更新
      this.$refs['Form'].validate((valid) => {
        if (valid) {
          this.lampControl.projectId = this.projectId;
          singleControllerConfAPI.addOrEdit(this.lampControl).then(res=>{
            if(res.rowId){
              this.showDialog = false;
              this.$message({
                type: 'success',
                message: this.flag == 'add' ? '新增成功' : '修改成功'
              });
              this.getTableData();
            }else{
              this.$message.error('服务器错误');
            }
          })
        }
      });
    },
    current_change(currentPage){  //翻页
      this.currentPage = currentPage;
      this.getTableData();
    },
    handleSelectionChange(val) {  //处理选中值
      this.multipleSelection = val;
    },
    getByTenderId(val){  //根据id获取名称
      let row = this.formSelection.tenderOptions.filter(it=>it.rowId==val.tenderId);
      return row.length>0?row[0].tenderName:"未知厂家"
    },
    
    modalDown(){//模板下载      
      singleControllerConfAPI.downloadLampPostExcel().then(blob=>{
        console.log(blob)
          let filename = "单控器导入模板.xls"
         if (window.navigator.msSaveOrOpenBlob) {
              navigator.msSaveBlob(blob, filename);
          } else {
              const link = document.createElement('a');
              const body = document.querySelector('body');
              link.href = URL.createObjectURL(blob);
              link.download = filename;
              // fix Firefox
              link.style.display = 'none';
              body.appendChild(link);
              link.click();
              body.removeChild(link);
              window.URL.revokeObjectURL(link.href);
          }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
  .upload-demo{
    display: inline-block;
  }
</style>