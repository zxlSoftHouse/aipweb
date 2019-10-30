<template>
  <div>
    <div>
      <el-tooltip effect="dark" content="变倍" placement="top">
        <el-button @mousedown.native="PTZControl(10, false)" @mouseup.native="PTZControl(10, true)" class="yt-btn" type="primary" size="mini" icon="el-icon-plus"></el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="变倍" placement="top">
        <el-button @mousedown.native="PTZControl(11, false)" @mouseup.native="PTZControl(11, true)" class="yt-btn" type="primary" size="mini" icon="el-icon-minus"></el-button>
      </el-tooltip>
    </div>
    <div>
      <el-tooltip effect="dark" content="变焦" placement="left">
        <el-button @mousedown.native="PTZControl(12, false)" @mouseup.native="PTZControl(12, true)" class="yt-btn" type="primary" size="mini" icon="el-icon-plus"></el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="变焦" placement="right">
        <el-button @mousedown.native="PTZControl(13, false)" @mouseup.native="PTZControl(12, true)" class="yt-btn" type="primary" size="mini" icon="el-icon-minus"></el-button>
      </el-tooltip>
    </div>
    <div>
      <el-tooltip effect="dark" content="光圈" placement="bottom">
        <el-button @mousedown.native="PTZControl(14, false)" @mouseup.native="PTZControl(14, true)" class="yt-btn" type="primary" size="mini" icon="el-icon-plus"></el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="光圈" placement="bottom">
        <el-button @mousedown.native="PTZControl(15, false)" @mouseup.native="PTZControl(15, true)" class="yt-btn" type="primary" size="mini" icon="el-icon-minus"></el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    PTZControl(iPTZIndex, status) {
      this.$emit('PTZControl', iPTZIndex, status);
    },
  }
}
</script>

<style>

</style>
