<template>
  <div>
    <el-row type="flex" align="middle">
      <el-col :span="12">
        <el-radio-group v-model="flag" @change="getTableData">
          <el-radio-button label="1">灯具数据</el-radio-button>
          <el-radio-button label="2">亮灯率</el-radio-button>
          <el-radio-button label="3">集控器数据</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row  type="flex" align="middle" style="margin-top:3px">
      <el-col :span="6">
          <div class="demo-input-suffix">
            路段：
            <el-select v-model="searchInfo.roadId" @change="selectRoad">
              <el-option label="全部" value="" ></el-option>
              <el-option
                  v-for="item in options.road"
                  :key="item.rowId"
                  :label="item.roadName"
                  :value="item.rowId"
              ></el-option>
          </el-select>
          </div>
      </el-col>
    <!--   <el-col :span="2">
        <el-button @click = "exportExcel()">导出Excel</el-button>
      </el-col> -->
      <el-col :span="16">
        <div v-if="flag === '2'">
          <span class="demonstration">选择日期</span>
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getTableData"
            value-format="timestamp">
          </el-date-picker>
        </div>
      </el-col>
    </el-row>
      <!-- 灯具数据 -->
      <el-table
        v-if="flag === '1'"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%;margin-top:3px;"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="controlerName"
          label="灯具名称"
          >
        </el-table-column>
        <el-table-column
          prop="controlerAddress"
          label="灯控器地址"
          >
        </el-table-column>
        <el-table-column
          prop="tenderName"
          label="厂家">
        </el-table-column>
        <el-table-column
          prop="modelName"
          label="型号">
        </el-table-column>
        <el-table-column
          label="灯具数据"
          >
          <template slot-scope="scope">
            <span>
              <a @click="lightingData(scope.row.rowId)" style="color: blue">查看数据</a>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 灯具数据 -->

      <!-- 亮灯率 -->
      <!-- <el-table
        v-if="flag === '2'"
        ref="multipleTable2"
        :data="tableData2"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55"
          :key="Math.random()">
        </el-table-column>
        <el-table-column
          prop="rate"
          label="亮灯率"
          :key="Math.random()"
          :formatter="lightingRate">
        </el-table-column>
        <el-table-column
          prop="onLampNum"
          label="亮灯数"
          :key="Math.random()"
          >
        </el-table-column>
        <el-table-column
          prop="totalLampNum"
          label="总灯数"
          :key="Math.random()"
          >
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="记录时间"
          :key="Math.random()"
          :formatter="updateTime"
          >
        </el-table-column>
      </el-table> -->
      <div style="height:450px;margin-top: 70px;" v-if="flag === '2'" >
        <echart :chartData="lightingRateOption" className="lightingRateChart" ref="myChart"></echart>
      </div>
      <!-- 亮灯率 -->

      <!-- 集控器数据 -->
      <el-table
        v-if="flag === '3'"
        ref="multipleTable3"
        :data="tableData3"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="controlerName"
          label="网关名称"
          >
        </el-table-column>
        <el-table-column
          prop="tenderName"
          label="厂家"
          >
        </el-table-column>
        <el-table-column
          prop="modelName"
          label="型号">
        </el-table-column>
        <el-table-column
          prop=""
          label="回路开闭数据"
          >
          <template slot-scope="scope">
            <span>
              <a @click="loopElectricity(scope.row.rowId,'2')" style="color: blue">查看数据</a>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="三相电数据"
          :key="Math.random()"
          >
          <template slot-scope="scope">
            <span>
              <a @click="threePhaseData(scope.row.rowId)" style="color: blue">查看数据</a>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="回路电流数据"
          :key="Math.random()"
          >
          <template slot-scope="scope">
            <span>
              <a @click="loopElectricity(scope.row.rowId,'4')" style="color: blue">查看数据</a>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 集控器数据 -->

    <div style="text-align: center;margin-top: 30px;" v-if="flag != '2'">
      <el-pagination
        background
        layout          = "prev, pager, next"
        :total          = "total"
        @current-change = "current_change">
      </el-pagination>
    </div>
    <el-dialog class="dialog-common-sys" :visible.sync="showDialog" :modal-append-to-body='false' width="70%" @close="closeDialog()">
      <div>
        <span class="demonstration">选择日期</span>
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="selectDate"
          value-format="timestamp">
        </el-date-picker>
      </div>
      <!-- 灯具数据 -->
      <!-- <el-table
        v-if="innerFlag === '1'"
        ref="multipleTable"
        :data="tableData4"
        tooltip-effect="dark"
        height="500">
        <el-table-column
          prop="voltage"
          label="电压">
        </el-table-column>
        <el-table-column
          prop="electriccurrent"
          label="电流"
          >
        </el-table-column>
        <el-table-column
          prop="availablework"
          label="有功功率"
          >
        </el-table-column>
        <el-table-column
          prop="uselesswork"
          label="无功功率"
          >
        </el-table-column>
        <el-table-column
          prop="frequency"
          label="频率"
          >
        </el-table-column>
        <el-table-column
          prop="temperature"
          label="温度"
          >
        </el-table-column>
        <el-table-column
          prop="brightness"
          label="亮度"
          >
        </el-table-column>
        <el-table-column
          prop="activepower"
          label="有功电能"
          >
        </el-table-column>
        <el-table-column
          prop="apparentpower"
          label="视在电能"
          >
        </el-table-column>
        <el-table-column
          prop="runningtime"
          label="运行时间(h)"
          >
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="上报时间"
          :formatter="updateTime"
          >
        </el-table-column>
      </el-table> -->
      <div style="height:450px;margin-top: 70px;" v-if="innerFlag === '1'" >
        <echart :chartData="lightingDataOption" className="lightingDataChart" ref="myChart"></echart>
      </div>
      <!-- 灯具数据 -->

      <!-- 回路开闭数据 -->
      <el-table
        v-if="innerFlag === '2'"
        ref="multipleTable"
        :data="loopInfoList"
        tooltip-effect="dark"
        height="500">
        <el-table-column
          v-for="(item,index) in loopArray.slice(0,this.loopNum-1)"
          :key="index"
          :label="item.name">
          <template slot-scope="scope" >
            {{scope.row["loop_"+(index+1)]?(scope.row["loop_"+(index+1)]==="1"?"断开":"闭合"):"-"}}
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="上报时间"
          :formatter="updateTime"
          >
        </el-table-column>
      </el-table>
      <!-- 回路开闭数据 -->
      
      <!-- 回路电流数据 -->
      <el-table
        v-if="innerFlag === '4'"
        ref="multipleTable"
        :data="loopInfoList"
        tooltip-effect="dark"
        height="500">
        <el-table-column
          v-for="(item,index) in loopArray.slice(0,this.loopNum-1)"
          :key="index"
          :label="item.name">
          <template slot-scope="scope">
            {{scope.row["loop_"+(index+1)]?scope.row["loop_"+(index+1)]:"-"}}
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="上报时间"
          :formatter="updateTime"
          >
        </el-table-column>
      </el-table>
      <!-- 回路电流数据 -->
      <!-- 三相电数据 -->
      <el-table
        v-if="innerFlag === '3'"
        ref="multipleTable"
        :data="tableData5"
        tooltip-effect="dark"
        height="500">
        <el-table-column
          prop="aapparentwork"
          label="A相视在功率(W)">
        </el-table-column>
        <el-table-column
          prop="bapparentwork"
          label="B相视在功率(W)">
        </el-table-column>
        <el-table-column
          prop="capparentwork"
          label="C相视在功率(W)">
        </el-table-column>
        <el-table-column
          prop="happarentwork"
          label="合相视在功率(W)">
        </el-table-column>
        <el-table-column
          prop="aavailablework"
          label="A相有功功率(W)">
        </el-table-column>
        <el-table-column
          prop="bavailablework"
          label="B相有功功率(W)">
        </el-table-column>
        <el-table-column
          prop="cavailablework"
          label="C相有功功率(W)">
        </el-table-column>
        <el-table-column
          prop="havailablework"
          label="合相有功功率(W)">
        </el-table-column>
        <el-table-column
          prop="avoltage"
          label="A相电压(V)">
        </el-table-column>
        <el-table-column
          prop="bvoltage"
          label="B相电压(V)">
        </el-table-column>
        <el-table-column
          prop="cvoltage"
          label="C相电压(V)">
        </el-table-column>
        <el-table-column
          prop="acurrent"
          label="A相电流(A)">
        </el-table-column>
        <el-table-column
          prop="bcurrent"
          label="B相电流(A)">
        </el-table-column>
        <el-table-column
          prop="ccurrent"
          label="C相电流(A)">
        </el-table-column>
        <el-table-column
          prop="hcurrent"
          label="合相电流(A)">
        </el-table-column>
        <el-table-column
          prop="auselesswork"
          label="A相无功功率(W)">
        </el-table-column>
        <el-table-column
          prop="buselesswork"
          label="B相无功功率(W)">
        </el-table-column>
        <el-table-column
          prop="cuselesswork"
          label="C相无功功率(W)">
        </el-table-column>
        <el-table-column
          prop="huselesswork"
          label="合相无功功率(W)">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="上报时间"
          :formatter="updateTime"
          >
        </el-table-column>
      </el-table>
      <!-- 三相电数据 -->

      <div slot="footer" class="dialog-footer"> 
        <el-button @click="showDialog = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/lighting/historyDataAPI'
import { formatTime,parseTime } from '@/utils/index'
import echart from '@/components/echart/index'

export default {
  data() {
    return {
      innerFlag:'',  //对话框中表格的显示  1：灯具查看数据 2：回路开闭数据 3：三相电数据 4：回路电流数据
      flag:"1",  //tab页  1:灯具数据 2:亮灯率 3:集控器数据
      total:0,  //数据总条数
      pageSize:10,  //每页容量
      currentPage:1,  //当前页
      selectedRowId:'',
      tableData:[],  //灯具数据
      tableData2:[],  //亮灯率
      tableData3:[],  //集控器数据
      tableData4:[],  //灯具历史数据
      tableData5:[],  //三相电历史数据
      loopInfoList:[],  //回路信息
      loopNum:0,  //回路数
      loopArray:[  //根据回路数动态生成表头
        {
          name:'回路1'
        },
        {
          name:'回路2'
        },
        {
          name:'回路3'
        },
        {
          name:'回路4'
        },
        {
          name:'回路5'
        },
        {
          name:'回路6'
        },
        {
          name:'回路7'
        },
        {
          name:'回路8'
        },
        {
          name:'回路9'
        },
      ],
      date:[],  //日期
      showDialog:false,
      searchInfo:{  //筛选条件
        projectId:'',
        roadId:''
      },
      options:{  //下拉框数据
        project:[],
        road:[]
      },
      lightingRateOption:{  //亮灯率图表
        tooltip : {
          trigger: 'axis',
          axisPointer: {
              type: 'cross'
          }
        },
        legend: {
            data:['总灯数','亮灯数','亮灯率']
        },
        toolbox: {
          show : true,
          feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['line', 'bar']},
            restore : {show: true},
            saveAsImage : {show: true}
          }
        },
        xAxis : [
          {
            type : 'category',
            data : []
          }
        ],
        yAxis : [
            {
                type : 'value',
                name:'总灯数',
                position: 'right',
                min: 0,
                max: 20,
                minInterval: 1,
                axisLabel : {
                    formatter: function(value){
                      return value + '盏';
                    }
                }
            },
            {
                type : 'value',
                name:'亮灯数',
                position: 'right',
                offset: 80,
                min: 0,
                max: 20,
                minInterval: 1,
                axisLabel : {
                    formatter: function(value){
                      return value + '盏';
                    }
                }
            },
            {
                type : 'value',
                name:'亮灯率',
                position: 'left',
                min: 0,
                max: 1,
                axisLabel : {
                    formatter: function(value){
                      return value*100 + '%';
                    }
                }
            }
        ],
        series : [
            {
              name:'总灯数',
              type:'bar',
              barWidth: 40,
              itemStyle: {
                  normal: {
                      color: '#fff',
                      borderColor:'#000'
                  }
              },
              barGap: '-100%', // Make series be overlap
              data:[]
            },
            {
              name:'亮灯数',
              type:'bar',
              yAxisIndex: 1,
              itemStyle: {
                  normal: {
                      color: '#000000'
                  }
              },
              barWidth: 40,
              data:[]
            },
            {
                name:'亮灯率',
                type:'line',
                yAxisIndex: 2,
                smooth:true,  //这句就是让曲线变平滑的 
                data:[],
            }
        ]
      },
      
      lightingDataOption:{  //灯具数据图表(市电)
        tooltip : {
          trigger: 'axis',
          // formatter: '{a0}:{c0}A</br>{a1}:{c1}V'
        },
        legend: {
            data:['电流','电压']
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                data : []
            }
        ],
        yAxis : [
            {
                type : 'value',
                name:'电流',
                axisLabel : {
                    formatter: function(value){
                      return value + 'A';
                    }
                }
            },
            {
              type : 'value',
              name:'电压',
              min:0,
              max:300,
              axisLabel : {
                formatter: '{value} V'
              }
            }
        ],
        series : [
            {
                name:'电流',
                type:'line',
                smooth:true,  //这句就是让曲线变平滑的 
                data:[],
            },
            {
              name:'电压',
              type:'line',
              yAxisIndex: 1,
              smooth:true,  //这句就是让曲线变平滑的 
              data:[]
            }
        ]
      },
    }
  },
  components: {
    echart,
  },
  mounted(){
    this.initDataByProjectId();
  },
  methods: {
    initDataByProjectId(){
      this.searchInfo.roadId = "";
      this.queryRoadOptions();
      this.getTableData();
    },
    getTableData(){
      var data = {  //数pageNum-当前第几页,pageSize-每页大小,projectName-项目名称, roadName-路段名称
        pageNum:this.currentPage,
        pageSize:this.pageSize,
        roadId:this.searchInfo.roadId
      }
      if(this.flag === '1'){
        api.getLightingList(data).then(res=>{
          this.tableData = res.records;
          this.total = res.total;
        })
      }else if(this.flag === '2'){
        if(this.date.length==0){          
          this.date[1] = new Date().getTime();
          this.date[0] = this.date[1] - 7 * 24 * 3600 * 1000;
        }
        var data2 = {
          roadId:this.searchInfo.roadId,
          startTime: this.date===null?'':this.date[0],
          endTime: this.date===null?'':this.date[1],
        }
        api.queryLampHisRate(data2).then(res=>{
          this.tableData2 = res;
          this.lightingRateOption.series.forEach(item=>{item.data = []});
          this.lightingRateOption.xAxis[0].data=[];
          res.map(item=>{
            this.lightingRateOption.series[0].data.push(item.totalLampNum);
            this.lightingRateOption.series[1].data.push(item.onLampNum);
            this.lightingRateOption.series[2].data.push(item.rate);
            this.lightingRateOption.xAxis[0].data.push(parseTime(item.updateTime,'{y}-{m}-{d} {h}:{i}:{s}'));
          })
          this.chartReload();
        })
      }else{
        api.getCentralizedControlList(data).then(res=>{
          this.tableData3 = res.records;
          this.total = res.total;
        })
      }
    },
    queryRoadOptions(){  //获取路段下拉框数据
      api.queryRoadOptions(this.searchInfo.projectId).then(res=>{
        this.options.road = res;
      })
    },
    selectRoad(){  //选取路段
      this.getTableData();
    },
    lightingRate(val){  //亮灯率格式化
      if(val.rate != null){
        return val.rate * 100 + "%";
      }else{
        return "暂无数据"
      }
    },
    updateTime(val){  //上报时间格式化
      if(val.lampRunData === null){
        return "暂无数据"
      }
      return parseTime(val.updateTime)
    },
    handleSelectionChange(val) {  //获取选中项
      this.multipleSelection = val;
    },
    current_change(currentPage){  //翻页
      this.currentPage = currentPage;
      this.getTableData();
    },
    selectDate(){  //时间筛选
      if(this.innerFlag === '1'){
        this.lightingData(false);
      }else{
        this.loopElectricity();
      }
    },
    lightingData(val,type){  //查询灯具数据
      if(val){
        this.selectedRowId = val;
        this.date[1] = new Date().getTime();
        this.date[0] = this.date[1] - 7 * 24 * 3600 * 1000;
      }
    
      var data = {
        lampConId: this.selectedRowId,
        startTime: this.date[0],
        endTime: this.date[1],
      }
      api.queryLampHisData(data).then(res=>{
        this.lightingDataOption.series[0].data=[];
        this.lightingDataOption.series[1].data=[];
        this.lightingDataOption.xAxis[0].data=[];
        res.map(item=>{
          this.lightingDataOption.series[0].data.push(item.electriccurrent||0);
          this.lightingDataOption.series[1].data.push(item.voltage||0);
          this.lightingDataOption.xAxis[0].data.push(parseTime(item.updateTime,'{y}-{m}-{d} {h}:{i}:{s}'));
        })
        this.chartReload();
      })
      this.showDialog = true;
      this.innerFlag = '1';
    },
    loopElectricity(val,flag){  //集控器数据
      if(val){
        this.selectedRowId = val;
        this.innerFlag = flag;
        this.date[1] = new Date().getTime();
        this.date[0] = this.date[1] - 7 * 24 * 3600 * 1000;
      }
      var data = {
        centralizedControlId: this.selectedRowId,
        startTime: this.date[0],
        endTime: this.date[1]
      }
      switch (this.innerFlag) {
        case "2"://回路开闭数据       
          api.getLoopHisInfo_states(data).then(res=>{
            this.loopInfoList = res.loopInfoList;
            /* this.loopInfoList = [
              {devicestatus:[0,0,1],updateTime:1571821884000}
              ] */
          })
          break;
        case "4"://回路电流数据        
          api.getLoopHisInfo_currents(data).then(res=>{
            this.loopInfoList = res.loopInfoList;
          })
          break;
      
        default:
          break;
      }
      this.showDialog = true;
    },
    threePhaseData(val){  //三相电
      if(val){
        this.selectedRowId = val;
        this.date[1] = new Date().getTime();
        this.date[0] = this.date[1] - 7 * 24 * 3600 * 1000;
      }
      var data = {
        centralizedControlId: this.selectedRowId,
        startTime: this.date[0],
        endTime: this.date[1],
      }
      api.getcentralizedConHisInfo(data).then(res=>{
        this.tableData5 = res.loopInfoList;
      })
      this.showDialog = true;
      this.innerFlag = '3';
    },
    chartReload(){  //重绘图表
      this.$refs.myChart.reload();
    },
    closeDialog(){  //关闭对话框 清空日期
      this.date = [];
    }
  }
}
</script>
<style scoped>
.el-input{
  width: auto;
}
</style>
