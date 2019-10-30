<template>
  <div class="homePage">
    <el-row class="top bg" :gutter="35">
      <el-col :span="6">
        <el-card style="background: #60B8F6;" shadow="hover">
          <div class="card-lf">
            灯杆
            <br>
            <em>5,521</em>
          </div>
          <div class="card-rt">
            同比
            <br>+4.97 %
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="background: #CE84DE;" shadow="hover">
          <div class="card-lf">
            单灯控制器
            <br>
            <em>1,123</em>
          </div>
          <div class="card-rt">
            同比
            <br>+36.55 %
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="background: #55DA8D;" shadow="never">
          <div class="card-lf">
            网关
            <br>
            <em>5,123</em>
          </div>
          <div class="card-rt">
            同比
            <br>+36.55 %
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="background: #60B8F6;" shadow="never">
          <div class="card-lf">
            项目
            <br>
            <em>1,789</em>
          </div>
          <div class="card-rt">
            同比
            <br>+36.55 %
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="35" class="bottom">
      <el-col :span="18" class="projectDiv">
        <el-card>
          <span class="title">项目分布</span>
          <div id="myChartChina" :style="{width: '70%', height: '700px'}"></div>
          <div class="map-table">
            <el-table :data="mapTableData" style="width: 100%">
              <el-table-column prop="area" label="地区"></el-table-column>
              <el-table-column align="center" prop="projectNum" label="项目数"></el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="newsDiv">
          <div slot="header">
            <span>新闻信息</span>
          </div>
          <ul>
            <li v-for="(item, index)  in newsOption" :key="index">
              <span class="rt">{{item.createTime}}</span>
              <p>{{item.remark}}</p>
            </li>
          </ul>
        </el-card>
        <el-card class="raphDiv">
          <div slot="header">
            <span>图形统计</span>
          </div>
          <div class="raphEchart">
            <echart :chartData="raphOption"></echart>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echart from '@/components/echart/index'
export default {
  data() {
    return {
      testData: {
        lamp: {
          deviceTotal: '5651'
        },
        singleLamp: {
          deviceTotal: '1812'
        },
        gateway: {
          deviceTotal: '547'
        },
        project: {
          deviceTotal: '1479'
        },
        wifi: {
          deviceTotal: '10'
        }
      },
      mapTableData: [
        {
          area: "上海",
          projectNum: 23
        },
        {
          area: "北京",
          projectNum: 20
        },
        {
          area: "广州",
          projectNum: 20
        },
        {
          area: "南京",
          projectNum: 20
        }
      ],
      newsOption: [
        {
          remark: "欢迎来到智慧照明系统。",
          createTime: "2019.01.04"
        },
        {
          remark: "欢迎来到智慧照明系统。",
          createTime: "2019.01.04"
        },
        {
          remark: "欢迎来到智慧照明系统。",
          createTime: "2019.01.04"
        }
      ],
      raphOption: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          x: "center",
          y: "top",
          data: [
            "WIFI",
            "充电桩",
            "广播",
            "环境监测",
            "显示屏",
            "视频监控",
            "一键报警",
            "单灯控制器"
          ]
        },
        calculable: true,
        series: [
          {
            name: "图形统计",
            type: "pie",
            radius: [30, 110],
            center: ["50%", "65%"],
            roseType: "area",
            data: [
              { value: 10, name: "WIFI" },
              { value: 5, name: "充电桩" },
              { value: 15, name: "广播" },
              { value: 25, name: "环境监测" },
              { value: 20, name: "显示屏" },
              { value: 35, name: "视频监控" },
              { value: 30, name: "一键报警" },
              { value: 40, name: "单灯控制器" }
            ]
          }
        ],
        color:[
          '#2EC7C9',
          '#B6A2DE',
          '#5AB1EF',
          '#FFB980',
          '#D87A80',
          '#8D98B3',
          '#E5CF0D',
          '#97B552'
        ],
      }
    };
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      var myChartContainer = document.getElementById("myChartChina");
      var resizeMyChartContainer = function() {
        myChartContainer.style.width = document.body.offsetWidth / 2 + "px"; //页面一半的大小
      };
      resizeMyChartContainer();
      var myChartChina = this.$echarts.init(myChartContainer);

      function randomData() {
        return Math.round(Math.random() * 500);
      }
      // 绘制图表
      var optionMap = {
        tooltip: {},
        legend: {
          orient: "vertical",
          left: "left",
          data: [""]
        },
        visualMap: {
          show: false, // 去掉指示图
          min: 0,
          max: 1500,
          left: "10%",
          top: "top",
          text: ["高", "低"],
          calculable: true,
          // color:['#0b50b9','#c3e2f4']
          color: ["#0071BC", "#0071BC"]
        },
        selectedMode: "single",
        series: [
          {
            name: "项目分布",
            type: "map",
            mapType: "china",
            left: "10%",
            top: "10%",
            zoom: 1.2,
            itemStyle: {
              normal: {
                // borderColor: 'rgba(0, 0, 0, 0.2)'
                color: "#fff",
                borderColor: "#0CEEEF",
                borderWidth: 1
              },
              emphasis: {
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 20,
                borderWidth: 0,
                shadowColor: "#0C9BCC",
                areaColor: "#55DA8D",
                label: {
                  show: true
                }
              }
            },
            showLegendSymbol: true,
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: "#ddd"
                }
              },
              emphasis: {
                show: true,
                textStyle: {
                  color: "#fff"
                }
              }
            },
            data: [
              { name: "北京", value: randomData() },
              { name: "天津", value: randomData() },
              { name: "上海", value: randomData() },
              { name: "重庆", value: randomData() },
              { name: "河北", value: randomData() },
              { name: "河南", value: randomData() },
              { name: "云南", value: randomData() },
              { name: "辽宁", value: randomData() },
              { name: "黑龙江", value: randomData() },
              { name: "湖南", value: randomData() },
              { name: "安徽", value: randomData() },
              { name: "山东", value: randomData() },
              { name: "新疆", value: randomData() },
              { name: "江苏", value: randomData() },
              { name: "浙江", value: randomData() },
              { name: "江西", value: randomData() },
              { name: "湖北", value: randomData() },
              { name: "广西", value: randomData() },
              { name: "甘肃", value: randomData() },
              { name: "山西", value: randomData() },
              { name: "内蒙古", value: randomData() },
              { name: "陕西", value: randomData() },
              { name: "吉林", value: randomData() },
              { name: "福建", value: randomData() },
              { name: "贵州", value: randomData() },
              { name: "广东", value: randomData() },
              { name: "青海", value: randomData() },
              { name: "西藏", value: randomData() },
              { name: "四川", value: randomData() },
              { name: "宁夏", value: randomData() },
              { name: "海南", value: randomData() },
              { name: "台湾", value: randomData() },
              { name: "香港", value: randomData() },
              { name: "澳门", value: randomData() }
            ]
          }
        ]
      };

      myChartChina.setOption(optionMap);
      window.onresize = function() {
        resizeMyChartContainer();
        myChartChina.resize();
      };
    }
  },
  mounted() {
    this.drawLine();
  },
  components: {
    echart
  }
};
</script>

<style lang="scss" scope>
.homePage {
  .el-row {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  .el-card__header {
    border-bottom: 0;
  }
  .top {
    margin-bottom: 10px;
    padding: 25px 10px;
    .el-card {
      color: #fff;
      .el-card__body {
        padding: 0;
        overflow: hidden;
        .card-lf {
          float: left;
          line-height: 28px;
          padding: 15px 10px 0 40px;
          em {
            font-size: 28px;
          }
        }
        .card-rt {
          float: right;
          background: rgba(0, 0, 0, 0.1);
          height: 90px;
          line-height: 30px;
          padding: 25px 25px 0;
          text-align: center;
        }
      }
    }
  }
  .bottom {
    .el-col {
      padding-left: 5px !important;
      padding-right: 5px !important;
      .el-card__body {
        padding: 0 20px 20px;
      }
      &.projectDiv {
        .el-card__body {
          padding: 0 0 80px !important;
          position: relative;
          .title {
            position: absolute;
            top: 0;
            left: 0;
            padding: 18px 20px;
          }
          .map-table {
            width: 20%;
            position: absolute;
            right: 2%;
            top: 94px;
            .el-table {
              border: 1px solid #88c8f5;
              .el-table__header {
                th {
                  background: #e6f5ff;
                }
              }
            }
          }
        }
      }
      .newsDiv {
        margin-bottom: 10px;
        ul {
          margin-bottom: 30px;
          li {
            border-bottom: 1px solid #ddd;
            padding: 20px 5px 5px;
            span {
              color: #8e8e8e;
            }
          }
        }
      }
      .raphEchart {
        height: 448px;
      }
    }
  }
}
</style>
