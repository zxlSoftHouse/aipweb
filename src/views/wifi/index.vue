<template>
  <div class="wifiPage">
    <el-row class="top" :gutter="35">
      <el-col>
        <el-card>
          <div class="card-lf">
            <em style="color: #aa60f6;">{{dayPer}}</em>
            <br>
            <span>今日人数</span>
          </div>
        </el-card>
      </el-col>
      <el-col class="card-sec">
        <el-card>
          <div class="card-lf">
            <em style="color: #6dd77e;">{{dayCon}}</em>
            <br>
            <span>今日连接时长</span>
          </div>
        </el-card>
      </el-col>
      <el-col class="card-three">
        <el-card>
          <div class="card-lf">
            <em style="color: #fa77f8;">{{dayAmo}}</em>
            <br>
            <span>今日连接次数</span>
          </div>
        </el-card>
      </el-col>
      <el-col style="padding-right: 17px;">
        <el-card>
          <div class="card-lf">
            <em style="color: #60b8f6;">{{allPer}}</em>
            <br>
            <span>累积人数</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="35" class="bottom">
      <el-col class="item-list">
        <el-card class="newsDiv">
          <div>
            <span class="spanSize">AP数量</span>
            <em class="emStyle">{{apAmount}}</em>
          </div>
        </el-card>
        <el-card class="raphDiv">
          <div slot="header" class="header-top">
            <span class="spanSize">当前连接设备</span>
            <em class="emStyle">{{connNum}}</em>
          </div>
          <div class="equipList">
            <div>
              <span class="spanSize">MAC地址</span>
              <em class="emStyle">连接时长</em>
            </div>
            <div v-for="(item,index)  in conList">
              <span class="spanSize">{{item.mac}}</span>
              <em class="emStyle">{{item.connectTime}}</em>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" class="projectDiv">
        <el-card>
          <div :style="{width: '100%', height: '620px'}" id="myChart">
            <echart :chartData="lineOption"></echart>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import wifiConfigAPI from '@/api/wifi/wifiConfig'
import echart from '@/components/echart/index'
export default {
  data() {
    return {
      allPer:'',
      apAmount:'',
      dayAmo:'',
      dayCon:'',
      dayPer:'',
      connNum:'',
      conList:[],
      lineList:[],
      lineOption:{
        title: {text: '统计图'},
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data:['人数','连接时长'],
          x: 'right',
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '3%',
          top: '25%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: [],
          // axisLabel:{
          //   rotate: -40,
          //   interval: 0
          // },
          splitLine:{
						show:false
					}
        },
        yAxis: {
          type: 'value',
          splitLine:{
						show:false
					}
        },
        series: [
          {
            name:'人数',
            type:'line',
            stack: '总量',
            color: '#aa60f6',
            data:[]
          },
          {
            name:'连接时长',
            type:'line',
            stack: '总量1',
            color: '#6dd77e',
            data:[]
          }
        ]
      }
    };
  },
  computed:{
    getWebsockCode() {
      return this.$store.state.websock.returnCode;
    }
  },
  watch: {
    getWebsockCode(newer, older) {
      if (newer.code == 'wifi') {
        this.$store.dispatch('RESET_CODE');
        this.conList = newer.conList;
        this.connNum = newer.newer;
      }
    }
  },
  methods: {

      getDataList() {
        wifiConfigAPI.getList().then(res=>{
          this.lineList = res.data.chartList;
          this.allPer = res.data.allPer;
          this.apAmount = res.data.apAmount;
          this.dayAmo = res.data.dayAmo;
          this.dayCon = res.data.dayCon;
          this.dayPer = res.data.dayPer;
          for(var i=0;i<this.lineList.length;i++){
            // dataArr.push(this.lineList[i].date)
            // conTimeArr.push(this.lineList[i].conTime)
            // dayPerCountArr.push(this.lineList[i].dayPerCount)
            this.lineOption.xAxis.data.push(this.lineList[i].date)
            this.lineOption.series[0].data.push(this.lineList[i].dayPerCount)
            this.lineOption.series[1].data.push(this.lineList[i].conTime)
          }
        });
      },
  },
  mounted() {
    this.getDataList()
  },
  components: {
    echart
  }
};
</script>

<style lang="scss" scope>
.wifiPage {
  .el-row {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  .top {
    margin-bottom: 10px;
    padding: 25px 10px;
    .el-col {
      width: 22%;
      padding-left: 15px!important;
      padding-right: 10px!important;
    }
    .card-sec {
      margin-right: 40px;
      margin-left: 40px;
    }
    .card-three {
      margin-right: 40px;
    }
    .el-card {
      color: #fff;
      .el-card__body {
        padding: 0;
        overflow: hidden;
        height: 140px;
        .card-lf {
          float: left;
          line-height: 28px;
          margin-left: 40%;
          text-align: center;
          margin-top: 35px;
          em {
            font-size: 28px;
          }
          span {
            color: #484848;
            font-size: 16px;
            display: inline-block;
            margin-top: 20px;
          }
        }
      }
    }
  }
  .bottom {
    .item-list {
      width: 21%;
      margin-left: 1%;
      margin-right: 1%;
    }
    .el-col {
      padding-left: 5px !important;
      padding-right: 5px !important;
      .spanSize {
        font-size: 16px; 
      }
      .emStyle {
        display: inline-block;
        float: right;
        font-size: 15px;
      }
      .newsDiv {
        margin-bottom: 10px;
      }
      &.projectDiv {
        .el-card__body {
          padding: 0 0 80px !important;
          .title {
            float: left;
            padding: 18px 20px;
          }
        }
      }
      .raphDiv {
        height: 630px;
        overflow-y: auto;
        .el-card__body {
          padding-top: 10px!important;
        }
      }
    }
    .equipList {
      div {
        line-height: 60px;
      }
    }
  }
  #myChart {
    padding-left: 30px;
    padding-top: 30px;
  }
}
</style>
