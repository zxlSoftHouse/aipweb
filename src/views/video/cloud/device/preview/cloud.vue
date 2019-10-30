<template>
  <div class="map-yt-ctrl">
    <div class="yt-direction">
      <speed ref="speed"></speed>
    </div>
    <div style="width: 78px;" class="container">
      <scale @PTZControl="PTZControl"></scale>
    </div>
    <div style="width: 116px;" class="container">
      <direction @mouseDownPTZControl="mouseDownPTZControl" @PTZControl="PTZControl"></direction>
    </div>
  </div>
</template>

<script>
import direction from '@/views/video/local/preview/cloud/direction.vue'
import speed from '@/views/video/local/preview/cloud/speed.vue'
import scale from '@/views/video/local/preview/cloud/scale.vue'
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

<style lang="scss">
  .map-yt-ctrl {
    padding-top: 50px;
    >div:nth-child(2) {
      margin-top: 30px;
      margin-bottom: 30px;
    }
    .yt-direction {
      padding: 0 10px 0 0;
      .el-form-item__label {
      color: #fff;
      }
    }
  }
</style>
