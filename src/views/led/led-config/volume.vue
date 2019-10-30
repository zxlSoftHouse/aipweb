<template>
  <el-dialog id="ledVolumeDialog" ref="dialog" title="音量控制" 
  :visible.sync="dialogObj.isShow" 
  :modal-append-to-body='false' 
  :close-on-click-modal='false'
  width="300px"
  @close="closeDialog">
    <el-slider
      :min="0"
      :max="15"
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
      getInfo() {
        ledConfAPI.getScreenInfo(this.idList, 3).then(res=>{
          let returnMsg = res.returnList[0].returnMsg;
          this.value = returnMsg.result;
        });
      },
      ctrl() {
        ledConfAPI.ctrlScreen(this.idList, 3, this.value).then(res=>{
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
  #ledVolumeDialog {
    .el-dialog__body {
      text-align: center;
    }
  }
</style>
