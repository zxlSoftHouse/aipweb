<template>
  <el-row class="app-container userManage">
    <el-col>
      <el-row>
        <el-col :span="16">
          <el-button
            v-if="hasPerms('um-xz001')"
            type="success"
            @click="handleAdd">新增
          </el-button>
          <el-button
            @click="handleEdit">编辑
          </el-button>
        </el-col>
        <el-col :span="6">
          <el-input type="text" placeholder="请输入用户账号或用户名" v-model="userName"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="getUserList">搜索</el-button>
        </el-col>
      </el-row>
      <el-table 
      ref="multipleTable" 
      :data="tableList" 
      tooltip-effect="dark" highlight-current-row 
      style="width: 100%" 
      @selection-change="handleSelectionChange" >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column property="userCode" label="用户账号">
        </el-table-column>
        <el-table-column property="userName" label="用户名">
        </el-table-column>
        <el-table-column property="orgName" label="所属公司">
        </el-table-column>
        <el-table-column property="sex" label="性别">
          <template slot-scope="scope">
            {{scope.row.sex=='M' ? '男' : scope.row.sex=='F'? '女': '未知'}}
          </template>
        </el-table-column>
        <el-table-column property="phone" label="手机号" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.phone ? scope.row.phone : '暂无'}}
          </template>
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
            <el-button v-if="hasPerms('um-sc001')" @click="sureDelete(scope.row.rowId)" type="text">删除</el-button>
            <el-button v-if="hasPerms('um-xg001')" @click="doModify(scope.row)" type="text">修改</el-button>
            <el-button v-if="hasPerms('um-qx001')" @click="setRow(scope.row)" type="text">权限设置</el-button>
          </template>
        </el-table-column>
      </el-table>
       <!-- @size-change="pageSizePost"
          :current-page="pageAt"  -->
      <div class="pagination-wrapper">
        <el-pagination 
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        @current-change="current_change">
        </el-pagination>
      </div>
  
          <!-- 个人信息更新弹出框 -->
          <el-dialog width="40%" :append-to-body="true" :title="dialogTitle" :visible.sync="showDialog" @close="cannelUpdate('ruleForm')">
            <!-- 修改密码 嵌套dialog-->
            <el-dialog
              width="30%"
              title="修改密码"
              :visible.sync="showModifyPwdDialog"
              :append-to-body="true">
              <el-form :model="modifyPwd" :rules="modifyPwdRules" ref="modifyPwdForm">
                <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPwd">
                  <el-col :span="8">
                    <el-input size="medium" v-model="modifyPwd.newPwd" type="password" @focus="modifyPwd.newPwd=''" auto-complete="off" placeholder=""></el-input>
                  </el-col>
                </el-form-item>      
                <el-form-item label="确认密码" :label-width="formLabelWidth" prop="confirmPwd">
                  <el-col :span="8">
                    <el-input size="medium" v-model="modifyPwd.confirmPwd" type="password" @focus="modifyPwd.confirmPwd=''" auto-complete="off" placeholder=""></el-input>
                  </el-col>
                </el-form-item>         
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="showModifyPwdDialog=false">取 消</el-button>
                <el-button type="primary" @click="doModifyPwd()">确 定</el-button>
              </div>
            </el-dialog>
            <el-form :model="user" :rules="rules" ref="ruleForm">
              <el-form-item label="用户账号" :label-width="formLabelWidth" prop="userCode">
                <el-col :span="8">
                  <el-input size="medium" v-model="user.userCode" auto-complete="off" placeholder=""></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="用户名" :label-width="formLabelWidth" prop="userName">
                <el-col :span="8">
                  <el-input size="medium" v-model="user.userName" auto-complete="off" placeholder=""></el-input>
                </el-col>
              </el-form-item>
              <el-form-item v-if="dialogTitle==='新增'" label="密码" :label-width="formLabelWidth" prop="password">
                <el-col :span="8">
                  <el-input size="medium" v-model="user.password" type="password" auto-complete="off" placeholder=""></el-input>
                </el-col>
              </el-form-item>
              <el-form-item v-else-if="dialogTitle==='修改'" label="密码" :label-width="formLabelWidth" prop="password">
                <el-col :span="8">
                  <el-button size="small" icon="el-icon-edit" @click="showModifyPwdDialog = true" >修改密码</el-button>
                </el-col>
              </el-form-item>
              <el-form-item label="联系方式" :label-width="formLabelWidth" prop="phone">
                <el-col :span="8">
                  <el-input size="medium" v-model="user.phone" type="tel" auto-complete="off" placeholder=""></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
                <el-col :span="8">
                  <el-radio class="radio" v-model="user.sex" label="M">男</el-radio>
                  <el-radio class="radio" v-model="user.sex" label="F">女</el-radio>
                </el-col>
              </el-form-item>
              <el-form-item v-if="false" label="用户类别" :label-width="formLabelWidth" prop="userType">
                <el-select v-model="user.userType" placeholder="请选择类型" filterable>
                  <el-option v-for="item in userTypes" :key="item.codeValue" :label="item.codeValue=='500' ? '领导' : item.codeValue=='501' ? '专家' : item.codeValue=='502' ? '维修员' : '管理员'" :value="item.codeValue">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属公司" :label-width="formLabelWidth" prop="orgId">
                <el-select v-model="user.orgName" @change="insertTemplate" placeholder="请选择所属公司" filterable>
                  <el-option v-for="item in orgData" :key="item.rowId" :label="item.orgName" :value="item.rowId"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cannelUpdate('ruleForm')">取 消</el-button>
              <el-button type="primary" @click="saveOrUpdate(user,'ruleForm')">确 定</el-button>
            </div>
          </el-dialog>
          <!-- 权限设置弹出框 -->
          <el-dialog width="30%" :modal-append-to-body="false" class="moreSel-dialog" title="权限设置" :visible.sync="showSetDialog">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="角色权限" name="first">
                        <el-select v-model="roleIds" placeholder="请选择要给该人员分配的权限角色" multiple>
                            <el-option v-for="item in roleData" :key="item.rowId" :label="item.roleName" :value="item.rowId">
                            </el-option>
                        </el-select>
                        <el-button @click="cannelSet">取 消</el-button>
                        <el-button type="primary" @click="postSet">确 定</el-button>
                    </el-tab-pane>
                    <el-tab-pane label="项目权限" name="second">
                        <el-select v-model="prjIds" placeholder="请选择要给该人员分配的权限项目" multiple>
                            <el-option v-for="item in prjData" :key="item.rowId" :label="item.projectName" :value="item.rowId">
                            </el-option>
                        </el-select>
                        <el-button @click="cannelSet">取 消</el-button>
                        <el-button type="primary" @click="prjSet">确 定</el-button>
                    </el-tab-pane>
                </el-tabs>
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
import userApi from '@/api/sysManage/userManage'
import { parseTime } from '@/utils/index'
import projectApi from '@/api/config/projectConf'
import projectUserRelApi from '@/api/config/projectUserRel'
import roleApi from '@/api/sysManage/role'
import orgApi from '@/api/sysManage/org'
import SelectTree from '@/components/select-tree/index';
import { hasPermission } from '@/permission.js'

export default {
  data() {
    const checkPlone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入合法的手机号码'));
      }
      setTimeout(() => {
        if (!(/^1[34578]\d{9}$/.test(value))) {
          callback(new Error('请输入合法的手机号码'));
        } else {
          callback();
        }
      }, 100);
    };
    const validatePass = (rule, value, callback) => {
      let otherPwd=''; //对比的另一条密码
      rule.field==="newPwd"? otherPwd = this.modifyPwd.confirmPwd : otherPwd = this.modifyPwd.newPwd
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== otherPwd  && otherPwd!=='') {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      orgName: '',
      orgData: [],
      activeName: 'first',
      prjIds: [],
      prjData: [],
      multipleSelection: [], //checkbox选中集合
      multipleSelectionAllIds: [], //所有选中集合，用于翻页后默认勾选
      searchInput: '',//绑定头部搜索框
      tipDialog: false,
      tipDialogTxt: '',
      dialogTitle: "新增",
      roleData: [],
      userId: 0,
      roleIds: [],
      roleProps: {
        key: 'rowId',
        label: 'roleName'
      },
      userName: '',
      tableList: [],
      total: 0,
      pageSize: 10,
      pageAt: 1,
      showDialog: false,
      showModifyPwdDialog: false,
      showSetDialog: false,
      company: [],
      orgs: [],
      militaryranks: [],
      posts: [],
      userTypes: [],
      user: {
        rowId:'',
        userName: '',
        password: '',
        orgId: '',
        orgName:'',
        sex: 'M',
        userType: '1',
        phone: '',
        statusFlag: ''
      },
      modifyPwd:{
        newPwd:'',
        confirmPwd:''
      },
      formLabelWidth: '80px',
      rules: {        
        userCode: [
          { required: true, message: '请输入用户账号', trigger: 'blur' },
          { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        orgId: [
          { required: true, message: '请选择公司', trigger: 'change' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        userLevel: [
          { required: true, message: '请输入用户等级', trigger: 'change' }
        ],
        userType: [
          { required: true, type: 'string', message: '请选择用户类别', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { validator: checkPlone, trigger: 'blur' }
        ],
        introduction: [
          { required: true, message: '请输入个人简介', trigger: 'blur' },
        ],
      },
      modifyPwdRules: {
        newPwd:{
          required: true,
          trigger: ['blur', 'change'],
          validator: validatePass
        },
        confirmPwd:{
          required: true,
          trigger: ['blur', 'change'],
          validator: validatePass
        }
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
  methods: {
    insertTemplate(v) {
      this.orgData.map(e => {
        if (e.rowId == v) {
          this.user.orgId = e.rowId;
          this.user.orgName = e.orgName;
        }
      });
    },

    // 根据权限标识和外部指示状态进行权限判断
    hasPerms(perms) {
        return hasPermission(perms) & !this.disabled
    },

    handleClick(tab, event) {
        console.log(tab, event);
    },
    // 查询指定用户权限
    getPrjSelect() {
      projectUserRelApi.queryByInfo( {userId: this.user.rowId } ).then(res => {        
        this.prjIds=[];
        res.map(it=>{
          this.prjIds.push(it.projectId);
        })
        this.getAllProject();
      }, res => {
      }, false);
    },
    // add查询所有能看到的项目
    getAllProject() {
        projectApi.queryList().then(res => {
            this.prjData = res;
        }, res => {
        }, false);
    },


    // checkbox点击事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //查询所有用户
    getUserList() {
      let queryList = {
        pageNum : this.pageAt,
        pageSize : this.pageSize,
        commonCondition: this.userName
      };
      userApi.getUserList(queryList).then((res) => {
        this.total = res.total;
        this.tableList = res.records || []
        setTimeout(()=>{
          this.$utils.setSelectRow(this.multipleSelectionAllIds,this.$refs.singleTable,this.tableList)   
        }, 200)
      }).catch((err) => {
        console.log('获取数据出现异常');
      });
    },

    getCompany() {
      orgApi.getAllOrgList({}).then((res) => {
        this.orgData = res;
      });
    },

    getDepartment() { //部门
      var vm = this;
      if(vm.user.companyName == ''||vm.user.companyId == ''){
        vm.$message.info('请先选择单位！')
      }else {
        global.post(api.department, {}, {params:{nullable:`COMPANY_ID=${vm.user.companyId}`}}, function(res) {
          let orgs = vm.toHump(res.body);
          vm.orgs = orgs;    
        }, function(err) {
          console.info(err);
        }, false)  
      }
    },
    getOrgs() {
      global.post(api.getOrg, {}, {}, res => {
      }, res => {
      }, false);
    },

    getPosts() {//职务
      global.post(api.getPost, {}, {}, res => {
        this.posts = res.body;
      }, res => {
      }, false);
    },

    getMilitaryranks() {
      global.post(api.getMilitaryrank, {}, {}, res => {
        this.militaryranks = res.body;
      }, res => {
      }, false);
    },

    getUserTypes() {
      global.post(api.getUserType, {}, {}, res => {
        this.userTypes = this.toHump(res.body);
      }, res => {
      }, false);
    },

    doRefresh() {
      this.pageAt = 1;
      this.getUserList();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    handleAdd() {
      this.showDialog = true;
      this.dialogTitle = "新增";
      this.user = {
        userName: '',
        password: '',
        orgId: '',
        orgName:'',
        sex: 'M',
        userType: '',
        phone: '',
        statusFlag: '1'
      };
    },
    handleEdit() {
      if (this.multipleSelection.length != 0) {
        if(this.multipleSelection.length === 1){
          this.user = Object.assign(this.multipleSelection[0]);
          this.showDialog = true;
          this.dialogTitle = "编辑";
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
    saveOrUpdate(user, formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          userApi.addOrUpdate(this.user).then(res => {
            this.showDialog = false;
            this.$message({
              type: 'success',
              message: this.dialogTitle == "新增" ? '新增成功!' : '修改成功!'
            });
            this.getUserList();
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
      userApi.deleteRow(rowId).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.getUserList();
      }, res => {
        this.$message.error('网络异常，无法执行该操作!');
      }, false)
    },

    // 点击修改
    doModify(row) {
      this.showDialog = true;
      this.dialogTitle = "修改";
      this.user = Object.assign(this.user,row);
      console.log(this.user);
    },

    cannelUpdate(formName) {
      this.$refs[formName].resetFields();
      this.showDialog = false;
      this.getUserList();
    },

    //  查询指定用户权限
    getHasSelect() {
      roleApi.queryByInfo( {userId: this.user.rowId } ).then(res => {        
        this.roleIds=[];
        res.map(it=>{
          this.roleIds.push(it.roleId);
        })
        this.getAllSelect();
      }, res => {
      }, false);
    },

    // 查询所有权限
    getAllSelect() {
      roleApi.queryList( {} ).then(res => {
        this.roleData = res;
      }, res => {
      }, false);
    },

    //点击权限设置
    setRow(row) {
      this.showSetDialog = true;
      this.user = Object.assign(this.user, row);
      this.getHasSelect();
      this.getPrjSelect();
    },

    // 保存权限设置
    postSet() {
      this.showSetDialog = false;
      roleApi.saveByUserId(this.user.rowId, this.roleIds).then(res => {
        this.$message({
          type: 'success',
          message: '分配权限成功!'
        });
      }, res => {
        this.$message.error('网络异常，无法执行该操作!');
      }, false);
    },

    // 保存项目权限设置
    prjSet() {
        this.showSetDialog = false;
        let data = {
            userId : this.user.rowId,
            prjIds : this.prjIds
        }
        projectUserRelApi.saveByPrjId(data).then(res => {
            this.$message({
            type: 'success',
            message: '分配权限成功!'
            });
        }, res => {
            this.$message.error('网络异常，无法执行该操作!');
        }, false);
    },

    //确认修改密码
    doModifyPwd(){
      this.$refs['modifyPwdForm'].validate((valid) => {
        if (valid) {
          this.$confirm('确定修改用户密码?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            userApi.modifyPwd(this.user.rowId, this.modifyPwd.confirmPwd).then(res => {
              this.$message({
                type: 'success',
                message: '密码修改成功!'
              });
              this.showModifyPwdDialog = false;
            }, res => {
              this.$message.error('网络异常，无法执行该操作!');
            }, false);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      })
      
    },

    cannelSet() {
      this.showSetDialog = false;
    },

    current_change(val) {
      this.multipleSelectionAllIds = this.$utils.changePageCoreRecordData(this.multipleSelectionAllIds,this.multipleSelection,this.tableList);
      this.pageAt = val;
      this.getUserList();
    },

    //分页大小
    pageSizePost(val) {
      this.multipleSelectionAllIds = this.$utils.changePageCoreRecordData(this.multipleSelectionAllIds,this.multipleSelection,this.tableList);
      this.pageSize = val;
      this.getUserList();
    },

    toHump(data) {
      let new_arr = []
      data.forEach(function(item, i, array) {
        let obj = {}
        for (let key in item) {
          let lower_key = key.toLocaleLowerCase();
          let result_key = lower_key.split('_').reduce(function(a, b) {
            return a + b[0].toUpperCase() + b.substr(1)
          })
          obj[result_key] = item[key]
        }
        new_arr.push(obj)
      })
      return new_arr;
    }
  },

  mounted() {
    this.getUserList();
    this.getCompany();
  }
};
</script>