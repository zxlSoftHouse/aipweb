<template>
  <bm-control>
    <el-dialog ref="dialog" title="广播" 
    :visible.sync="dialogVisible" 
    :modal-append-to-body='false' 
    :close-on-click-modal='false'
    @close="dialogVisible = false">
      <span>这是广播</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </bm-control>

</template>

<script>
export default {
  props: {
    rowId: String
  },
  data() {
    return {
      dialogVisible: false,
    }
  },
  methods: {
  }
}
</script>

<style>

</style>
