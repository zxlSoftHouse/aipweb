<template>
  <el-dialog id="syncSet" ref="dialog" title="同步设置" 
  :visible.sync="dialogObj.isShow" 
  :modal-append-to-body='false' 
  :close-on-click-modal='false'
  width="460px"
  @close="closeDialog">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="同步类型" prop="time">
        <el-radio v-model="form.time" label="serial">模块</el-radio>
        <el-radio v-model="form.time" label="ntp">网络</el-radio>
      </el-form-item>
      <el-row v-if="form.time == 'serial'">
        <el-form-item label="屏幕亮度" prop="brightness">
          <el-radio v-model="form.brightness" label="serial">同步</el-radio>
          <el-radio v-model="form.brightness" label="none">不做同步</el-radio>
        </el-form-item>
        <el-form-item label="屏幕音量" prop="volume">
          <el-radio v-model="form.volume" label="serial">同步</el-radio>
          <el-radio v-model="form.volume" label="none">不做同步</el-radio>
        </el-form-item>
        <el-form-item label="屏幕开关" prop="screenSwitch">
          <el-radio v-model="form.screenSwitch" label="serial">同步</el-radio>
          <el-radio v-model="form.screenSwitch" label="none">不做同步</el-radio>
        </el-form-item>
        <el-form-item label="同步识别码" prop="identificationCode">
          <el-input clearable v-model.trim="form.identificationCode" placeholder="请输入同步识别码"></el-input>
        </el-form-item>
        <el-form-item label="时间偏移量(毫秒)" prop="delaySync">
          <el-input clearable v-model.trim="form.delaySync" placeholder="请输入时间偏移量"></el-input>
        </el-form-item>
      </el-row>
      <el-form-item v-else label="同步间隔(分钟/次)" prop="checkNtpTime">
        <el-input clearable v-model.trim="form.checkNtpTime" placeholder="请输入同步间隔"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" :loading="isLoading" @click="ctrl()">确 定</el-button>
    </div>
	</el-dialog>
</template>
<script>
  import E from "wangeditor"
  import ledConfAPI from '@/api/led/ledConfAPI'
  export default {
    props: {
      dialogObj: Object,
      idList: Array
    },
    data() {
      return {
        isLoading: false,
        form: {
          time: 'serial',
          brightness: 'none',
          volume: 'none',
          screenSwitch: 'none',
          identificationCode: null,
          delaySync: null,
          checkNtpTime: 10
        },
        rules: {
          identificationCode: [
            { min: 1, max: 50, message: '长度在 1 到 50 个字符' }
          ],
          delaySync: [
            { pattern: /^[1-9]\d{0,4}$/, message: '请输入大于0且不超过10万的整数' }
          ],
          checkNtpTime: [
            { pattern: /^[1-9]\d{0,4}$/, message: '请输入大于0且不超过10万的整数' }
          ]
        }
      }
    },
    methods: {
      closeDialog() {
        this.$refs['form'].resetFields();
        this.$emit('handleClose');
      },
      ctrl() {
        var data = {
          idList: this.idList
        };
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.isLoading = !this.isLoading
            ledConfAPI.ctrlSyncSet(Object.assign(data, this.form)).then(res=>{
              if(res.result){
                this.$message.success('同步设置成功！');
                setTimeout(() => {
                  this.closeDialog();
                  this.isLoading = !this.isLoading;
                }, 1500);
              }else{
                this.$message.error('服务器错误');
                this.isLoading = !this.isLoading;
              }
            });
          }
        });
      }
    },
    watch: {
      dialogObj: {
        handler(val, oldVal) {
          if (val.isShow) {
          }
        },
        deep: true
      },
    }
  }
</script>
<style lang="scss">
  #syncSet {
    .el-form {
      input {
        width: 220px;
      }
    }
    .el-card {
      height: 100%;
      border: 0;
      .el-card__header {
        border-bottom: 0;
        label {
          padding: 10px 50px 10px 0;
          border-bottom: 2px solid #60b8f6;
          font-size: 16px;
        }
      }
      .body {
        .w-e-text-container{
          height: 200px !important;
        }
      }
    }
  }
</style>
