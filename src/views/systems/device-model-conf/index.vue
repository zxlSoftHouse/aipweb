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
          设备类型
        <el-select v-model="searchInfo.deviceType" placeholder="请选择设备类型" @change="selectDeviceType">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in deviceTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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
        prop  = "modelCode"
        label = "型号编号">
      </el-table-column>
      <el-table-column
        prop  = "modelName"
        label = "型号名称"
        >
      </el-table-column>
      <el-table-column
        prop  = "tenderName"
        label = "厂家名称"
        >
      </el-table-column>
      <el-table-column
        prop  = "deviceType"
        label = "设备类型"
        :formatter="deviceTypeFormat"
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
      <el-dialog class="dialog-common-sys" width="70%" :title="dialogTitle" :visible.sync="showDialog" :modal-append-to-body='false' :close-on-click-modal='false' @close="cancelUpdate()">
        <el-form :model="deviceModel" :rules="rules" :inline="true" ref="Form">
          <el-row>
            <el-col :span="12">
                <el-form-item label="型号编号" :label-width="formLabelWidth" prop="modelCode">
                  <el-input v-model="deviceModel.modelCode" auto-complete="off" placeholder="请填写型号编号"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="型号名称" :label-width="formLabelWidth" prop="modelName">
                  <el-input v-model="deviceModel.modelName" auto-complete="off" placeholder="请填写型号名称"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备厂家" :label-width="formLabelWidth" prop="tenderId">
                <el-select v-model="deviceModel.tenderId" placeholder="请选择设备厂家">
                  <el-option
                    v-for="item in formSelection.deviceTenderOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备类型" :label-width="formLabelWidth" prop="deviceType">
                <el-select v-model="deviceModel.deviceType" placeholder="请选择设备类型">
                  <el-option
                    v-for="item in deviceTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
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
import deviceModelConfAPI from '@/api/config/deviceModelConf'
import { parseTime } from '@/utils/index'
import { mapGetters, mapState } from 'vuex'
import { validForbid } from '@/utils/validate'


export default {
  data() {
    return {
      flag:'',  //判断新增还是修改
      total            : 0,  //数据总条数
      pageSize         : 10,  //每页容量
      currentPage      : 1,  //当前页
      tableData        : [],  //表格数据
      multipleSelection: [],  //表格多选框选中项
      showDialog       : false,
      dialogTitle      : '',  //弹出框标题
      deviceModel : {
      //设备型号对象
            rowId:'',  //型号id
            modelCode:'',  //型号编号
            modelName:'',  //型号名称
            
            tenderId:'', //厂家ID
            deviceType:"",  //设备类型 设备分类(00:灯杆,01:灯,02:单灯控制器,03:集中控制器)
      },
      searchInfo:{  //筛选条件
        deviceType:"",
      },
      deviceModel:{ 
      },
      formSelection:{  //表单下拉
        deviceTenderOptions:[],//设备厂家
        dataTypeOption:[  //数据类型
          {
            value:'1',
            label:'整数'
          },
          {
            value:'2',
            label:'文字'
          }
        ],
      },
      rules   : {
          modelCode: [
            { required: true, message: '请输入型号编码', trigger: 'blur' },
            { trigger: 'blur', validator: validForbid }
          ],
          modelName: [
            { required: true, message: '请输入型号名称', trigger: 'blur' },
            { trigger: 'blur', validator: validForbid }
          ],
          tenderId: [
            { required: true, message: '请选择设备厂家', trigger: 'change' },
          ],
          deviceType: [
            { required: true, message: '请选择设备类型', trigger: 'change' },
          ],
      },
      formLabelWidth: '100px',
    } 
  },
  components:{
  },
  computed: {
    ...mapState({
      deviceTypeOptions: state=>state.baseData.deviceType,
    }),
  },
  beforeMount(){
    this.getDeviceTender();
  },
  mounted(){
    this.getTableData();
  },
  methods: {
    getTableData(){  //获取所有信息
      let params = {
         pageNum: this.currentPage, pageSize: this.pageSize, deviceType: this.searchInfo.deviceType
      }
      deviceModelConfAPI.getList(params).then(res=>{
        this.total = res.total;
        this.tableData = res.records;
      })
    },
    modelDateFormat(val){  //日期格式化
      
      return val.modelDate?parseTime(val.modelDate,'{y}-{m}-{d}'):'-'
    },
    deviceTypeFormat(val){ //设备类型格式化
      let deviceInfo = this.deviceTypeOptions.find(res=>res.value==val.deviceType);
      return deviceInfo?deviceInfo.label:'未知'
    },
    selectDeviceType(){
      this.getTableData();
    },
    handleAdd(){  //打开新增框
      this.flag = 'add';
      this.dialogTitle = '新增';
      this.showDialog  = true;
    },
    handleEdit(){  //打开编辑框
      this.flag = 'edit';
      if(this.multipleSelection.length != 0){  //判断是否选中
        if(this.multipleSelection.length === 1){ //判断是否选中单条
          let selected = this.multipleSelection[0]; 
          
          setTimeout(() => {
            this.deviceModel = JSON.parse(JSON.stringify(selected)) ;  
            this.dialogTitle = '编辑';
            this.showDialog  = true;
          }, 0); 
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
    handleDelete(){  //删除选中记录
      if(this.multipleSelection.length != 0){ //判断是否选中
        this.$confirm('确定要删除此条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          // var selected = this.multipleSelection[0];
          let ids = this.multipleSelection.map(res=>res.rowId)
          console.log(ids)
          this.doDelete(ids);
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
      deviceModelConfAPI.doDelete(ids).then((res)=>{
        if(res.result){
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.getTableData();
        }else{
          this.$message.error(res.errorMsg);
        }
          
      }).catch(()=>{
          this.$message.error('服务器错误');
      })
    },
    saveOrUpdate(){  //处理新增或编辑
      this.$refs['Form'].validate((valid) => {
        if (valid) {
          deviceModelConfAPI.update(this.deviceModel).then(res=>{
            this.showDialog = false;
            this.$message({
              type: 'success',
              message: this.flag == 'add'?'新增成功':'修改成功'
            });
            this.getTableData();
          })
        }
      })
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
    getDeviceTender(){
       deviceModelConfAPI.queryDeviceTenderList().then(res => {    
            this.formSelection.deviceTenderOptions = res.map(it=>{
              return {value:it.rowId,label:it.tenderName}
            })
        }).catch(error => {
            console.log(error);
            Message.error('服务器异常');
        })
    },
  }
}
</script>