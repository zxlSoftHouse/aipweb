<template>
  <div ref="myEchart" :class="className" :style="{height:height,width:width}">
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
    props: {
        className: {
            type: String
        },
        chartData: {
            type: Object
        },
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '100%'
        },
    },
    data() {
        return {
            chart: null
        }
    },
    mounted() {
        setTimeout(() => {
            this.initChart();
        }, 500);
    },
    // beforeDestroy() {
    //     if (!this.chart) {
    //         return
    //     }
    //     this.chart.dispose()
    //     this.chart = null
    // },
    watch:{
        chartData:{
            handler:(nVal, oVal)=>{
                if(this.chart != undefined){
                    this.chart.setOption(this.chartData,true);
                }
            },
            deep:true
        }
    },
    methods: {
        initChart() {
            this.chart = echarts.init(this.$refs.myEchart);
            // 把配置和数据放这里
            this.chart.setOption(this.chartData);
            var vm = this;
            window.addEventListener('resize', function(){ 
                vm.chart.resize();});
        },
        reload(){
            if(this.chart) this.chart.setOption(this.chartData);
        }
    }
}
</script>
