<template>
<div class="app-container">
    <el-row>
      <el-col :span="16">
        <el-button
          type   = "success"
          @click = "handleAdd()">新增</el-button>
        <el-button
          @click="handleEdit()">编辑</el-button>
        <el-button
          type   = "danger"
          @click = "handleDelete()">删除</el-button>
      </el-col>
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
        prop  = "roadName"
        label = "路段名称">
      </el-table-column>
      <el-table-column
        prop  = "projectName"
        label = "归属项目"
        >
      </el-table-column><el-table-column
        prop="longitude"
        label="经度"
        >
      </el-table-column>
      <el-table-column
        prop="latitude"
        label="纬度"
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
      <el-dialog class="dialog-common-sys" width="80%" :title="dialogTitle" :visible.sync="showDialog" :modal-append-to-body='false' :close-on-click-modal='false' @close="cancelUpdate()">
        <el-row :gutter="40">
          <el-col :span="12">
            <el-form :model="road" :rules="rules" :inline="true" ref="Form">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="路段名称" :label-width="formLabelWidth" prop="roadName">
                    <el-input v-model="road.roadName" auto-complete="off" placeholder="请填写路段名称"></el-input>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="12">
                  <el-form-item label="所属项目" :label-width="formLabelWidth" prop="projectId">
                    <el-select v-model="road.projectId" placeholder="请选择所属项目">
                      <el-option
                                v-for   = "item in projectOptions"
                                :key    = "item.rowId"
                                :label  = "item.projectName"
                                :value  = "item.rowId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col> -->
                <el-col :span="12">
                  <el-form-item label="经度" :label-width="formLabelWidth" prop="longitude">
                    <el-input v-model="road.longitude" auto-complete="off" placeholder="请点击地图选择" :disabled="true"></el-input>
                  </el-form-item>   
                </el-col>
                <el-col :span="12">
                  <el-form-item label="纬度" :label-width="formLabelWidth" prop="latitude">
                    <el-input v-model="road.latitude" auto-complete="off" placeholder="请点击地图选择" :disabled="true"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
                    <el-input autosize type="textarea" v-model="road.remark" maxlength="128" placeholder="请填写备注" resize='none'></el-input>
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
import roadConfAPI from '@/api/config/roadConf'
import bmap from '@/components/map/BMap'
import { mapState } from 'vuex';

export default {
  data() {
    return {
      //地图信息
      mapInfo: {
        center:{lng:'',lat:''},//中心点
			  markerPoint:{lng:'',lat:''},//正在标记的点坐标
        markerList:[], //标注点
        markerRowIds: []
      },
      flag:'',  //判断新增还是修改
      total            : 0,  //数据总条数
      pageSize         : 10,  //每页容量
      currentPage      : 1,  //当前页
      tableData        : [],  //表格数据
      multipleSelection: [],  //表格多选框选中项
      showDialog       : false,
      dialogTitle      : '',  //弹出框标题
      road             : {  //路段对象
        rowId    : '',
        projectId: '',
        roadName : '',
        remark:'',
        longitude:'',
        latitude:''
      },
      rules   : {
        roadName: [
          { required: true, message: '请输入路段名称', trigger: 'blur' },
        ],
        /* projectId: [
          { required: true, message: '请选择所属项目', trigger: 'change' }
        ], */
        longitude: [
          { required: true, message: '请点击地图选择', trigger: 'change' }
        ],
        latitude: [
          { required: true, message: '请点击地图选择', trigger: 'change' }
        ],
      },
      projectOptions: [],  //项目下拉框选项
      formLabelWidth: '80px',
    } 
  },
  components:{
    bmap
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
    },
    getTableData(){  //获取所有路段信息
      roadConfAPI.getList(this.currentPage,this.pageSize,this.projectId).then(res=>{
        this.total = res.total;
        this.tableData = res.records;
      })
    },
    handleAdd(){  //打开新增框
      this.road.rowId = "";
      this.flag = 'add';
      this.dialogTitle = '新增';
      this.showDialog  = true;
    },
    handleEdit(){  //打开编辑框
      this.flag = 'edit';
      if(this.multipleSelection.length != 0){  //判断是否选中
        if(this.multipleSelection.length === 1){ //判断是否选中单条
          var selected = this.multipleSelection[0];
          this.road = Object.assign(this.road,selected);
          this.dialogTitle = '编辑';
          this.showDialog  = true;

          this.mapInfo.center.lng = this.road.longitude;
          this.mapInfo.center.lat = this.road.latitude;

          this.mapInfo.markerPoint = this.mapInfo.center;

          // this.mapInfo.markerList = this.tableData.map(item=>new BMap.Point(item.longitude,item.latitude))
        }else{
          this.$message({
            type   : 'warning',
            message: '不支持多条编辑'
          });
        }
      }else{
        this.$message({
          type   : 'warning',
          message: '请先选择一条记录'
        });
      }
    }, 
    getPosition(val){  //获取经纬度
      this.road.longitude = val.lng;
      this.road.latitude = val.lat;
      console.log(this.road)
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
      roadConfAPI.doDelete(ids).then(res=>{
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
    saveOrUpdate(){  //处理新增或编辑
      this.$refs['Form'].validate((valid) => {
        if (valid) {
          roadConfAPI.addOrEdit(this.road).then(res=>{
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
    cancelUpdate(){  //取消新增或编辑
      this.showDialog = false;
      this.$refs['Form'].resetFields();
    },
    handleSelectionChange(val) {  //获取选中项
      this.multipleSelection = val;
    },
    current_change(currentPage){
      this.currentPage = currentPage;
      this.getTableData();
    },
  }
}
</script>