<template>
  <el-dialog id="devOpsDialog" ref="dialog" :title="dialogObj.title" 
  :visible.sync="dialogObj.isShow" 
  :modal-append-to-body='false' 
  :close-on-click-modal='false'
  @close="closeDialog">
		<el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="姓名" prop="userName">
        <el-input clearable v-model.trim="form.userName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input clearable v-model.trim="form.telNum" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="邮箱地址">
        <el-input clearable v-model.trim="form.emailAddress" placeholder="请输入邮箱地址"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="edit(form)" :loading="isLoading">确 定</el-button>
    </div>
	</el-dialog>
</template>
<script>
  import devOpsConfAPI from '@/api/config/devOpsConf'
  export default {
    props: {
      dialogObj: Object
    },
    data() {
      return {
        isLoading: false,
        form: {
          rowId: null,
          userName: null,
          telNum: null,
          emailAddress: null
        },
        rules: {
          userName: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      closeDialog() {
        this.$refs['form'].resetFields();
        this.$emit('handleClose');
      },
      refresh() {
        this.$emit('init');
      },
      edit(form) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.isLoading = !this.isLoading
            devOpsConfAPI.addOrEdit(form).then(res=>{
              if(res){
                this.$message({
                  type: 'success',
                  message: this.dialogObj.title == '新增' ? '新增成功' : '修改成功'
                });
                setTimeout(() => {
                  this.closeDialog();
                  this.refresh();
                  this.isLoading = !this.isLoading;
                }, 1500);
              }else{
                this.$message.error('服务器错误');
                this.isLoading = !this.isLoading;
              }
            })
          }
        });
      },
      getInfo(id) {
        devOpsConfAPI.getItem(id).then(res=>{
          for (let k in this.form) {
            this.form[k] = res[k];
          }
        });
      }
    },
    created() {
    },
    watch: {
      dialogObj: {
        handler(val, oldVal) {
          if (val.isShow) {
            if (val.rowId) {
              this.getInfo(val.rowId);
            }
          }
        },
        deep: true
      }
    }
  }
</script>
<style lang="scss">
  #devOpsDialog {
    .el-dialog {
      width: 500px;
      .el-form {
        width: 420px;
        margin: 0 auto;
        input {
          width: 220px;
        }
      }
    }
  }
</style>
