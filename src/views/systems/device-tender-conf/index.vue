<template>
<div class="app-container">
    <el-row>
      <el-col :span="16">
        <el-button
          type   = "success"
          @click = "handleAdd()">新增</el-button>
        <el-button
          @click= "handleEdit()">编辑</el-button>
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
        prop  = "tenderCode"
        label = "社会信用代码">
      </el-table-column>
      <el-table-column
        prop  = "tenderName"
        label = "厂家名称"
        >
      </el-table-column>
      <el-table-column
        prop  = "tenderAddr"
        label = "厂家地址"
        >
      </el-table-column>
      <el-table-column
        prop  = "tenderPhone"
        label = "联系方式"
        >
      </el-table-column>
      <el-table-column
        prop  = "tenderPrincipal"
        label = "负责人"
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
      <el-dialog class="dialog-common-sys" :title="dialogTitle" :visible.sync="showDialog" :modal-append-to-body='false' :close-on-click-modal='false' @close="cancelUpdate()">
        <el-form :model="deviceTender" :rules="rules" :inline="true" ref="Form">
          <el-row>
            <el-col :span="12">
                <el-form-item label="社会信用代码" :label-width="formLabelWidth" prop="tenderCode">
                  <el-input v-model="deviceTender.tenderCode" auto-complete="off" placeholder="请填写社会信用代码"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="厂家名称" :label-width="formLabelWidth" prop="tenderName">
                  <el-input v-model="deviceTender.tenderName" auto-complete="off" placeholder="请填写厂家名称"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="厂家地址" :label-width="formLabelWidth" prop="tenderAddr">
                  <el-input v-model="deviceTender.tenderAddr" auto-complete="off" placeholder="请填写厂家地址"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="联系方式" :label-width="formLabelWidth" prop="tenderPhone">
                  <el-input v-model="deviceTender.tenderPhone" auto-complete="off" placeholder="请填写联系方式"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="负责人" :label-width="formLabelWidth" prop="tenderPrincipal">
                  <el-input v-model="deviceTender.tenderPrincipal" auto-complete="off" placeholder="请填写负责人"></el-input>
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
import deviceTenderConfAPI from '@/api/config/deviceTenderConf'
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
      deviceTender:{  //设备厂家对象
        rowId:'',  //厂家id
        tenderCode:'',  //社会信用代码
        tenderName:'',  //厂家名称
        tenderAddr:'',  //厂家地址
        tenderPhone:'',  //联系方式
        tenderPrincipal:'',  //负责人
      },
      rules   : {
          tenderCode: [
            { required: true, message: '请输入社会行用代码', trigger: 'blur' },
            { trigger: 'blur', validator: validForbid }
          ],
          tenderName: [
            { required: true, message: '请输入厂家名称', trigger: 'blur' },
            { trigger: 'blur', validator: validForbid }
          ],
          tenderAddr: [
            { required: true, message: '请输入厂家地址', trigger: 'blur' },
            { trigger: 'blur', validator: validForbid }
          ],
          tenderPhone: [
            { required: true, message: '请输入联系方式', trigger: 'blur' },
            { trigger: 'blur', validator: validForbid }
          ],
          tenderPrincipal: [
            { required: true, message: '请输入负责人', trigger: 'blur' },
            { trigger: 'blur', validator: validForbid }
          ],
      },
      projectOptions: [],  //项目下拉框选项
      formLabelWidth: '120px',
    } 
  },
  components:{
  },
  mounted(){
    this.getTableData();
  },
  methods: {
    getTableData(){  //获取所有路段信息
      deviceTenderConfAPI.getList(this.currentPage,this.pageSize).then(res=>{
        this.total = res.total;
        this.tableData = res.records;
      })
    },
    handleAdd(){  //打开新增框
      this.deviceTender.rowId = "";
      this.flag = 'add';
      this.dialogTitle = '新增';
      this.showDialog  = true;
    },
    handleEdit(){  //打开编辑框
      this.flag = 'edit';
      if(this.multipleSelection.length != 0){  //判断是否选中
        if(this.multipleSelection.length === 1){ //判断是否选中单条
          var selected = this.multipleSelection[0];
          setTimeout(() => {
            this.deviceTender = JSON.parse(JSON.stringify(selected));
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
      deviceTenderConfAPI.doDelete(ids).then(res=>{
        if(res.result){
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
          deviceTenderConfAPI.addOrEdit(this.deviceTender).then(res=>{
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
      })
    },
    cancelUpdate(){  //取消新增或编辑
      this.$refs['Form'].resetFields();
      this.showDialog = false;
    },
    handleSelectionChange(val) {  //获取选中项
      this.multipleSelection = val;
    },
    current_change(currentPage){
      this.currentPage = currentPage;
      this.getTableData();
    },
    deviceTypeFmt(val){  //厂家型号(00:灯杆,01:灯,02:单灯控制器,03:集中控制器)
      switch(val.deviceType){
        case '00' : 
          return '灯杆';
          break;
        case '01' : 
          return '灯';
          break;
        case '02' : 
          return '单灯控制器';
          break;
        case '03' : 
          return '集中控制器';
          break;
        case '04' : 
          return 'LED';
          break;
        case '05' : 
          return '传感器';
          break;
        case '06' :
          return '一键报警';
        case '07' :
          return '监控'
        default:
          return '未定义'
      }
    }
  }
}
</script>