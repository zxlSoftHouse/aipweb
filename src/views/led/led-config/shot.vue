<template>
  <el-dialog id="ledShotDialog" ref="dialog" title="屏幕截图" 
  :visible.sync="dialogObj.isShow" 
  :modal-append-to-body='false' 
  :close-on-click-modal='false'
  width="300px"
  @close="closeDialog">
    <img :src="dialogObj.imgSrc">
	</el-dialog>
</template>
<script>
  import ledConfAPI from '@/api/led/ledConfAPI'
  export default {
    props: {
      dialogObj: Object
    },
    data() {
      return {
      }
    },
    methods: {
      closeDialog() {
        this.$emit('handleClose');
      }
    },
    created() {
    },
    watch: {
    },
    computed: {
    },
  }
</script>
<style lang="scss">
  #ledShotDialog {
    img {
      display: block;
      margin: 0 auto;
      width: 100%;
    }
  }
</style>
