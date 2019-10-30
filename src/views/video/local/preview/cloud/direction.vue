<template>
  <div class="rel">
    <div>
      <el-button @mousedown.native="mouseDownPTZControl(5)" @mouseup.native="PTZControl(5, true)" class="yt-btn yt-lt" type="primary" size="mini" icon="el-icon-caret-top"></el-button>
      <el-button @mousedown.native="mouseDownPTZControl(1)" @mouseup.native="PTZControl(1, true)" class="yt-btn yt-t" type="primary" size="mini" icon="el-icon-caret-top"></el-button>
      <el-button @mousedown.native="mouseDownPTZControl(7)" @mouseup.native="PTZControl(7, true)" class="yt-btn yt-rt" type="primary" size="mini" icon="el-icon-caret-right"></el-button>
    </div>
    <div>
      <el-button @mousedown.native="mouseDownPTZControl(3)" @mouseup.native="PTZControl(3, true)" class="yt-btn yt-l" type="primary" size="mini" icon="el-icon-caret-left"></el-button>
      <el-button @click="mouseDownPTZControl(9)" class="yt-btn yt-refresh" type="primary" size="mini" icon="el-icon-refresh"></el-button>
      <el-button @mousedown.native="mouseDownPTZControl(4)" @mouseup.native="PTZControl(4, true)" class="yt-btn yt-r" type="primary" size="mini" icon="el-icon-caret-right"></el-button>
    </div>
    <div>
      <el-button @mousedown.native="mouseDownPTZControl(6)" @mouseup.native="PTZControl(6, true)" class="yt-btn yt-lb" type="primary" size="mini" icon="el-icon-caret-left"></el-button>
      <el-button @mousedown.native="mouseDownPTZControl(2)" @mouseup.native="PTZControl(2, true)" class="yt-btn yt-b" type="primary" size="mini" icon="el-icon-caret-bottom"></el-button>
      <el-button @mousedown.native="mouseDownPTZControl(8)" @mouseup.native="PTZControl(8, true)" class="yt-btn yt-rb" type="primary" size="mini" icon="el-icon-caret-bottom"></el-button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    mouseDownPTZControl(iPTZIndex) {
      this.$emit('mouseDownPTZControl', iPTZIndex);
    },
    PTZControl(iPTZIndex, status) {
      this.$emit('PTZControl', iPTZIndex, status);
    },
  }
}
</script>

<style lang="scss">
  .yt-btn {
    padding: 7px;
    margin-bottom: 10px;
    &.yt-lt,
    &.yt-rt,
    &.yt-lb,
    &.yt-rb {
      i {
        transform: rotate(-45deg);
      }
    }
  }
</style>
