<template>
  <el-dialog id="ledPowerDialog" ref="dialog" title="屏幕开关" 
  :visible.sync="dialogObj.isShow" 
  :modal-append-to-body='false' 
  :close-on-click-modal='false'
  width="300px"
  @close="closeDialog">
    <el-switch
      v-model="isOn"
      active-text="开"
      inactive-text="关"
      @change="ctrl()"
    >
    </el-switch>
	</el-dialog>
</template>
<script>
  import ledConfAPI from '@/api/led/ledConfAPI'
  export default {
    props: {
      dialogObj: Object,
      idList: Array
    },
    data() {
      return {
        isOn: true
      }
    },
    methods: {
      closeDialog() {
        this.$emit('handleClose');
      },
      getInfo() {
        ledConfAPI.getScreenInfo(this.idList, 1).then(res=>{
          let returnMsg = res.returnList[0].returnMsg;
          this.isOn = returnMsg.result;
        });
      },
      ctrl() {
        ledConfAPI.ctrlScreen(this.idList, 1, this.isOn).then(res=>{
          this.$emit('init');
        })
      }
    },
    watch: {
      dialogObj: {
        handler(val, oldVal) {
          if (val.isShow) {
            this.getInfo();
          }
        },
        deep: true
      }
    }
  }
</script>
<style lang="scss">
  #ledPowerDialog {
    .el-dialog__body {
      text-align: center;
    }
  }
</style>
