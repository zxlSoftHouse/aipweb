<template>
  <el-dialog id="ledBrightDialog" ref="dialog" title="屏幕亮度" 
  :visible.sync="dialogObj.isShow" 
  :modal-append-to-body='false' 
  :close-on-click-modal='false'
  width="300px"
  @close="closeDialog">
    <el-slider
      :min="1"
      :max="255"
      v-model="value"
      @change="ctrl()"
      show-input>
    </el-slider>
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
        value: null
      }
    },
    methods: {
      closeDialog() {
        this.$emit('handleClose');
      },
      getInfo(id) {
        ledConfAPI.getScreenInfo(this.idList, 4).then(res=>{
          let returnMsg = res.returnList[0].returnMsg;
          this.value = returnMsg.result;
        });
      },
      ctrl() {
        ledConfAPI.ctrlScreen(this.idList, 4, this.value).then(res=>{
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
  #ledBrightDialog {
    .el-dialog__body {
      text-align: center;
    }
  }
</style>
