<template>
  <bm-control>
    <el-dialog ref="dialog" :title="'传感器：'+name" 
    :visible.sync="dialogVisible" 
    :modal-append-to-body='false' 
    :close-on-click-modal='false'
    @close="dialogVisible = false"
    class="sensor-dialog"
    :class="mapStyle">
      <!-- <i @click="toggle" class="rt icontoggle iconfont" :class="!classStatus?'icon-biaoge':'icon-pingpushitu'"></i> -->
      <card class="clear" v-if="!classStatus" :data="sensorData"></card>
      <tableList class="clear" v-else :data="sensorData"></tableList>
    </el-dialog>
  </bm-control>

</template>

<script>
import sensorConfigAPI from '@/api/sensor/sensorConfig'
import card from '@/views/sensor/sensorData/card'
import tableList from '@/views/sensor/sensorData/table'
export default {
  props: {
    rowId: String,
    mapStyle: String
  },
  data() {
    return {
      dialogVisible: false,
      name: '',
      sensorData: {
        humidity: null,
        rainfall: null, 
        pressure: null,
        temperature: null,
        windSpeed: null,
        windDirection: null,
        noise: null,
        pmValue1: null, //pm2.5
        pmValue2: null, //pm10
        light: null,
        ultravioletRays: null
      },
      classStatus: false
    }
  },
  methods: {
    toggle() {
      this.classStatus = !this.classStatus;
    },
    getName (id) {
      sensorConfigAPI.getItem(id).then(res=>{
        this.name = res.sensorName;
      });
    },
    getInfo(id) {
      sensorConfigAPI.getSensorRunData(id).then(res=>{
        for (let k in this.sensorData) {
          if (!res[k]) {
            this.sensorData[k] = '-';
          } else {
            this.sensorData[k] = res[k];
          }
        }
      });
    },
  },
  watch: {
    dialogVisible(val, oldVal) {
      if (val) {
        this.getName(this.rowId);
        this.getInfo(this.rowId);
      }
    }
  },
  components: {
    card,
    tableList
  }
}
</script>

<style lang="scss">
  .icontoggle {
    color: #878787;
    font-size: 30px;
    cursor: pointer;
    transition: color .5s ease;
    &:hover {
      color: #252525;
      transition: color .5s ease;
    }
  }
  .dark {
    .icontoggle {
      color: #409EFF;
      &:hover {
        color: #66b1ff;
      }
    }
  }
  .sensor-dialog {
    .el-dialog {
      width: 45%;
      .el-dialog__header {
        padding: 5px 10px 0;
        .el-dialog__headerbtn {
          top: 5px;
          right: 5px;
          z-index: 10000;
        }
      }
      .el-dialog__body {
        padding: 10px 5px;
      }
      #sensorCard {
        .el-row {
          margin-top: 15px;
          .el-col {
            width: 24% !important;
          }
        }
        .el-card {
          .el-card__header {
            div {
              height: 30px;
              padding: 0 6px;
              line-height: 30px;
              font-size: 16px;
            }
          }
          .el-card__body {
            height: 70px !important;
            padding: 10px 5px !important;
            &:hover .layer {
              padding-top: 15px;
            }
            .layer {
              font-size: 14px;
            }
            i {
              font-size: 28px;
            }
            span {
              font-size: 14px;
              margin-left: 2px;
              em {
                font-size: 20px;
              }
            }
          }
        }
      }
      .icontoggle {
        font-size: 20px;
      }
    }
  }
</style>
