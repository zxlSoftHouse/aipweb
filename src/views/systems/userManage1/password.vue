<template>
  <div>
    <el-dialog
      ref="dialog"
      title="修改密码"
      :visible.sync="psdObj.isShow"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <el-form :inline="true" :model="form" :rules="rules" ref="form" label-width="130px">
        <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPwd">
          <el-input v-model="form.newPwd" type="password" @focus="form.newPwd=''" auto-complete="off" placeholder=""></el-input>
        </el-form-item>      
        <el-form-item label="确认密码" :label-width="formLabelWidth" prop="confirmPwd">
          <el-input v-model="form.confirmPwd" type="password" @focus="form.confirmPwd=''" auto-complete="off" placeholder=""></el-input>
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
    psdObj: Object
  },
  data() {
    return {
      isLoading: false,
      form: {
        newPwd:'',
        confirmPwd:''
      },
      rules: {
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
      }
    };
  },
  methods: {
    closeDialog() {
    },
    edit(form) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$confirm('确定修改用户密码?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            userApi.modifyPwd(this.psdObj.rowId, this.form.confirmPwd).then(res => {
              this.$message({
                type: 'success',
                message: '密码修改成功!'
              });
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
    getInfo(id) {}
  },
  created() {},
  watch: {
    psdObj: {
      handler(val, oldVal) {},
      deep: true
    }
  }
};
</script>
<style lang="scss">
</style>
