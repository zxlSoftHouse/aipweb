<template>
  <div class="lightStatistics">
    <el-row class="top" :gutter="35">
      <el-col :span="6">
        <el-card shadow="hover">
          <em style="color: #FA77F8;">521</em>
          <br>当日用电量 （Kwh）
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <em style="color: #AA60F6;">6,521</em>
          <br>当月用电量 （Kwh）
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <em style="color: #6DD77E;">56,521</em>
          <br>当年用电量 （Kwh）
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <em style="color: #65BAF6;">156,521</em>
          <br>全部用电量 （Kwh）
        </el-card>
      </el-col>
    </el-row>
    <el-row class="middle" :gutter="10">
      <el-col :span="16">
        <el-card>
          <div slot="header">
            <span>月度能耗</span>
          </div>
          <div class="echart">
            <echart :chartData="monthOption"></echart>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div slot="header">
            <span>年度能耗</span>
          </div>
          <div class="echart">
            <echart :chartData="yearOption"></echart>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="bottom" :gutter="10">
      <el-col :span="14">
        <el-card class="alertDiv">
          <div slot="header">
            <span>告警信息</span>
          </div>
          <ul>
            <li v-for="(item, index)  in alertOption" :key="index">
              <span class="rt">{{item.createTime}}</span>
              <p>{{item.remark}}</p>
            </li>
          </ul>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card>
          <div slot="header">
            <span>设备统计</span>
          </div>
          <div class="echart">
            <echart :chartData="devOption"></echart>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echart from "@/components/echart/index";
export default {
  data() {
    return {
      monthOption: {
        color: ["#60B8F6"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "6%",
          top: "10%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: [
          {
            name: "月份",
            type: "category",
            data: [
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10",
              "11",
              "12"
            ],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#333",
                fontSize: 12
              }
            },
            nameTextStyle: {
              color: "#333",
              fontSize: 14
            },
            axisLine: {
              lineStyle: {
                color: "#ddd",
                width: 1
              }
            }
          }
        ],
        yAxis: [
          {
            splitLine: {
              lineStyle: {
                type: "dotted"
              }
            },
            type: "value",
            name: "用量 (单位: KWh)",
            axisLabel: {
              show: true,
              textStyle: {
                color: "#333",
                fontSize: 12
              }
            },
            nameTextStyle: {
              color: "#333",
              fontSize: 14
            },
            axisLine: {
              lineStyle: {
                color: "#ddd",
                width: 1
              }
            }
          }
        ],
        series: [
          {
            name: "月度能耗",
            type: "bar",
            barWidth: "50%",
            data: [
              80000,
              61000,
              60000,
              80000,
              40000,
              61000,
              60000,
              85000,
              90000,
              60000,
              80000,
              100000
            ]
          }
        ]
      },
      yearOption: {
        color: ["#CE84DE"],
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: "3%",
          right: "8%",
          top: "10%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: {
          name: "年份",
          type: "category",
          data: ["2015", "2016", "2017", "2018", "2019"],
          axisLabel: {
            show: true,
            textStyle: {
              color: "#333",
              fontSize: 12
            }
          },
          nameTextStyle: {
            color: "#333",
            fontSize: 14
          },
          axisLine: {
            lineStyle: {
              color: "#ddd",
              width: 1
            }
          }
        },
        yAxis: {
          type: "value",
          name: "用量 (单位: KWh)",
          splitLine: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#333",
              fontSize: 12
            }
          },
          nameTextStyle: {
            color: "#333",
            fontSize: 14
          },
          axisLine: {
            lineStyle: {
              color: "#ddd",
              width: 1
            }
          }
        },
        series: [
          {
            name: "年度能耗",
            data: [5000, 10000, 15000, 17000, 19000],
            type: "line"
          }
        ]
      },
      alertOption: [
        {
          remark: "系统报警。",
          createTime: "2019.09.04 16:38"
        },
        {
          remark: "灯杆007告警信息。",
          createTime: "2019.09.04 16:38"
        },
        {
          remark: "系统报警。",
          createTime: "2019.09.04 16:38"
        },
        {
          remark: "系统报警。",
          createTime: "2019.09.04 16:38"
        }
      ],
      devOption: {
        animation: false,
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["灯杆", "网关", "单灯控制器"]
        },
        series: [
          {
            name: "设备统计",
            type: "pie",
            radius: "90%",
            center: ["75%", "45%"],
            data: [
              { value: 45, name: "灯杆" },
              { value: 30, name: "网关" },
              { value: 25, name: "单灯控制器" },
            ],
            label: {
              normal: {
                show: true,
                position:'inner',
                formatter:'{d}'
              }
            }
          }
        ],
        color:[
          '#FFAC3E',
          '#23A86D',
          '#60B8F6'
        ]
      }
    };
  },
  methods: {},
  mounted() {},
  components: {
    echart
  }
};
</script>

<style lang="scss">
.lightStatistics {
  .el-row {
    margin-left: 0 !important;
    margin-right: 0 !important;
    margin-top: 15px;
  }
  .el-card__header {
    border-bottom: 0;
    span {
      padding: 10px 50px 10px 0;
      border-bottom: 2px solid #60b8f6;
      font-size: 16px;
    }
  }
  .top {
    margin-top: 0;
    .el-card {
      .el-card__body {
        overflow: hidden;
        text-align: center;
        line-height: 50px;
        em {
          font-size: 25px;
        }
      }
    }
  }
  .middle {
    .echart {
      height: 300px;
    }
  }
  .alertDiv {
    .el-card__body {
      padding-top: 0;
      ul {
        margin-bottom: 18px;
        li {
          border-bottom: 1px solid #ddd;
          padding: 20px 5px 5px;
          span {
            color: #8e8e8e;
          }
        }
      }
    }
  }
  .bottom {
    .echart {
      height: 182px;
    }
  }
}
</style>
