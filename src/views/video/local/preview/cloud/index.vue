<template>
  <el-row type="flex" :gutter="10">
    <el-col :span="8" class="yt-direction rel">
      <direction @mouseDownPTZControl="mouseDownPTZControl" @PTZControl="PTZControl"></direction>
    </el-col>
    <el-col :span="10">
      <speed ref="speed"></speed>
    </el-col>
    <el-col :span="6" class="yt-scale">
      <scale @PTZControl="PTZControl"></scale>
    </el-col>
  </el-row>
</template>

<script>
import direction from './direction.vue'
import speed from './speed.vue'
import scale from './scale.vue'
export default {
  methods: {
    // 云台操控
    mouseDownPTZControl(iPTZIndex) {
      this.$emit('mouseDownPTZControl', this.$refs.speed.iPTZSpeed, iPTZIndex);
    },
    PTZControl(iPTZIndex, status) {
      this.$emit('PTZControl', this.$refs.speed.iPTZSpeed, iPTZIndex, status);
    },
  },
  components:{
    direction,
    speed,
    scale
  }
}
</script>

<style>

</style>
