<template>
  <bm-overlay
    ref="customOverlay"
    class="sample"
    pane="labelPane"
    :style="{color: iconColor}"
    @draw="draw">
    <i class="iconfont" :class="'icon-'+ mapIcon" @click="handleClick"></i>
  </bm-overlay>
</template>

<script>
import mapAPI from '@/api/common/map'

export default {
  props: ['iconFontColor', 'mapIcon', 'position','rowId'],
  data() {
      return {
          lampList:[],
          alarmStyleInterval: '',
          iconColor: '',
      }
  },
  computed: {
    GISTip() {
        return this.$store.state.alarm.GISTip;
      }
    },
  watch: {
    position: {
      handler () {
        this.$refs.customOverlay.reload()
      },
      deep: true
    },
    index: {
      deep: true
    },
    GISTip:function(newd,old){
      console.log(this.rowId+"___"+newd.rowId)
      if(this.rowId == newd.rowId){
        newd.flag?this.setAlarmStyle():this.clearAlarmStyle();
      }
    }
  },
  mounted(){
    this.iconColor = this.iconFontColor
    // this.setAlarmStyle()
  },
  methods: {
    handleClick () {
      this.$emit('headCallBack',this.rowId);
    },
    draw ({el, BMap, map}) {
      const {lng, lat} = this.position
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat))
      el.style.left = pixel.x - 60 + 'px'
      el.style.top = pixel.y - 20 + 'px'
    },
    setAlarmStyle (){
      let alarmTimeOut = this.GLOBAL.alarmTimeOut;
      this.alarmStyleInterval = setInterval(()=>{
        this.iconColor!='red'?this.iconColor='red':this.iconColor = '#fff';
        alarmTimeOut = alarmTimeOut-1000;
        if(alarmTimeOut<0){
          this.clearAlarmStyle();
        }
      },1000)
    },
    clearAlarmStyle (){
      this.iconColor = this.iconFontColor;
      clearInterval(this.alarmStyleInterval);
    }
  }
}
</script>

<style lang="scss">
.sample {
  text-align: center;
  position: absolute;
}
.sample i{
  font-size: 30px;
  cursor: pointer;
  &.icon-tubiao-zhihuidenggan {
    font-weight: bold;
  }
}
</style>