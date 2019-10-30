<template>
<div>
    <el-row type="flex" align="middle">
      <el-col :span="16">
        <el-button
          type="success"
          @click="handleAdd()">新增</el-button>
        <el-button
          @click="handleEdit()">编辑</el-button>
        <el-button
          type="danger"
          @click="handleDelete()">删除</el-button>
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
        label="集控器名称">
      </el-table-column>
      <el-table-column
        prop="tenderName"
        label="集控器厂家"
        >
      </el-table-column>
      <el-table-column
        prop="modelName"
        label="集控器型号"
        >
      </el-table-column>
      <el-table-column
        prop="controlerAddress"
        label="集控器地址"
        >
      </el-table-column>
      <el-table-column
        prop="loopNum"
        label="回路数量"
        >
      </el-table-column>
      <el-table-column
        prop="registration"
        label="TCP注册包"
        >
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
      <el-dialog class="dialog-common-sys" :title="dialogTitle" :visible.sync="showDialog" :modal-append-to-body='false' :close-on-click-modal='false' @close="cancelUpdate()" width="80%">
        <el-form :model="centerController" :rules="rules" :inline="true" ref="Form">
          <el-row>
            <el-col :span="12">
              <el-col :span="12">
                  <el-form-item label="集控器名称" :label-width="formLabelWidth" prop="controlerName">
                    <el-input v-model="centerController.controlerName" auto-complete="off" placeholder="请填写集控器名称"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属路段" :label-width="formLabelWidth" prop="roadId">
                  <el-select v-model="centerController.roadId" placeholder="请选择所属路段" @change="selectRoad">
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
                  <el-form-item label="集控器厂家" :label-width="formLabelWidth" prop="tenderId">
                    <el-select v-model="centerController.tenderId" placeholder="请选择集控器厂家"  @change="queryTypeOptions">
                      <el-option
                        v-for="item in formSelection.tenderOption"
                        :key="item.rowId"
                        :label="item.tenderName"
                        :value="item.rowId">
                      </el-option>
                    </el-select>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item label="集控器型号" :label-width="formLabelWidth" prop="modelId">
                    <el-select v-model="centerController.modelId" placeholder="请选择集控器型号">
                      <el-option
                        v-for="item in formSelection.centerControllerTypeOption"
                        :key="item.rowId"
                        :label="item.modelName"
                        :value="item.rowId">
                      </el-option>
                    </el-select>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item label="TCP注册包" :label-width="formLabelWidth" prop="registration">
                    <el-input v-model="centerController.registration" auto-complete="off" placeholder="请填写TCP注册包"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item label="集控器地址" :label-width="formLabelWidth" prop="controlerAddress">
                    <el-input v-model="centerController.controlerAddress" auto-complete="off" placeholder="请填写集控器地址"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item label="回路数量" :label-width="formLabelWidth" prop="loopNum">
                    <el-select v-model="centerController.loopNum" placeholder="请选择回路数量">
                      <el-option
                        v-for="item in formSelection.loopNumOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="经度" :label-width="formLabelWidth" prop="longitude">
                  <el-input v-model="centerController.longitude" auto-complete="off" placeholder="请点击地图选择" :disabled="true"></el-input>
                </el-form-item>   
              </el-col>
              <el-col :span="12">
              <el-form-item label="纬度" :label-width="formLabelWidth" prop="latitude">
                <el-input v-model="centerController.latitude" auto-complete="off" placeholder="请点击地图选择" :disabled="true"></el-input>
              </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="12">
              <div >
                <!-- <vl-map :load-tiles-while-animating="true" :load-tiles-while-interacting="true"
                        data-projection="EPSG:4326" style="height: 400px" @click="getPosition">
                    <vl-view zoom.sync="12" :min-zoom="3" center.sync="[32,107]" rotation.sync="0"></vl-view>
                    <vl-layer-tile id="osm">
                        <vl-source-osm></vl-source-osm>
                    </vl-layer-tile>
                  <vl-layer-vector id="draw-pane">
                    <vl-source-vector ident="draw-target" :features.sync="drawnFeatures"></vl-source-vector>
                  </vl-layer-vector>
                  <vl-interaction-draw source="draw-target" type="point"></vl-interaction-draw>
                </vl-map> -->
							  <bmap v-bind:setMarker=true v-bind:mapInfo="mapInfo" @changeMarker="getPosition"></bmap>
              </div>
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
import centerControllerConfAPI from '@/api/config/centerControllerConf'
import bmap from '@/components/map/BMap'
import { mapState } from 'vuex';
import { validForbid } from '@/utils/validate'

export default {
  components: {
	  bmap,
  },
  data() {
    return {
      //地图信息
      mapInfo: {
        center:{lng:'',lat:''},//中心点
			  markerPoint:{lng:'',lat:''},//正在标记的点坐标
        markerList:[], //标注点
        markerRowIds: [],
      },
      searchInfo:{
        roadId:""
      },
      flag:'', //判断新增或编辑
      total:100,
      pageSize:10,
      currentPage:1,
      tableData: [],  //表格数据
      multipleSelection: [],  //选中项
      showDialog:false,
      dialogTitle:'',
      formLabelWidth:'100px',
      deviceType:'',
      centerController:{  //集控器对象
        rowId:'',
        controlerAddress:'',  //地址
        tenderId:'',  //厂家
        modelId:'',  //集控器类型
        controlerName:'',  //名称
        // state:'',  //在线状态
        registration:'',  //TCP注册包
        loopNum:'',  //回路数量
        longitude:'',
        latitude:''
      },
      formSelection:{  //表单下拉
        tenderOption:[
        ],
        roads:[],
        loopNumOption:[
          {
            value:'4',
            label:'4'
          },
          {
            value:'8',
            label:'8'
          },
          {
            value:'16',
            label:'16'
          },
        ],
        YONOption:[
          {
            value:'1',
            label:'是'
          },
          {
            value:'0',
            label:'否'
          }
        ],
        centerControllerTypeOption:[]
      },
      rules:{
        controlerName: [
          { required: true, message: '请填写集控器名称', trigger: 'blur' },
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
        registration: [
          { required: true, message: '请填写TCP注册包', trigger: 'blur' }
        ],
        controlerAddress: [
          { required: true, message: '请填写集控器地址', trigger: 'blur' }
        ],
        loopNum: [
          { required: true, message: '请选择回路数量', trigger: 'change' }
        ],
        longitude: [
          { required: true, message: '请在地图选择灯杆位置', trigger: 'change' }
        ],
        latitude: [
          { required: true, message: '请在地图选择灯杆位置', trigger: 'change' }
        ],
      },
      drawnFeatures:[]
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
  computed:{
    ...mapState({
      projectId: state=>state.project.projectId,
    }),
  },
  mounted(){
    this.initDataByProjectId();
  },
  methods: {
    initDataByProjectId(){
      this.getTableData();
      this.getOptions();
    },
    formatOnLine: function (row, column) {
      return row.onlinestate === '0' ? '在线' : '离线'
    },
    getTableData(){  //获取表格数据
      let params = {
        pageNum:this.currentPage,
        pageSize:this.pageSize,
        projectId:this.projectId,
        roadId: this.searchInfo.roadId
      }
      centerControllerConfAPI.getList(params).then(res=>{
        this.total = res.total;
        this.tableData = res.records;
      })
    },
    getOptions(){  //获取下拉框
      centerControllerConfAPI.getDeviceTypeCode().then(res=>{
        this.deviceType = res;
        let params = {deviceType:this.deviceType}
        centerControllerConfAPI.queryTenderList(params).then(res=>{
          this.formSelection.tenderOption = res;
        })
      }),
      centerControllerConfAPI.queryRoadOptions(this.projectId).then(res=>{
        this.formSelection.roads = res;
      })
    }, 
    queryTypeOptions(val){  //获取灯杆型号下拉框数据
      let params = {
        tenderId: val,
        deviceType: this.deviceType
      }
      centerControllerConfAPI.queryDeviceModel(params).then(res=>{
        this.formSelection.centerControllerTypeOption = res;
      })
    },   
    getPosition(val){  //获取经纬度
      this.centerController.longitude = val.lng;
      this.centerController.latitude = val.lat;
    },
    handleAdd(){  //打开新增框
      this.centerController.rowId = "";
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
            this.centerController = JSON.parse(JSON.stringify(selected)) ;    
            this.queryTypeOptions(this.centerController.tenderId);
            this.mapInfo.center.lng = this.centerController.longitude;
            this.mapInfo.center.lat = this.centerController.latitude;

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
      centerControllerConfAPI.doDelete(ids).then(res=>{       
        if(res.result){
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.getTableData()
        }else{
          this.$message.error(res.errorMsg);
        }
      })
    },
    cancelUpdate(){  //取消新增或更新
      this.$refs['Form'].resetFields();
      this.showDialog = false;
    },
    saveOrUpdate(){  //处理新增或更新
      this.$refs['Form'].validate((valid) => {
        if (valid) {
          this.centerController.projectId = this.projectId;
          centerControllerConfAPI.addOrEdit(this.centerController).then(res=>{
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
    selectRoad(val){//选中路段
      let roadInfo = this.formSelection.roads.find(res=>res.rowId === val);
      this.mapInfo.center.lng = roadInfo.longitude;
      this.mapInfo.center.lat = roadInfo.latitude;
      this.mapInfo.markerPoint = this.mapInfo.center;
    }
  }
}
</script>
