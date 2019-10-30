<template>
<div>
    <el-row type="flex" align="middle">
      <el-col :span="16" style="margin-right:auto;">
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
            action="api/SERVICE-AIP/sysLampPost/uploadLampPostExcel"
            :headers="{'access_token':token,'Authorization':'bearer '+token}"
            :data="fileData"
            :on-success="handleSuccess"
            :on-error="handleError"
            :before-upload="beforeExcelUpload"
            :show-file-list="false"
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
        prop="roadName"
        label="所属路段"
        >
      </el-table-column>
      <!-- <el-table-column
        prop="modelName"
        label="灯杆型号"
        >
      </el-table-column> -->
      <el-table-column
        prop="tenderName"
        label="灯杆厂家"
        >
      </el-table-column>
      <el-table-column
        prop="lampPostCode"
        label="灯杆编号"
        >
      </el-table-column>
      <el-table-column
        prop="longitude"
        label="经度"
        >
      </el-table-column>
      <el-table-column
        prop="latitude"
        label="纬度"
        >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        :formatter="dateFormatter"
        >
      </el-table-column>
    </el-table>
    <div style="text-align: center;margin-top: 30px;">
      <el-pagination
        background
        layout="prev, pager, next, total"
        :total="total"
        @current-change="current_change">
      </el-pagination>
    </div>
      <el-dialog class="dialog-common-sys" width="80%" :title="dialogTitle" :visible.sync="showDialog" :modal-append-to-body='false' :close-on-click-modal='false' @close="cancelUpdate('Form')">
        <el-row :gutter="40">
          <el-col :span="12">
            <el-form :model="lamp" :rules="rules" ref="Form">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="所属路段" :label-width="formLabelWidth" prop="roadId">
                    <el-select v-model="lamp.roadId" placeholder="请选择所属路段" @change="selectRoad">
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
                  <el-form-item label="灯杆厂家" :label-width="formLabelWidth" prop="tenderId">
                    <el-select v-model="lamp.tenderId" placeholder="请选择灯杆厂家" @change="queryTypeOptions">
                      <el-option
                        v-for="item in formSelection.tenders"
                        :key="item.rowId"
                        :label="item.tenderName"
                        :value="item.rowId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="灯杆型号" :label-width="formLabelWidth" prop="modelId">
                    <el-select v-model="lamp.modelId" placeholder="请选择灯杆型号">
                      <el-option
                        v-for="item in formSelection.type"
                        :key="item.rowId"
                        :label="item.modelName"
                        :value="item.rowId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="灯杆编号" :label-width="formLabelWidth" prop="lampPostCode">
                    <el-input v-model="lamp.lampPostCode" auto-complete="off" placeholder="请填写灯杆编号"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="经度" :label-width="formLabelWidth" prop="longitude">
                    <el-input v-model="lamp.longitude" auto-complete="off" placeholder="请点击地图选择" :disabled="true"></el-input>
                  </el-form-item>   
                </el-col>
                <el-col :span="12">
                <el-form-item label="纬度" :label-width="formLabelWidth" prop="latitude">
                  <el-input v-model="lamp.latitude" auto-complete="off" placeholder="请点击地图选择" :disabled="true"></el-input>
                </el-form-item>
                </el-col>  
              </el-row>
              
            </el-form>
          </el-col>
          <el-col :span="12">
            <div>
              <bmap v-bind:setMarker=true v-bind:mapInfo="mapInfo" @changeMarker="getPosition"></bmap>

            </div>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer"> 
          <el-button @click="cancelUpdate()">取 消</el-button>
          <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import lampConfAPI from '@/api/config/lampConf'
import bmap from '@/components/map/BMap'
import Cookies from 'js-cookie';
import { mapState } from 'vuex';
import { formatTime,parseTime } from '@/utils/index'
import { validForbid } from '@/utils/validate'

export default {
  components: {
	  bmap,
  },
  computed:{
    ...mapState({
      projectId: state=>state.project.projectId,
    }),
    token:()=>Cookies.get("access_token")
  },
  data() {
    return {
      //地图信息
      mapInfo: {
        center:{lng:'',lat:''},//中心点
			  markerPoint:{lng:'',lat:''},//正在标记的点坐标
        markerList:[], //标注点
        markerRowIds: []
      },
      center:[117.2, 31.9],
      zoom:12,
      searchInfo:{
        roadId:""
      },
      flag:'',  //判断新增或编辑
      total:0,
      pageSize:10,
      currentPage:1,
      deviceType:'',//设备类型
      lamp:{
        rowId:'',
        lampPostCode:'',  //灯杆编号
        projectId:'', //项目id
        roadId:'',  //路段
        longitude:'',  //经度
        latitude:'',  //纬度
        tenderId:'', //厂家id
        modelId:'',//设备型号
      },
      formSelection:{  //表单下拉选项
        roads:[  //路段
        ],
        type:[  //路灯型号
        ],
        tenders:[  //灯杆厂家
        ],
      },
      tableData: [],  //表格数据
      multipleSelection: [],  //选中项
      showDialog:false,
      dialogTitle:'',
      formLabelWidth:'120px',
      lightTrigger:'',  //灯的开关
      lightLevel:0,  //灯的亮度
      addLampList:[],  //新增路灯列表
      rules:{
        roadId: [
          { required: true, message: '请选择路段', trigger: 'change' },
        ],
        tenderId: [
          { required: true, message: '请选择厂家', trigger: 'change' }
        ],
        modelId: [
          { required: true, message: '请选择型号', trigger: 'change' }
        ],
        lampPostCode: [
          { required: true, message: '请填写灯杆编号', trigger: 'blur' },
          { trigger: 'blur', validator: validForbid }
        ],
        longitude: [
          { required: true, message: '请在地图选择灯杆位置', trigger: 'change' }
        ],
        latitude: [
          { required: true, message: '请在地图选择灯杆位置', trigger: 'change' }
        ],
      },
      drawnFeatures:[],
      fileData:{},
    } 
  },
  watch:{
    drawnFeatures:{
      handler(val,oldVal){
        if(val.length === 1) return;
        this.drawnFeatures = [val[1]]
      },
      deep:true
    }
  },
  beforeMount(){
    this.getDeviceTypeCode();//1. 获取灯杆的设备类型code
  },
  mounted(){
    this.initDataByProjectId();
  },
  methods: {
    initDataByProjectId(){
      this.lamp.projectId = this.projectId;
      this.getTableData();
      this.fileData = {projectId: this.projectId}
    },

    dateFormatter(val){  //上报时间格式化
      if(val.createTime === null){
        return "-"
      }
      return parseTime(val.createTime)
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
          type: 'success',
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
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    getTableData(){  //获取表格数据
      let params = {
        pageNum: this.currentPage,pageSize: this.pageSize,
        projectId: this.projectId,roadId: this.searchInfo.roadId
      }
      lampConfAPI.getList(params).then(res=>{
        console.log(res)
        this.total = res.total;
        this.tableData = res.records;
      })
    },
    queryFormOptions(){  //获取表单下拉框数据
      this.queryRoadOptions();
      this.queryTenderOptions();
    },
    
    getDeviceTypeCode(){//1. 获取灯杆的设备类型code

      lampConfAPI.getDeviceTypeCode().then(res=>{
        this.deviceType = res;
        this.queryFormOptions();
      })
    },
    queryRoadOptions(){  //获取路段下拉框数据
      lampConfAPI.queryRoadOptions(this.projectId).then(res=>{
        this.formSelection.roads = res;
      })
    },
    queryTenderOptions(){  //获取厂家下拉框数据
      let params = {deviceType: this.deviceType}
      lampConfAPI.queryTenderOptions(params).then(res=>{
        this.formSelection.tenders = res.map(item=> {return {rowId:item.rowId,tenderName:item.tenderName}});
      })
    },
    queryTypeOptions(val){  //获取灯杆型号下拉框数据
      let params = {
        tenderId: val,
        deviceType: this.deviceType
      }
      lampConfAPI.queryTypeOptions(params).then(res=>{
        this.formSelection.type = res;
      })
    },
    handleAdd(){  //打开新增框
      this.flag = 'add';
      this.dialogTitle = '新增';
      this.showDialog = true;
    },
    handleEdit(){  //打开编辑框，填充表单
      this.flag = 'edit';
      if(this.multipleSelection.length != 0){
        if(this.multipleSelection.length === 1){
          var selected = this.multipleSelection[0];
          setTimeout(() => {
            this.lamp = JSON.parse(JSON.stringify(selected)) ;   
            this.queryTypeOptions(this.lamp.tenderId)
            this.mapInfo.center.lng = this.lamp.longitude;
            this.mapInfo.center.lat = this.lamp.latitude;

            this.mapInfo.markerPoint = this.mapInfo.center;

            this.mapInfo.markerList = this.tableData.map(item=>new BMap.Point(item.longitude,item.latitude))
            this.dialogTitle = '编辑';
            this.showDialog = true;
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
    doDelete(ids){  //删除请求
      lampConfAPI.doDelete(ids).then(res=>{
        this.$message({
          type: 'success',
          message: '删除成功'
        });
        this.getTableData();
      }).catch(()=>{
        this.$message.error('服务器错误');
      })
    },
    cancelUpdate(){  //取消新增或更新
      this.$refs['Form'].resetFields();
      this.showDialog = false;
      this.addLampList = [];
    },
    saveOrUpdate(){  //处理新增或更新
      this.$refs["Form"].validate((valid) => {
        if (valid) {
          lampConfAPI.update(this.lamp).then(res=>{
            this.showDialog = false;
            this.$message({
              type: 'success',
              message: this.flag == 'add'?'新增成功':"修改成功"
            });
            this.getTableData();
          })
        } else {
          return false;
        }
      })
     
    },
    current_change(currentPage){  //翻页
      this.currentPage = currentPage;
      this.getTableData();
    },
    handleSelectionChange(val) {  //处理选中值
      this.multipleSelection = val;
    },
    getPosition(val){  //获取经纬度
      this.lamp.longitude = val.lng;
      this.lamp.latitude = val.lat;
    },
    selectRoad(val){//选中路段
      let roadInfo = this.formSelection.roads.find(res=>res.rowId === val);
      this.mapInfo.center.lng = roadInfo.longitude;
      this.mapInfo.center.lat = roadInfo.latitude;
      this.mapInfo.markerPoint = this.mapInfo.center;
    },

    modalDown(){//模板下载      
      lampConfAPI.downloadLampPostExcel().then(blob=>{
        console.log(blob)
          let filename = "灯杆导入模板.xls"
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
    
    modalUp(){//模板上传

    }
  }
}
</script>
<style lang="scss" scoped>
  .upload-demo{
    display: inline-block;
  }
</style>
