<template>
  <div>
    <el-dialog
      ref="dialog"
      :title="editObj.title"
      :visible.sync="editObj.isShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <el-form :inline="true" :model="form" :rules="rules" ref="form" label-width="130px">
        <el-form-item label="用户账号" prop="userCode">
          <el-input v-model="form.userCode" auto-complete="off" placeholder></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" auto-complete="off" placeholder></el-input>
        </el-form-item>
        <el-form-item
          v-if="editObj.title==='新增'"
          label="密码"
          prop="password"
        >
          <el-input
            v-model="form.password"
            type="password"
            auto-complete="off"
            placeholder
          ></el-input>
        </el-form-item>
        <el-form-item
          v-else-if="editObj.title==='修改'"
          label="密码"
          prop="password"
        >
          <el-button size="small" icon="el-icon-edit" @click="showModifyPwdDialog = true">修改密码</el-button>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="form.phone" type="tel" auto-complete="off" placeholder></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio class="radio" v-model="form.sex" label="M">男</el-radio>
          <el-radio class="radio" v-model="form.sex" label="F">女</el-radio>
        </el-form-item>
        <el-form-item v-if="false" label="用户类别" prop="userType">
          <el-select v-model="form.userType" placeholder="请选择类型" filterable>
            <el-option
              v-for="item in userTypes"
              :key="item.codeValue"
              :label="item.codeValue=='500' ? '领导' : item.codeValue=='501' ? '专家' : item.codeValue=='502' ? '维修员' : '管理员'"
              :value="item.codeValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属公司" prop="orgId">
          <el-select
            v-model="form.orgName"
            @change="insertTemplate"
            placeholder="请选择所属公司"
            filterable
          >
            <el-option
              v-for="item in orgData"
              :key="item.rowId"
              :label="item.orgName"
              :value="item.rowId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="edit(form)" :loading="isLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import userApi from "@/api/sysManage/userManage";
export default {
  props: {
    editObj: Object
  },
  data() {
    return {
      isLoading: false,
      userTypes: [],
      form: {
        rowId:'',
        userName: '',
        password: '',
        orgId: '',
        orgName:'',
        sex: 'M',
        phone: '',
        userType: '1',
        statusFlag: ''
      },
      rules: {
        userCode: [
          { required: true, message: '请输入用户账号', trigger: 'blur' },
          { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { validator: checkPlone, trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        userType: [
          { required: true, type: 'string', message: '请选择用户类别', trigger: 'change' }
        ],
        orgId: [
          { required: true, message: '请选择公司', trigger: 'change' }
        ],
      }
    };
  },
  methods: {
    closeDialog() {
      this.$emit("handleEditClose");
      this.$refs["form"].resetFields();
    },
    refresh() {},
    edit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          userApi.addOrUpdate(this.form).then(res => {
            this.showDialog = false;
            this.$message({
              type: 'success',
              message: this.editObj.title == "新增" ? '新增成功!' : '修改成功!'
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
    getInfo(id) {}
  },
  created() {},
  watch: {
    editObj: {
      handler(val, oldVal) {},
      deep: true
    }
  }
};
</script>
<style lang="scss">
</style>
