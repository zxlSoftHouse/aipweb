<template>
<el-row class="app-container videoCloudAccount">
  <el-col>
    <div class="title">
      视频账户设置
    </div>
    <el-form ref="form" :model="form" :inline="true" :rules="rules" label-width="130px">
      <el-form-item label="名称" prop="accountName">
        <el-input clearable v-model.trim="form.accountName" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="设备类型" prop="deviceType">
        <el-select v-model.trim="form.deviceType" filterable clearable placeholder="请选择设备类型">
          <el-option label="海康监控" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="APPKey" prop="appKey">
        <el-input clearable v-model.trim="form.appKey" placeholder="APPKey 萤石云平台我的应用里面获取"></el-input>
      </el-form-item>
      <el-form-item label="Secret" prop="secret">
        <el-input clearable v-model.trim="form.secret" placeholder="Secret 萤石云平台我的应用里面获取"></el-input>
      </el-form-item>
      <el-form-item label="云平台账号" prop="account">
        <el-input clearable v-model.trim="form.account" placeholder="请输入 萤石云平台账号"></el-input>
      </el-form-item>
      <el-form-item label="云平台密码" prop="password">
        <el-input clearable v-model.trim="form.password" placeholder="请输入 萤石云平台密码"></el-input>
      </el-form-item>
      <el-form-item label="AccessToken" prop="accessToken">
        <el-input style="width: 944px;" clearable v-model.trim="form.accessToken" readonly placeholder="若要更改 Token 请点击获取 Token 按钮"></el-input>
      </el-form-item>
      <el-form-item label="过期时间" prop="overdueTime">
        <el-date-picker
          readonly
          v-model="form.overdueTime"
          type="datetime"
          placeholder="若要更改过期时间请点击获取 Token 按钮">
        </el-date-picker>
      </el-form-item>
      <br>
      <el-form-item class="form-textarea" label="备注" prop="remark">
        <el-input type="textarea" v-model="form.remark" placeholder="请输入备注"></el-input>
      </el-form-item>
      <div>
        <el-button type="primary" style="margin-left: 130px;" @click="edit(form)">确 定</el-button>
        <el-button @click="getToken(form)">
          <i class="iconfont icon-huoqujihuoma"></i>
          获取Token
        </el-button>
      </div>
    </el-form>
  </el-col>
</el-row>
</template>
<script>
  import accountAPI from '@/api/video/videoAccount'
  export default {
    data() {
      return {
        form: {
          rowId: '',
          projectId: '',
          accountName: '',
          deviceType: '',
          appKey: '',
          secret: '',
          account: '',
          password: '',
          accessToken: '',
          overdueTime: '',
          remark: ''
        },
        rules: {
          accountName: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符' }
          ],
          deviceType: [
            { required: true, message: '请选择设备类型', trigger: 'blur' }
          ],
          appKey: [
            { required: true, message: '请输入 APPKey', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符' }
          ],
          secret: [
            { required: true, message: '请输入 Secret', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符' }
          ],
          account: [
            { required: true, message: '请输入云平台账号', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符' }
          ],
          password: [
            { required: true, message: '请输入云平台密码', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符' }
          ],
        }
      }
    },
    computed: {
      projectId() {
        if (this.$store.state.project.projectId) {
          return this.$store.state.project.projectId;
        } else {
          return '-1';
        }
      }  
    },
    methods: {
      getInfo() {
        accountAPI.getOne({projectId: this.projectId}).then(res=>{
          if (res) {
            this.form = res;
          } else {
            this.form = {};
          }
        });
      },
      getToken(form) {
        accountAPI.getToken(form).then(res=>{
          if (res.status == 1) {
            this.$message({
              type: 'success',
              message: '获取 Token 成功'
            });
            this.getInfo();
          } else {
            this.$message.error('服务器错误');
          }
        });
      },
      edit(form) {
        this.form.projectId = this.projectId;
        this.$refs['form'].validate((valid) => {
          if (valid) {
            accountAPI.addOrEdit(form).then(res=>{
              if(res){
                this.$message({
                  type: 'success',
                  message: '保存成功'
                });
                this.getInfo();
              }else{
                this.$message.error('服务器错误');
              }
            })
          }
        });
      },
      initDataByProjectId() {
        this.getInfo();
      }
    },
    mounted() {
      this.initDataByProjectId();
    },
    watch: {
      projectId(val, oldVal) {
        this.getInfo();
      }
    },
    components:{
    },
  }
</script>
<style lang="scss">
  .videoCloudAccount {
    form {
      // width: 800px;
      .el-form-item__label {
        background: #ececec;
        border: 1px solid #ddd;
        border-right: 0;
        text-align: center;
      }
      .form-textarea {
        .el-form-item__label {
          line-height: 98px;
        }
      }
      .el-input {
        width: 400px;
        .el-input__inner {
          height: 38px;
          line-height: 38px;
          border-radius: 0 !important;
        }
      }
      .el-textarea {
        width: 400px;
        .el-textarea__inner {
          height: 100px;
          border-radius: 0 !important;
        }
      }
      .icon-huoqujihuoma {
        position: relative;
        top: 1px;
      }
    }
  }
</style>
