<template>
  <el-row class="app-container userManage">
    <el-col>
        <el-row>
        <el-col :span="16">
          <el-button
            v-if="hasPerms('org-xz001')"
            type="success"
            @click="doAdd">新增</el-button>
        </el-col>
        <el-col :span="6">
          <el-input type="text" placeholder="请输入公司名称" v-model="orgName"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="getOrgList">搜索</el-button>
        </el-col>
      </el-row>
        <el-table ref="multipleTable" :data="tableList" 
          tooltip-effect="dark" highlight-current-row 
          style="width: 100%" @selection-change="handleSelectionChange" >
            <el-table-column property="orgName" label="公司名称">
            </el-table-column>
            <el-table-column property="respUserId" label="负责人">
            </el-table-column>
            <el-table-column property="createTime" label="创建时间" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.createTime | formatDate }}
              </template>
            </el-table-column>
            <el-table-column property="updateTime" label="更新时间" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.updateTime | formatDate }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" width="270" label="操作" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <el-button v-if="hasPerms('org-sc001')" @click="sureDelete(scope.row.rowId)" type="text">删除</el-button>
                <el-button v-if="hasPerms('org-xg001')" @click="doModify(scope.row)" type="text">修改</el-button>
              </template>
            </el-table-column>
         </el-table>
          <div class="pagination-wrapper">
            <el-pagination @current-change="pagePost" @size-change="pageSizePost"
              :current-page="pageAt" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="recordCount">
            </el-pagination>
          </div>
  
          <!-- 公司信息更新弹出框 -->
          <el-dialog width="40%" :append-to-body="true" :title="dialogTitle" :visible.sync="showDialog" @close="cannelUpdate('ruleForm')">
            <el-form :model="org" :rules="rules" ref="ruleForm" label-width="130px">
              <el-form-item label="公司名称" prop="orgName">
                <el-col :span="8">
                  <el-input size="medium" v-model="org.orgName" auto-complete="off" placeholder=""></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="公司责任人" prop="respUserId">
                <el-col :span="8">
                  <el-input size="medium" v-model="org.respUserId" auto-complete="off" placeholder=""></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="公司logo">
                <el-upload
                  class="avatar-uploader"
                  action="/api/SERVICE-MD/org/upload"
                  :headers="{'access_token':token,'Authorization':'bearer '+token}"
                  :data="{'businessId': businessId}"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cannelUpdate('ruleForm')">取 消</el-button>
              <el-button type="primary" @click="saveOrUpdate(org,'ruleForm')">确 定</el-button>
            </div>
          </el-dialog>
          <el-dialog class="tipDialog" :modal-append-to-body="false" title="提示" :visible.sync="tipDialog" size="tiny">
            <span class="el-icon-circle-check"></span>
            <span class="tipDialogTxt">{{tipDialogTxt}}</span>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="tipDialog = false">确 定</el-button>
            </span>
          </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
import Cookies from 'js-cookie';
import orgApi from '@/api/sysManage/org'
import { parseTime } from '@/utils/index'
import { hasPermission } from '@/permission.js'

export default {
    data() {
        return {
            nowDate:'',
            businessId: '',
            imageUrl: '',
            orgName:'',
            org: {
                rowId:'',
                orgCode:'',
                orgName: '',
                respUserId: '',
                orgType: '',
                businessId: ''
            },
            multipleSelection: [], //checkbox选中集合
            multipleSelectionAllIds: [], //所有选中集合，用于翻页后默认勾选
            searchInput: '',//绑定头部搜索框
            tipDialog: false,
            tipDialogTxt: '',
            dialogTitle: "新增",
            tableList: [],
            recordCount: 0,
            pageSize: 10,
            pageAt: 1,
            showDialog: false,
            showSetDialog: false,
            formLabelWidth: '80px',
            rules: {        
                orgName: [
                    { required: true, message: '请输入公司名称', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
                respUserId: [
                    { required: true, message: '请输入责任人', trigger: 'blur' },
                    { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
                ],
            },
            filterMethod(query, item) {
                return item.roleName.indexOf(query) > -1;
            },
        }
    },

    filters: {
        formatDate(time) {
          let date = new Date(time);
          return parseTime(date,'{y}-{m}-{d}')
        }
    }, 
    computed:{
        token:()=>Cookies.get("access_token")
    },
    methods: {
        getNowTime() {
          let date = new Date();
          this.businessId = date.getTime();
        },
        handleAvatarSuccess(res, file) {
          this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
          const isJPG = file.type === 'image/png';
          const isLt2M = file.size / 1024 / 1024 < 2;

          if (!isJPG) {
            this.$message.error('上传logo图片只能是 png 格式!');
          }
          if (!isLt2M) {
            this.$message.error('上传logo图片大小不能超过 2MB!');
          }
          return isJPG && isLt2M;
        },
        // 根据权限标识和外部指示状态进行权限判断
        hasPerms(perms) {
            return hasPermission(perms) & !this.disabled
        },

        // checkbox点击事件
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },

        // 查询所有公司信息
        getOrgList() {
            let queryList = {
                pageNum : this.pageAt,
                pageSize : this.pageSize,
                orgName: this.orgName
            };
            orgApi.getOrgList(queryList).then((res) => {
                this.recordCount = res.total;
                this.tableList = res.records || []
                setTimeout(()=>{
                    this.$utils.setSelectRow(this.multipleSelectionAllIds,this.$refs.singleTable,this.tableList)   
                }, 200)
            }).catch((err) => {
                console.log('获取数据出现异常');
            });
        },

        doAdd() {
            this.showDialog = true;
            this.dialogTitle = "新增";
            this.org = {
                rowId:'',
                orgCode:'',
                orgName: '',
                respUserId: '',
                orgType: '',
                businessId: ''
            };
            this.getNowTime();
        },

        saveOrUpdate(org, formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.org.businessId = this.businessId;
                    orgApi.editOrg(this.org).then(res => {
                        this.showDialog = false;
                        this.$message({
                            type: 'success',
                            message: this.dialogTitle == "新增" ? '新增成功!' : '修改成功!'
                        });
                        this.getOrgList();
                    }, res => {
                        this.showDialog = false;
                        this.$message.error('数据访问失败，无法执行该操作!');
                    }, false);
                } else {
                    return false;
                }
            });
        },

        // 删除
        sureDelete(rowId) {
            this.$confirm('确定要删除此条记录?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.doDelete(rowId)
                }).catch(() => {
                    this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },

        doDelete(rowId) {
            orgApi.deleteRow(rowId).then(res => {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.getOrgList();
            }, res => {
                this.$message.error('网络异常，无法执行该操作!');
            }, false)
        },

        // 点击修改
        doModify(row) {
            this.showDialog = true;
            this.dialogTitle = "修改";
            this.org = Object.assign(this.org,row);
            this.businessId = this.org.rowId;
            this.imageUrl = this.GLOBAL.imgUrl + this.org.rowId + ".png";
        },

        // 取消更新
        cannelUpdate(formName) {
            this.$refs[formName].resetFields();
            this.showDialog = false;
            this.getOrgList();
        },

        pagePost(val) {
            this.multipleSelectionAllIds = this.$utils.changePageCoreRecordData(this.multipleSelectionAllIds,this.multipleSelection,this.tableList);
            this.pageAt = val;
            this.getOrgList();
        },

        //分页大小
        pageSizePost(val) {
            this.multipleSelectionAllIds = this.$utils.changePageCoreRecordData(this.multipleSelectionAllIds,this.multipleSelection,this.tableList);
            this.pageSize = val;
            this.getOrgList();
        },
    },
    mounted() {
        this.getOrgList();
    }
};
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>