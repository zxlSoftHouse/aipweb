<template>
  <el-main id="bigScreenMain">
    <el-row>
      <el-col :span="5" style="padding-right: 5px;">
        <el-card class="box-equipment-statistics">
          <div slot="header">
            <span>设备统计</span>
          </div>
          <div>
            <echart :chartData="deviceOption" :className="alarm_analysis_chart"></echart>
          </div>
        </el-card>
        <el-card class="box-env-monitor">
          <div slot="header">
            <span>环境监测</span>
          </div>
          <div>
            <div class="left">
              <em>27</em>
              <br>温度
            </div>
            <ul class="right">
              <li>
                <i class="icon-circle"></i>
                PM2.5
                <br>
                <em>0 ug/m3</em>
              </li>
              <li>
                <i class="icon-circle"></i>
                PM10
                <br>
                <em>0 ug/m3</em>
              </li>
            </ul>
            <el-row class="bottom">
              <el-col :span="8">
                <img src="@/assets/images/noise.png" alt>
                <label for>
                  噪声
                  <br>
                  <em>0 dB</em>
                </label>
              </el-col>
              <el-col :span="8">
                <img src="@/assets/images/hum.png" alt>
                <label for>
                  湿度
                  <br>
                  <em>0 RH</em>
                </label>
              </el-col>
              <el-col :span="8">
                <img src="@/assets/images/air-pressure.png" alt>
                <label for>
                  气压
                  <br>
                  <em>0 kPa</em>
                </label>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card class="box-alarm-analysis">
          <div slot="header">
            <span>一键告警TOP5</span>
          </div>
          <div>
            <echart :chartData="alertOption" :className="alarm_analysis_chart"></echart>
          </div>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card class="box-map">
          <bmap :setMarker="false" :mapInfo="mapInfo"></bmap>
        </el-card>
        <el-row>
          <el-col :span="12" style="padding-right: 2.5px;">
            <el-card class="box-alarm-analysis">
              <div slot="header">
                <span>告警分析</span>
              </div>
              <div>
                <!-- <el-col :span="20" style="height: 100%"> -->
                <echart :chartData="alarmAnalysisOption" :className="alarm_analysis_chart"></echart>
                <!-- </el-col> -->
                <!-- <el-col :span="4">
                  <ul>
                    <li>
                      <em>5195</em>
                      <br>总告警数
                    </li>
                  </ul>
                </el-col>-->
              </div>
            </el-card>
          </el-col>
          <el-col :span="12" style="padding-left: 2.5px;">
            <el-card class="box-alert-msg">
              <div slot="header">
                <span>告警消息</span>
              </div>
              <div>
                <ul>
                  <li v-for="(item, index)  in alertMsg" :key="index">
                    <span class="rt">[{{item.createTime}}]</span>
                    <p>{{item.remark}}</p>
                  </li>
                </ul>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="5" style="padding-left: 5px;">
        <el-card class="box-wifi">
          <div slot="header">
            <span>WIFI</span>
          </div>
          <div>
            <el-row :gutter="35">
              <el-col :span="12">
                <div class="panel">
                  <em>0</em>
                  <br>今日人数
                </div>
              </el-col>
              <el-col :span="12">
                <div class="panel">
                  <em>0</em>
                  <br>累积人数
                </div>
              </el-col>
              <el-col :span="12">
                <div class="panel">
                  <em>0</em>
                  <br>今日连接时长
                </div>
              </el-col>
              <el-col :span="12">
                <div class="panel">
                  <em>0</em>
                  <br>今日连接次数
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card class="box-energy-analysis">
          <div slot="header">
            <span>显示屏</span>
          </div>
          <div>
            <echart :chartData="ledOption" :className="alarm_analysis_chart"></echart>
          </div>
        </el-card>
        <el-card>
          <div slot="header">
            <span>能耗分析</span>
          </div>
          <div>
            <echart :chartData="energyOption" :className="alarm_analysis_chart"></echart>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
import echart from "@/components/echart/index";
import echarts from "echarts";
import bmap from "@/components/map/BMap";
import { FullCalendar } from "vue-full-calendar";
import "fullcalendar/dist/fullcalendar.min.css";
import homeAPI from "@/api/home/home";
import mapAPI from "@/api/common/map";

export default {
  components: {
    echart,
    bmap,
    FullCalendar
  },
  data() {
    return {
      //定时器对象
      timeIntervalObject: null,
      //地图信息
      mapInfo: {
        mapDialog: "",
        mapIcon: "tubiao-zhihuidenggan",
        mapStyle: "dark",
        center: { lng: "", lat: "" }, //中心点
        markerPoint: { lng: "", lat: "" }, //正在标记的点坐标
        markerList: [], //标注点
        markerRowIds: []
      },
      // 设备统计
      deviceTotal: 0,
      deviceOnline: 0,
      deviceOffline: 0,
      deviceData: {
        wifiData: {
          // Wifi模块
          name: "WIFI",
          deviceTotal: 0, // 设备数量
          deviceOnline: 0 // 在线数量
        },
        chargePileData: {
          // 充电桩模块
          name: "charger",
          deviceTotal: 0, // 设备数量
          deviceOnline: 0 // 在线数量
        },
        broadcastData: {
          //广播模块
          name: "broadcast",
          deviceTotal: 0, // 设备数量
          deviceOnline: 0 // 在线数量
        },
        sensorData: {
          //传感器模块
          name: "chuanganqi",
          deviceTotal: 0, // 设备数量
          deviceOnline: 0 // 在线数量
        },
        LEDScreenData: {
          //LED模块
          name: "AirplayFilled",
          deviceTotal: 0, // 设备数量
          deviceOnline: 0 // 在线数量
        },
        cameraData: {
          //视频监控模块
          name: "shipingtonghua",
          deviceTotal: 0, // 设备数量,
          deviceOnline: 0 // 在线数量
        },
        emergencyCallData: {
          // 一键报警模块
          name: "app_icons--",
          deviceTotal: 0, // 设备数量,
          deviceOnline: 0 // 在线数量
        },
        lampData: {
          // 照明模块
          name: "zhaoming",
          deviceTotal: 0, // 设备数量,
          deviceOnline: 0, // 在线数量,
          deviceOpen: 0 // 亮灯数量 --用于计算亮灯率
        }
      },
      // 告警分析
      alarmTotal: 0,
      unAlarmSolved: 0,
      // 路灯信息
      centralizedControlNum: 0, // 集控器个数,
      roadNum: 0, // 路段总数,
      thisMonth: 0, // 当月电量,
      energyData: {
        //电能部分
        lastMonth: 0, // 上月电量,
        lastYearMonth: 0 // 去年同月电量
      },
      calendarConfig: {
        locale: "zh-cn",
        defaultView: "month",
        height: 233,
        handleWindowResize: true,
        header: {
          left: "prev, next, today",
          center: "title",
          right: "custom"
        }
      },
      alarm_analysis_chart: "alarm-analysis-chart",
      alertMsg: [
        {
          remark: "系统报警。",
          createTime: "2019-09-04 16:38"
        },
        {
          remark: "灯杆007告警信息。",
          createTime: "2019-09-04 16:38"
        },
        {
          remark: "系统报警。",
          createTime: "2019-09-04 16:38"
        },
        {
          remark: "系统报警。",
          createTime: "2019-09-04 16:38"
        },
        {
          remark: "系统报警。",
          createTime: "2019-09-04 16:38"
        }
      ],
      deviceOption: {
        color: ["#3E7CEB", "#FFF31C"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["离线", "在线"],
          x: "right",
          textStyle: {
            color: "#fff"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#fff",
              width: 2
            }
          }
        },
        yAxis: {
          type: "category",
          data: ["一键报警", "传感器", "充电桩", "WIFI", "LED", "广播", "照明"],
          axisLine: {
            lineStyle: {
              color: "#fff",
              width: 2
            }
          }
        },
        series: [
          {
            name: "离线",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: [320, 302, 301, 334, 390, 330, 320]
          },
          {
            name: "在线",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          }
        ]
      },
      alertOption: {
        color: ["#10B8E9"],
        grid: {
          top: "12%",
          left: "3%",
          right: "10%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: ["设备一", "设备二", "设备三", "设备四", "设备五"],
          axisLine: {
            lineStyle: {
              color: "#fff",
              width: 2
            }
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          name: "数量",
          axisLine: {
            lineStyle: {
              color: "#fff",
              width: 2
            }
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            data: [120, 200, 150, 80, 20],
            type: "bar",
            barWidth: 30
          }
        ]
      },
      alarmAnalysisOption: {
        color: [
          "#FFF31C",
          "#FFD6A0",
          "#3E7CEB",
          "#8D75D5",
          "#CB8BC7",
          "#8ED4BC",
          "#859EC7",
          "#FB8A8E"
        ],
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c} ({d}%)"
        },
        series: [
          {
            name: "告警分析",
            type: "pie",
            radius: ["40%", "65%"],
            label: {
              normal: {
                formatter: "{b|{b}：}{c|{c}}  {per|{d}%}  ",
                rich: {
                  b: {
                    color: "#fff",
                    fontSize: 12,
                    lineHeight: 33
                  },
                  c: {
                    color: "#fff",
                    fontSize: 12,
                    lineHeight: 33
                  },
                  per: {
                    color: "#fff",
                    backgroundColor: "#10B8E9",
                    padding: [6, 4, 1],
                    borderRadius: 2
                  }
                }
              }
            },
            data: [
              { value: 50, name: "照明" },
              { value: 50, name: "广播" },
              { value: 50, name: "LED" },
              { value: 50, name: "WIFI" },
              { value: 50, name: "传感器" },
              { value: 100, name: "充电桩" },
              { value: 50, name: "视频监控" },
              { value: 50, name: "一键报警" }
            ]
          }
        ]
      },
      energyOption: {
        color: ["#10B8E9"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        grid: {
          top: "5%",
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["1月", "2月", "3月", "4月", "5月", "6月"],
            axisLine: {
              lineStyle: {
                color: "#fff",
                width: 2
              }
            },
            splitLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#fff",
                width: 2
              }
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "月度能耗",
            type: "line",
            stack: "总量",
            smooth: true,
            areaStyle: {},
            data: [120, 132, 101, 134, 90, 230, 210]
          }
        ]
      },
      ledOption: {
        color: ['#8ED4BC', '#839ECB'],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "right",
          data: ["在线", "离线"],
          textStyle: {
            color: "#fff"
          }
        },
        series: [
          {
            name: "显示屏",
            type: "pie",
            radius: ["40%", "65%"],
            center: ["50%", "50%"],
            data: [
              { value: 300, name: "在线" },
              { value: 300, name: "离线" },
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      }
    };
  },
  methods: {
    toFixNum(data, num) {
      return parseFloat(data.toFixed(num));
    },
    energyChartFoo(data, compareMonth) {
      data[0].value = compareMonth;
      data[1].value = this.thisMonth;
      if (compareMonth + this.thisMonth == 0) {
        if (this.thisMonth != 0) {
          data[1].name = "100%";
        } else {
          data[1].name = "0%";
        }
      } else {
        data[1].name =
          ((this.thisMonth / (compareMonth + this.thisMonth)) * 100).toFixed(
            0
          ) + "%";
      }
    },
    // 路灯信息
    getLampData(data) {
      this.centralizedControlNum = data.centralizedControlNum;
      this.roadNum = data.roadNum;
      let energyData = data.energyData;
      this.thisMonth = this.toFixNum(energyData.thisMonth, 2);
      window["compareMonth1"] = this.toFixNum(energyData.lastMonth, 2);
      window["compareMonth2"] = this.toFixNum(energyData.lastYearMonth, 2);
      for (let i = 0; i < 2; i++) {
        this.energyChartFoo(
          this["option" + (i + 2)].series[0].data,
          window["compareMonth" + (i + 1)]
        );
      }
    },
    // 设备统计
    getDeviceData(data) {
      this.deviceTotal = this.deviceOnline = 0;
      for (let i in this.deviceData) {
        this.deviceData[i].deviceTotal = data[i].deviceTotal;
        this.deviceData[i].deviceOnline = data[i].deviceOnline;
        this.deviceTotal += this.deviceData[i].deviceTotal;
        this.deviceOnline += this.deviceData[i].deviceOnline;
      }
      this.deviceOffline = this.deviceTotal - this.deviceOnline;
    },
    // 告警分析
    getAlarmData(data, chartData) {
      chartData[0].value = this.alarmTotal = this.unAlarmSolved = 0;
      for (var i = 0; i < data.length; i++) {
        if (data[i].deviceType == 0 || data[i].deviceType == 1) {
          // 照明
          chartData[0].value += parseInt(data[i].alarmNum);
        }
        if (data[i].deviceType == 2) {
          // 传感器
          chartData[3].value = parseInt(data[i].alarmNum);
        }
        this.alarmTotal += parseInt(data[i].alarmNum);
        this.unAlarmSolved += parseInt(data[i].noSolvedNum);
      }
    },
    getData() {
      homeAPI.getData().then(res => {
        this.getDeviceData(res);
        this.getAlarmData(
          res.alarmData,
          this.alarmAnalysisOption.series[0].data
        );
        this.getLampData(res);
      });
    }
  },

  beforeMount() {
    mapAPI.getLampPost().then(res => {
      let lampList = res;
      this.mapInfo.markerList = res.map(
        item => new BMap.Point(item.longitude, item.latitude)
      );
      this.mapInfo.center.lng = this.mapInfo.markerList[0].lng;
      this.mapInfo.center.lat = this.mapInfo.markerList[0].lat;
    });
  },
  created() {
    // this.getData();
  },
  mounted() {
    // this.loadJScript()
    // this.timeIntervalObject = setInterval(() => {
    //   this.getData();
    // }, 20000);
  },
  destroyed() {
    clearInterval(this.timeIntervalObject);
  }
};
</script>

<style lang="scss">
#bigScreenMain.el-main {
  padding: 10px 0 0;
  width: 100%;
  .el-card {
    background: rgba(66, 151, 228, 0.2);
    // background: url(../../assets/images/card.png) 0 0 no-repeat;
    border: 2px solid #076cac;
    border-radius: 0;
    border-bottom-right-radius: 10px;
    color: #fff;
    margin-bottom: 10px;
    .el-card__header {
      border-bottom: 0;
      padding: 10px 15px;
      font-size: 16px;
      .iconfont {
        color: #e8ac1d;
        position: relative;
        top: 1px;
      }
    }
    .el-card__body {
      padding: 10px 15px;
      font-size: 15px;
      > div {
        overflow: hidden;
        height: 220px;
      }
    }
    &.box-alert-msg {
      li {
        border-bottom: 1px solid #076cac;
        padding: 10px 2px;
        span {
          // color: #10B8E9;
          font-size: 12px;
        }
      }
    }
    &.box-wifi {
      .panel {
        border: 1px solid #076cac;
        padding: 15px;
        text-align: center;
        margin-bottom: 20px;
        font-size: 12px;
        em {
          color: #39ffff;
          font-size: 28px;
        }
      }
    }
    &.box-env-monitor {
      .el-card__body {
        .left {
          display: inline-block;
          background: url("../../assets/images/envi.png") no-repeat;
          line-height: 52px;
          width: 158px;
          height: 150px;
          text-align: center;
          padding-top: 62px;
          em {
            font-size: 30px;
          }
        }
        .right {
          float: right;
          color: #ccd5db;
          padding-right: 40px;
          li {
            text-align: right;
            font-size: 12px;
            margin-top: 20px;
            .icon-circle {
              display: inline-block;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background: #00cdb4;
              margin-right: 10px;
            }
            em {
              font-size: 20px;
              color: #57c2ff;
              font-weight: normal;
            }
          }
        }
        .bottom {
          margin-top: 25px;
          text-align: center;
          img {
            display: inline-block;
            width: 30px;
          }
          label {
            display: inline-block;
            font-size: 12px;
            margin-left: 10px;
            color: #ccd5db;
          }
        }
      }
    }
    &.box-equipment-statistics {
      ul {
        overflow: hidden;
        & > li {
          float: left;
          text-align: center;
        }
        &:first-child {
          & > li {
            width: 33.33%;
            em {
              font-size: 20px;
              margin-left: 15px;
            }
            &.online {
              em {
                // color: #4893cd;
                color: #28cad8;
              }
            }
            &.offline {
              em {
                color: #a4a4a4;
              }
            }
          }
        }
        &:last-child {
          & > li {
            width: 25%;
            padding: 10px 0 30px;
            i {
              // color: #4893cd;
              color: #28cad8;
              font-size: 28px;
              color: #e8ac1d;
            }
            p {
              margin-top: 15px;
              &:last-child {
                color: #28cad8;
              }
            }
          }
        }
      }
    }
    &.box-alarm-analysis {
      li {
        text-align: center;
        margin-top: 25px;
        em {
          font-size: 28px;
          color: #39ffff;
        }
      }
    }
    &.box-map {
      .el-card__body {
        padding: 0;
        & > div {
          height: 578px;
        }
      }
    }
  }
}

@media screen and (min-height: 1080px) {
  #bigScreenMain.el-main {
    .el-card {
      .el-card__body {
        > div {
          height: 250px;
        }
      }
      &.box-map {
        .el-card__body {
          & > div {
            height: 638px;
          }
        }
      }
    }
  }
}
</style>
