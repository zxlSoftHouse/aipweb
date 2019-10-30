<template>
  <div class="sensor">
    <el-form ref="form" :model="form" label-width="130px">
      <el-form-item label="传感器名称">
        <el-select
          @change="getSensorDayRunData"
          v-model.trim="form.sensorId"
          filterable
          placeholder="请选择所属灯杆"
        >
          <el-option
            v-for="item in sensorList"
            :key="item.rowId"
            :label="item.sensorName"
            :value="item.rowId"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <card :data="sensorData"></card>
    <el-row :gutter="10" class="bottom">
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>今日环境检测</span>
          </div>
          <div class="body">
            <echart :chartData="sensorOption"></echart>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>历史记录</span>
          </div>
          <div class="body">
            <tableList></tableList>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echart from "@/components/echart/index";
import echarts from "echarts";
import sensorConfigAPI from "@/api/sensor/sensorConfig";
import sensorRunAPI from "@/api/sensor/sensorRun";
import card from "./card";
import tableList from "./table";
import { parseTime } from '@/utils/index'
export default {
  data() {
    return {
      form: {
        sensorId: ""
      },
      sensorList: [],
      sensorData: {
        humidity: {
          name: '湿度',
          val: null,
          unit: "RH",
          icon: "shidu",
          class: "green1"
        },
        pressure: {
          name: '气压',
          val: null,
          unit: "kPa",
          icon: "qiya",
          class: "green2"
        },
        temperature: {
          name: '温度',
          val: null,
          unit: "℃",
          icon: "wendu",
          class: "red"
        },
        windSpeed: {
          name: '风速',
          val: null,
          unit: "m/s",
          icon: "fengsu",
          class: "green3"
        },
        windDirectionDes: {
          name: '风向',
          val: null,
          unit: "",
          icon: "fengxiang",
          class: "green4"
        },
        noise: {
          name: '噪声',
          val: null,
          unit: "dB",
          icon: "zaosheng",
          class: "brown"
        },
        pmValue1: {
          name: 'PM2.5',
          val: null,
          unit: "ug/m3",
          icon: "PM",
          class: "blue"
        },
        pmValue2: {
          name: 'PM10',
          val: null,
          unit: "ug/m3",
          icon: "PM1",
          class: "purple"
        }
      },
      sensorOption: {
        color: [
          '#79a021', 
          '#7dbdb3', 
          '#d54f3e', 
          '#5ccac4',
          '#7dbdb3',
          '#8e858c',
          '#5f90b8',
          '#d08dc1'
        ],
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: [
            "湿度",
            "气压",
            "温度",
            "风速",
            "风向",
            "噪声",
            "PM2.5",
            "PM10"
          ]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          splitLine: {
            show: false
          },
          type: "category",
          boundaryGap: false,
          data: [],
          axisLabel: {  
            interval:0,  
            rotate:20  
          }  
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: false
          }
        },
        series: [
          {
            key: 'humidity',
            name: "湿度",
            type: "line",
            stack: "总量1",
            smooth: true,
            data: []
          },
          {
            key: 'pressure',
            name: "气压",
            type: "line",
            stack: "总量2",
            smooth: true,
            data: []
          },
          {
            key: 'temperature',
            name: "温度",
            type: "line",
            stack: "总量3",
            smooth: true,
            data: []
          },
          {
            key: 'windSpeed',
            name: "风速",
            type: "line",
            stack: "总量4",
            smooth: true,
            data: []
          },
          {
            key: 'windDirectionDes',
            name: "风向",
            type: "line",
            stack: "总量5",
            smooth: true,
            data: []
          },
          {
            key: 'noise',
            name: "噪声",
            type: "line",
            stack: "总量6",
            smooth: true,
            data: []
          },
          {
            key: 'pmValue1',
            name: "PM2.5",
            type: "line",
            stack: "总量7",
            smooth: true,
            data: []
          },
          {
            key: 'pmValue2',
            name: "PM10",
            type: "line",
            stack: "总量8",
            smooth: true,
            data: []
          }
        ]
      }
    };
  },
  computed: {
    getWebsockCode() {
      return this.$store.state.websock.returnCode;
    }
  },
  watch: {
    getWebsockCode(newer, older) {
      if (newer == "sensor") {
        this.getSensorDayRunData(this.form.sensorId);
        this.$store.dispatch("RESET_CODE");
      }
    }
  },
  methods: {
    getSensorInfo(res) {
      for (let k in this.sensorData) {
        if (res.length > 0) {
          if (!res[res.length-1][k]) {
            this.sensorData[k].val = "-";
          } else { 
            this.sensorData[k].val = res[res.length-1][k];
          }
        } else {
          this.sensorData[k].val = "-";
        }
      }
    },
    getSensorDayRunData(id) {
      sensorRunAPI.getSensorDayRunData(id).then(res => {
        this.getSensorInfo(res);
        this.sensorOption.xAxis.data = [];
        let seriesData = this.sensorOption.series;
        for (let i = 0; i < seriesData.length; i++) {
          this.sensorOption.series[i].data = [];
          for (let j = 0; j < res.length; j++) {
            for (let k in res[j]) {
              if (seriesData[i].key == k) {
                this.sensorOption.series[i].data.push(parseFloat(res[j][k]));
              }
            }
          }
        }
        console.log(this.sensorOption.series);
        for (let i = 0; i < res.length; i++) {
          this.sensorOption.xAxis.data.push(parseTime(res[i].createTime,'{h}:{i}:{s}'));
        }
      });
    },
    getSensorList() {
      sensorConfigAPI.getSensor().then(res => {
        this.sensorList = res;
        this.form.sensorId = res[0].rowId;
        this.getSensorDayRunData(this.form.sensorId);
      });
    },
    initDataByProjectId() {
      this.getSensorList();
    }
  },
  created() {
    this.initDataByProjectId();
  },
  components: {
    echart,
    card,
    tableList
  }
};
</script>
<style lang="scss">
.sensor {
  .el-row {
    margin-left: 0 !important;
    margin-right: 0 !important;
    &.bottom {
      margin-top: 10px;
    }
  }
  .el-card__header {
    border-bottom: 0;
    span {
      padding: 10px 50px 10px 0;
      border-bottom: 2px solid #60b8f6;
      font-size: 16px;
    }
  }
  .body {
    height: 330px;
  }
  .icontoggle {
    color: #878787;
    font-size: 30px;
    cursor: pointer;
    transition: color 0.5s ease;
    &:hover {
      color: #252525;
      transition: color 0.5s ease;
    }
  }
}
</style>

