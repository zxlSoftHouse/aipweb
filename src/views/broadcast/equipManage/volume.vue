<template>
  <el-dialog id="volumeDialog" ref="dialog" title="调节音量" 
  :visible.sync="volumeDialog.isHidden" 
  :modal-append-to-body='false' 
  :close-on-click-modal='false'>
		<el-form :inline="true" ref="form" :model="form" label-width="130px">
      <el-form-item label="广播输出音量">
        <el-input v-model="form.bcoutv" type="number" min="0" max="15" style="width:200px;"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button>取 消</el-button>
      <el-button type="primary" @click="edit(form)" :loading="isLoading">确 定</el-button>
    </div>
	</el-dialog>
</template>
<script>
 import equipConfigAPI from '@/api/broadcast/equipConfig'
  export default {
    props: {
      volumeDialog: Object,
      singVolume:Array
    },
    data() {
      return {
        form:{
          terid:null,
          talkinv:9,
          talkoutv: 9,
          bcinv:9,
          bcoutv:null
        },
        isLoading: false,
      }
    },
    methods: {
      edit(form) {
        equipConfigAPI.settervolume(form).then(res=>{
          if(res.res == 1){
            setTimeout(() => {
              this.closeDialog();
              this.refresh();
              this.isLoading = !this.isLoading;
            }, 1500);
          }
        });
      },
      closeDialog() {
        this.$refs['form'].resetFields();
        this.$emit('handleVolumeClose');
      },
      refresh() {
        this.$emit('init');
      }
    },
    watch: {
      singVolume:{
        handler(val, oldVal) {
          if(val.length>0){
            this.form.terid = val[0].id;
            this.form.bcoutv =  val[0].bcoutv;
          }
        },
        deep: true
      }
    }
  }
</script>
<style lang="scss">
  #volumeDialog {
    .el-dialog {
      width: 415px;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 200px;
    }
  }
 
</style>
