<template>
<div class="app-container">
    <el-row>
      <el-col :span="16">
        <el-button
          type="success"
          @click="handleAdd()">新增</el-button>
        <el-button
          @click="handleEdit()">编辑</el-button>
        <el-button
          type="danger"
          @click="handleDelete()">删除</el-button>
        <!-- <el-button v-show="false">{{getProject}}</el-button> -->
      </el-col>
      <el-col :span="6">
        <el-input type="text" v-model="searchInfo" placeholder="请填写项目名称" ></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="queryByProjectName()">搜索</el-button>
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
        prop="projectName"
        label="项目名称">
      </el-table-column>
      <el-table-column
        prop="company"
        label="公司名称"
        >
      </el-table-column>
      <el-table-column
        label="项目区域" :formatter="areaFormat"> 
      </el-table-column>
    </el-table>
    <div style="text-align: center;margin-top: 30px;">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="current_change">
      </el-pagination>
    </div>
      <el-dialog class="dialog-common-sys" :title="dialogTitle" :visible.sync="showDialog" :modal-append-to-body='false' :close-on-click-modal='false' @close="cancelUpdate()">
        <el-form :model="project" :rules="rules" :inline="true" ref="Form">
          <el-row>
            <el-col :span="12">
                <el-form-item label="项目名称" :label-width="formLabelWidth" prop="projectName">
                  <el-input v-model="project.projectName" auto-complete="off" placeholder="请填写项目名称" ></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属公司" :label-width="formLabelWidth" prop="companyId">
                <el-select v-model="project.companyId" placeholder="请选择所属公司" filterable>
                  <el-option v-for="item in companyData" :key="item.rowId" :label="item.orgName" :value="item.rowId"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目区域" :label-width="formLabelWidth" prop="proArea">
                <city-selection :flag="flag" :selectedOptionsVal="editArea" @getSelection="getSelectionArea" ref="selectedCity"></city-selection>
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
import CitySelection from '@/components/city-selection/index'
import projectConfAPI from '@/api/config/projectConf'
import { CodeToText } from 'element-china-area-data'  
import _ from 'lodash'
import orgApi from '@/api/sysManage/org'
import { mapState } from 'vuex';

export default {
  data() {
    return {
      companyData: [],
      flag:'',
      queryInfo:{},
      total:0,
      pageSize:10,
      currentPage:1,
      tableData: [],
      multipleSelection: [],
      editArea:[],
      searchInfo:"",
      showDialog:false,
      dialogTitle:'',
      project:{
        rowId:'',
        provinceId:'',
        cityId:'',
        districtId:'',
        companyId:'',
        projectName:'',
        remark:'',
        proArea:[],
      },
      rules:{
          projectName: [
            { required: true, message: '请输入项目名称', trigger: 'blur' },
          ],
          companyId: [
            { required: true, message: '请选择所属公司', trigger: 'change' },
          ],
          proArea: [
            { required: true, message: '请选择项目区域', trigger: 'change' }
          ],
      },
      formLabelWidth:'80px',
    } 
  },
  computed : {
    ...mapState({
      projectId: state=>state.project.projectId,
    }),
  },
  components:{
    CitySelection,
  },
  mounted(){
    this.getTableData();
    this.getCompany();
  },
  methods: {
    areaFormat(val){  //地区初始化  
      var text = CodeToText[val.provinceId] + CodeToText[val.cityId] + CodeToText[val.districtId];
      return text;
    },
    getCompany() {
      orgApi.getAllOrgList({}).then((res) => {
        this.companyData = res;
      });
    },
    getTableData(){  //获取表格信息
      projectConfAPI.getList(this.currentPage,this.pageSize,this.searchInfo).then(res=>{
        this.total = res.total;
        this.tableData = res.records;
      })
    },
    queryByProjectName(){  //按项目名称查询
      this.getTableData();
    },
    handleAdd(){  //打开新增窗口
      this.project.rowId = "";
      this.dialogTitle = '新增';
      this.showDialog = true;
      this.flag = 'add';
      this.editArea = [];
    },
    handleEdit(){  //打开编辑框，为表单赋值
      this.flag = 'edit';
      if(this.multipleSelection.length != 0){
        if(this.multipleSelection.length === 1){
          var selectedRow = this.multipleSelection[0];
          var area = [];
          area.push(selectedRow.provinceId);
          area.push(selectedRow.cityId);
          area.push(selectedRow.districtId);
          this.editArea = area;
          console.log(selectedRow)
          this.project.projectName = selectedRow.projectName;
          this.project.companyId = selectedRow.companyId;
          this.project.rowId = selectedRow.rowId;
          this.project.proArea = [selectedRow.provinceId,selectedRow.cityId,selectedRow.districtId];
          this.dialogTitle = '编辑';
          this.showDialog = true;
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
    doDelete(ids){  //处理删除请求
      projectConfAPI.doDelete(ids).then(res=>{
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
    saveOrUpdate(){  //处理新增或更新
      var data = {
        rowId:'',
        provinceId:'',
        cityId:'',
        districtId:'',
        companyId:this.project.companyId,
        projectName:this.project.projectName,
      }
      data.rowId = this.project.rowId;
      data.provinceId = this.project.proArea[0];
      data.cityId = this.project.proArea[1];
      data.districtId = this.project.proArea[2];
      this.$refs['Form'].validate((valid) => {
        if (valid) {
          projectConfAPI.addOrEdit(data).then(res=>{
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
    cancelUpdate(){  //取消新增或更新
      this.$refs['Form'].resetFields();
      this.showDialog = false;
    },
    getSelectionArea(val){  //获取地区选择子组件的值
      this.project.proArea = val;
    },
    handleSelectionChange(val) {  //处理选中项
      this.multipleSelection = val;
    },
    current_change(currentPage){  //翻页
      this.currentPage = currentPage;
      this.getTableData();
    },
  }
}
</script>

<style lang="scss" scoped>

</style>

