<template>
<div>
    <el-row type="flex" align="middle">
      <el-col :span="8" style="margin-right:auto;">
        <el-button
          type   = "success"
          @click = "handleAdd()">新增</el-button>
        <el-button
          @click="handleEdit()">编辑</el-button>
        <el-button
          type   = "danger"
          @click = "handleDelete()">删除</el-button>
      </el-col>
      <el-col :span="6">
        策略类型：
        <el-select v-model="searchInfo.strategyType" placeholder="请选择策略类型" @change="selectStrategy">
          <el-option
            v-for="item in strategyOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input v-model="searchInfo.strategyName" placeholder="请输入策略名称"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="getTableData()">搜索</el-button>
      </el-col>
    </el-row>
    <el-table
      ref               = "multipleTable"
      :data             = "tableData"
      tooltip-effect    = "dark"
      style             = "width: 100%"
      @selection-change = "handleSelectionChange">
      <el-table-column
        type  = "selection"
        width = "55">
      </el-table-column>
      <el-table-column 
        v-for="col in searchInfo.strategyType===0 ? cityTableCol : sunTableCol"
        :prop="col.prop" :label="col.label"  :formatter="col.formatter" :key="col.prop">
      </el-table-column>
      <el-table-column label = "操作">
        <template slot-scope="scope">
          <el-button
            type   = "primary"
            @click="getBandingDetail(scope.row)">绑定详情</el-button>
          </template>
      </el-table-column>
    </el-table>
    <div style="text-align: center;margin-top: 30px;">
      <el-pagination
        background
        layout          = "prev, pager, next"
        :total          = "total"
        @current-change = "current_change">
      </el-pagination>
    </div>


      <el-dialog class="dialog-common-sys" width="90%" :title="dialogTitle" :visible.sync="showDialog" :modal-append-to-body='false' :close-on-click-modal='false' @close="cancelUpdate()">
        
        <el-form :inline="true" :model="strategy" :rules="rules" ref="Form">
            <el-row type="flex" align="middle">
              <el-form-item label="策略名称" :label-width="formLabelWidth" prop="name">
                  <el-input v-model="strategy.name" auto-complete="off" placeholder="请填写策略名称"></el-input>
              </el-form-item>
              <el-form-item label="负载电流" v-if="searchInfo.strategyType === 1" :label-width="formLabelWidth" prop="currentMax">
                  <el-input v-model="strategy.currentMax" auto-complete="off" placeholder="请填写负载电流" @change="checkCurrent">
                      <template slot="append">mA</template>
                  </el-input>
              </el-form-item>
              <!-- <el-form-item label="策略类型" :label-width="formLabelWidth" >
                  <el-radio-group v-model="searchInfo.strategyType" @change="dialogStrategyTypeChange">               
                    <el-radio :label="0">市电灯策略</el-radio>
                    <el-radio :label="1">太阳能灯策略</el-radio>
                  </el-radio-group>
              </el-form-item> -->
            </el-row>
            <div v-if="searchInfo.strategyType === 1">
              <el-row type="flex" align="middle">
                  <el-col :span="22">
                      <el-form-item label="第一段持续时间" :label-width="formLabelWidth" prop="detail.timeFirst">
                          <el-input v-model="strategy.detail.timeFirst" auto-complete="off" placeholder="请填写第一段持续时间">
                            <template slot="append">分钟</template>
                          </el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="2">
                      <span>亮度</span>
                  </el-col>
                  <el-col :span="10">
                          <div>
                              <el-slider v-model="lightLevel.lightLevel1" @change="changeLightLevel"></el-slider>
                          </div>
                  </el-col>
                  <el-col :span="2">
                      <span>{{lightLevel.lightLevel1 + '%'}}</span>
                  </el-col>
                  <el-col :span="22">
                      <el-form-item label="第一时段电流" :label-width="formLabelWidth" prop="detail.currentFirst">
                          <el-input v-model="strategy.detail.currentFirst" :disabled="true">
                            <template slot="append">mA</template>
                          </el-input>
                      </el-form-item>
                  </el-col>
              </el-row>
              <el-row type="flex" align="middle">
                  <el-col :span="22">
                      <el-form-item label="第二段持续时间" :label-width="formLabelWidth" prop="detail.timeSecond">
                          <el-input v-model="strategy.detail.timeSecond" auto-complete="off" placeholder="请填写第二段持续时间">
                            <template slot="append">分钟</template>
                          </el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="2">
                      <span>亮度</span>
                  </el-col>
                  <el-col :span="10">
                          <div>
                              <el-slider v-model="lightLevel.lightLevel2" @change="changeLightLevel"></el-slider>
                          </div>
                  </el-col>
                  <el-col :span="2">
                      <span>{{lightLevel.lightLevel2 + '%'}}</span>
                  </el-col>
                  <el-col :span="22">
                      <el-form-item label="第二时段电流" :label-width="formLabelWidth" prop="detail.currentSecond">
                          <el-input v-model="strategy.detail.currentSecond" :disabled="true">
                            <template slot="append">mA</template>
                          </el-input>
                      </el-form-item>
                  </el-col>
              </el-row>
              <el-row type="flex" align="middle">
                  <el-col :span="22">
                      <el-form-item label="第三段持续时间" :label-width="formLabelWidth" prop="detail.timeThird">
                          <el-input v-model="strategy.detail.timeThird" auto-complete="off" placeholder="请填写第三段持续时间">
                            <template slot="append">分钟</template>
                          </el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="2">
                      <span>亮度</span>
                  </el-col>
                  <el-col :span="10">
                          <div>
                              <el-slider v-model="lightLevel.lightLevel3" @change="changeLightLevel"></el-slider>
                          </div>
                  </el-col>
                  <el-col :span="2">
                      <span>{{lightLevel.lightLevel3 + '%'}}</span>
                  </el-col>
                  <el-col :span="22">
                      <el-form-item label="第三时段电流" :label-width="formLabelWidth" prop="detail.currentThird">
                          <el-input v-model="strategy.detail.currentThird" :disabled="true">
                            <template slot="append">mA</template>
                          </el-input>
                      </el-form-item>
                  </el-col>
              </el-row>
              <el-row type="flex" align="middle">
                  <el-col :span="22">
                      <el-form-item label="第四段持续时间" :label-width="formLabelWidth" prop="detail.timeFourth">
                          <el-input v-model="strategy.detail.timeFourth" auto-complete="off" placeholder="请填写第四段持续时间">
                            <template slot="append">分钟</template>
                          </el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="2">
                      <span>亮度</span>
                  </el-col>
                  <el-col :span="10">
                          <div>
                              <el-slider v-model="lightLevel.lightLevel4" @change="changeLightLevel"></el-slider>
                          </div>
                  </el-col>
                  <el-col :span="2">
                      <span>{{lightLevel.lightLevel4 + '%'}}</span>
                  </el-col>
                  <el-col :span="22">
                      <el-form-item label="第四时段电流" :label-width="formLabelWidth" prop="detail.currentFourth">
                          <el-input v-model="strategy.detail.currentFourth" :disabled="true">
                            <template slot="append">mA</template>
                          </el-input>
                      </el-form-item>
                  </el-col>
              </el-row>
              <el-row type="flex" align="middle">
                  <el-col :span="22">
                      <el-form-item label="第五段持续时间" :label-width="formLabelWidth" prop="detail.timeFifth">
                          <el-input v-model="strategy.detail.timeFifth" auto-complete="off" placeholder="请填写第五段持续时间">
                            <template slot="append">分钟</template>
                          </el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="2">
                      <span>亮度</span>
                  </el-col>
                  <el-col :span="10">
                          <div>
                              <el-slider v-model="lightLevel.lightLevel5" @change="changeLightLevel"></el-slider>
                          </div>
                  </el-col>
                  <el-col :span="2">
                      <span>{{lightLevel.lightLevel5 + '%'}}</span>
                  </el-col>
                  <el-col :span="22">
                      <el-form-item label="第五时段电流" :label-width="formLabelWidth" prop="detail.currentFifth">
                          <el-input v-model="strategy.detail.currentFifth" :disabled="true">
                            <template slot="append">mA</template>
                          </el-input>
                      </el-form-item>
                  </el-col>
              </el-row>
              <el-row type="flex" align="middle">
                  <el-col :span="22">
                      <el-form-item label="第六段持续时间" :label-width="formLabelWidth" prop="detail.timeSixth">
                          <el-input v-model="strategy.detail.timeSixth" auto-complete="off" placeholder="请填写第六段持续时间">
                            <template slot="append">分钟</template>
                          </el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="2">
                      <span>亮度</span>
                  </el-col>
                  <el-col :span="10">
                          <div>
                              <el-slider v-model="lightLevel.lightLevel6" @change="changeLightLevel"></el-slider>
                          </div>
                  </el-col>
                  <el-col :span="2">
                      <span>{{lightLevel.lightLevel6 + '%'}}</span>
                  </el-col>
                  <el-col :span="22">
                      <el-form-item label="第六时段电流" :label-width="formLabelWidth" prop="detail.currentSixth">
                          <el-input v-model="strategy.detail.currentSixth" :disabled="true">
                            <template slot="append">mA</template>
                          </el-input>
                      </el-form-item>
                  </el-col>
              </el-row>
            </div>

            <div v-if="searchInfo.strategyType === 0">
              <el-row>
                 <el-col :span="8">
                  <el-form-item class="el-row--flex" label="所属项目" :label-width="formLabelWidth" prop="projectId">
                    <el-select v-model="strategy.projectId" placeholder="请选择所属项目" @change="selectProject">
                      <el-option
                        v-for="item in formSelection.projects"
                        :key="item.rowId"
                        :label="item.projectName"
                        :value="item.rowId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item  class="el-row--flex" label="所属路段" :label-width="formLabelWidth" prop="roadId">
                    <el-select v-model="strategy.roadId" placeholder="请选择所属路段">
                      <el-option
                        v-for="item in formSelection.roads"
                        :key="item.rowId"
                        :label="item.roadName"
                        :value="item.rowId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item  class="el-row--flex" label="策略类型" :label-width="formLabelWidth" prop="scheduleType">
                    <el-select v-model="strategy.scheduleType" placeholder="请选择所属路段">
                      <el-option label="开灯" value="1"></el-option>
                      <el-option label="关灯" value="2"></el-option>
                      <el-option label="调光" value="3"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item  class="el-row--flex" v-if="strategy.scheduleType === '3'"  label="调光值" :label-width="formLabelWidth" prop="brightness">
                    <el-slider v-model="strategy.brightness" style="width:200px"></el-slider>
                  </el-form-item>
                </el-col>
                
                <el-col :span="8">
                  <el-form-item  class="el-row--flex"  label="时间" :label-width="formLabelWidth" prop="theTime">
                    <el-time-picker
                      v-model="strategy.theTime"
                      format='HH:mm' 
                      placeholder="任意时间点">
                    </el-time-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
        </el-form>
        <div slot="footer" class="dialog-footer"> 
          <el-button @click="cancelUpdate()">取 消</el-button>
          <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
        </div>
      </el-dialog>
      
      <el-dialog class="dialog-common-sys" width="70%" title="太阳能策略绑定详情" :visible.sync="showDetailDialog" :modal-append-to-body='false' :close-on-click-modal='false'>
        <el-row type="flex" align="middle">
          <el-col :span="6" style="margin-right:auto;">
            <el-button
              type   = "primary"
              @click="useStrategy(scope.row.rowId)">写入策略</el-button>
          </el-col>
          <el-col :span="6">
            策略写入状态：
            <el-select v-model="searchInfo.strategyState" placeholder="请选择策略写入状态" @change="getBandingDetail()">
              <el-option
                v-for="item in strategyStateOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-table
          ref               = "multipleTable"
          :data             = "bandingDetail"
          tooltip-effect    = "dark"
          style             = "width: 100%"
          @selection-change = "handleSelectionChange">
          <el-table-column
            type  = "selection"
            width = "55">
          </el-table-column>
          <el-table-column
            prop  = "controlName"
            label = "单控器名称">
          </el-table-column>
          <el-table-column
            prop  = "policyResult"
            label = "策略写入状态"
            :formatter="policyResultFormatter">
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer"> 
          <el-button @click="showDetailDialog = false">关 闭</el-button>
        </div>
      </el-dialog>

      <el-dialog class="dialog-common-sys" width="30%" title="市灯策略绑定详情" :visible.sync="showCityDetailDialog" :modal-append-to-body='false' :close-on-click-modal='false'>
        <el-row>          
          <el-col :span="12">
            <el-input v-model="searchInfo.lampName" placeholder="请输路灯名称"></el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="searchLamp()">搜索</el-button>
          </el-col>
        </el-row>
        <el-table
          ref               = "multipleTableCity"
          :data             = "bandingDetail"
          tooltip-effect    = "dark"
          style             = "width: 100%"
          @selection-change = "handleSelectionChange">
          <el-table-column
            type  = "selection"
            width = "55">
          </el-table-column>
          <el-table-column
            prop  = "lampName"
            label = "路灯名称">
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer"> 
          <el-button type="primary"  @click="useStrategy">保 存</el-button>
          <el-button @click="showCityDetailDialog = false">关 闭</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import strategyAPI from '@/api/lighting/strategyAPI'
import lampConfAPI from '@/api/config/lampConf'

  const initstrategyCity = {
    rowId:'',
    name:'',//策略名字
    projectId:'',
    roadId:'',
    scheduleName:'',
    scheduleType:'',
    brightness:0,
    theTime: '',
  };
  const initstrategySun = {
      rowId:'',
      name:'',//策略名字
      currentMax:600, //太阳能策略最大电流
      detail:{//太阳能策略详细信息
        timeFirst:0,  //第一时段时间
        currentFirst:0,  //第一时段电流
        timeSecond:0,  //第二时段时间
        currentSecond:0,  //第二时段电流
        timeThird:0,    //第三时段时间
        currentThird:0, //第三时段电流
        timeFourth:0,   //第四时段时间
        currentFourth:0,  //第四时段电流
        timeFifth:0,    //第五时段时间
        currentFifth:0, //第五时段电流
        timeSixth:0,    //第六时段时间
        currentSixth:0, //第六时段电流
      }
    };
export default {
  data() {
    return {
      flag:'',  //判断新增还是修改
      total            : 0,  //数据总条数
      pageSize         : 10,  //每页容量
      currentPage      : 1,  //当前页
      tableData        : [],  //表格数据
      multipleSelection: [],  //表格多选框选中项
      showDialog       : false,
      showDetailDialog : false, //太阳能绑定
      showCityDetailDialog: false, //市灯绑定
      dialogTitle      : '',  //弹出框标题
      strategyType  : 0,//0表示市灯策略 1表示太阳能策略
      tableCol : [], //table列参数
      cityTableCol : [{
        label:'项目名称',
        prop:'projectName'
      },{
        label:'路段名称',
        prop:'roadName'
      },{
        label:'策略名称',
        prop:'scheduleName'
      },{
        label:'策略类型',
        prop:'scheduleType',
        formatter: this.scheduleTypeFormatter
      },{
        label:'策略时间',
        prop:'theTime'
      }],
      sunTableCol : [{
        label:'策略名称',
        prop:'name',
      },{
        label:'绑定灯控数量',
        prop:'bandNum',
        formatter: this.nullFormatter1
      },{
        label:'成功绑定数量',
        prop:'successNum',
        formatter:this.nullFormatter2
      }],
      searchInfo:{  //查询条件
        strategyType: 0,  //策略类型
        strategyName:'', //策略名字
        strategyState:'',  //策略写入状态
        lampName: '',//路灯名称
      },
      strategy:{  //太阳能策略
      },
      lightLevel:{  //各时段亮度
        lightLevel1:0,
        lightLevel2:0,
        lightLevel3:0,
        lightLevel4:0,
        lightLevel5:0,
        lightLevel6:0,
      },
      formLabelWidth: '120px',
      rules:{},
      strategyStateOptions:[  // 策略生效类型下拉框
        {
          name:'未生效',
          value:'0'
        },
        {
          name:'生效',
          value:'1'
        }
      ],
      bandingDetail:[],  //绑定详情(展示)
      bandingTableDetail: [],//绑定详情(缓存)  
      selectedStrategy:'',  //选中的策略id
      formSelection:{  //表单下拉选项
        projects:[  //项目
        ],
        roads:[  //路段
        ],
      }
    } 
  },
  components:{
  },
  created(){
    
      this.strategy = JSON.parse(JSON.stringify(initstrategyCity));
  },
  mounted(){
    this.getTableData();
  },
  methods: {
    getTableData(){  //获取所有策略信息
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        policyType:this.searchInfo.strategyType,
        policyName:this.searchInfo.strategyName
      };      
      strategyAPI.getList(params).then(res=>{
        this.total = res.total;
        this.tableData = res.records;
      })
    },
    formatTooltip(val){  //滑块格式化
        return val/100;
    },
    nullFormatter1(val){  //null数据格式化
      if(val.bandNum===null){
        return 0;
      }else{
        return val.bandNum;
      }
    },
    nullFormatter2(val){  //null数据格式化
      if(val.successNum===null){
        return 0;
      }else{
        return val.successNum;
      }
    },
    scheduleTypeFormatter(val){//策略类型数据格式化
      switch (val.scheduleType) {
        case "1":
          return "开灯"
          break;
        case "2":
          return "关灯"
          break;
        case "3":
          return "调光"
          break;
        default:
          return "未知"
          break;
      }
    },
    policyResultFormatter(val){  //策略写入状态格式化
      if(val.policyResult==='0' || val.policyResult===null ){
        return '未生效';
      }else{
        return '已生效';
      }
    },
    handleAdd(){  //打开新增框
      this.strategy.rowId = "";
      this.flag = 'add';
      this.dialogTitle = '新增';
      this.showDialog  = true;    
      if(this.searchInfo.strategyType===1){
        this.strategy = JSON.parse(JSON.stringify(initstrategySun));
      }else{
        this.strategy = JSON.parse(JSON.stringify(initstrategyCity));
      }
      this.queryFormOptions();//获取下拉菜单数据
    },
    handleEdit(){  //打开编辑框
      this.flag = 'edit';
      this.queryFormOptions();//获取下拉菜单数据
      if(this.multipleSelection.length != 0){  //判断是否选中
        if(this.multipleSelection.length === 1){ //判断是否选中单条
          var selected = this.multipleSelection[0];
          if(this.searchInfo.strategyType===1){
            strategyAPI.getSolarPolicyDetail(selected.rowId).then(res=>{
              this.strategy = Object.assign(this.strategy,res);
              this.initLightingLevel();
              this.dialogTitle = '编辑';
              this.showDialog  = true;
            })
          }else{            
            strategyAPI.getCityPolicyDetail(selected.rowId).then(res=>{
              this.strategy = Object.assign(this.strategy,res);
              this.strategy.name = res.scheduleName;
              this.strategy.theTime = new Date(2016, 9, 9, res.theTime.split(":")[0], res.theTime.split(":")[1])
              this.dialogTitle = '编辑';
              this.showDialog  = true;
            })
          }
         
        }else{
          this.$message({
            type   : 'warning',
            message: '不支持多条编辑'
          });
        }
      }else{
        this.$message({
          type   : 'warning',
          message: '请先选择一条记录'
        });
      }
    },
    initLightingLevel(){  //初始化亮度滑动条
      var currentData = this.strategy.detail;
      var max = this.strategy.currentMax;
      this.lightLevel.lightLevel1 = currentData.currentFirst/max*100;
      this.lightLevel.lightLevel2 = currentData.currentSecond/max*100;
      this.lightLevel.lightLevel3 = currentData.currentThird/max*100;
      this.lightLevel.lightLevel4 = currentData.currentFourth/max*100;
      this.lightLevel.lightLevel5 = currentData.currentFifth/max*100;
      this.lightLevel.lightLevel6 = currentData.currentSixth/max*100;
    },
    handleDelete(){  //删除选中记录
      if(this.multipleSelection.length != 0){ //判断是否选中
        this.$confirm('确定要删除此条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          var idList = [];
          this.multipleSelection.map(item=>{
            idList.push(item.rowId);
          })
          this.doDelete(idList);
        }).catch(() => {
          this.$message({
            type   : 'info',
            message: '已取消删除'
          });
        });
      }else{
        this.$message({
          type   : 'warning',
          message: '请先选择一条记录'
        });
      }
    },
    doDelete(ids){  //处理删除请求
      if(this.searchInfo.strategyType===1){
        strategyAPI.doDelete(ids).then(res=>{
          if(res){
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.getTableData();
          }else{
            this.$message.error('服务器错误');
          }
        })
      }else{        
        strategyAPI.doDeleteCity(ids).then(res=>{
          if(res){
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.getTableData();
          }else{
            this.$message.error('服务器错误');
          }
        })
      }
    },
    saveOrUpdate(){  //处理新增或编辑
      if(this.searchInfo.strategyType===1){
        strategyAPI.addOrEdit(this.strategy).then(res=>{
          if(res.result){
            this.$refs['Form'].resetFields()
            this.showDialog = false;
            this.$message({
              type: 'success',
              message: this.flag == 'add' ? '新增成功' : '修改成功'
            });
            this.getTableData();
          }else{
            this.$message.error('服务器错误');
          }
        })
      }else{
        let h = this.strategy.theTime.getHours();
        h = h>9?h:"0"+h;
        let mm = this.strategy.theTime.getMinutes();
        mm =  mm>9?mm:"0"+mm;
        let theTime = h + ":"+mm +":00"; 
        let params=JSON.parse(JSON.stringify(this.strategy));
        params.theTime = theTime;
        params.scheduleName = this.strategy.name;
        let {name, ...params1} = params   
        strategyAPI.addOrEditCity(params1).then(res=>{
        if(res.result){
          this.showDialog = false;
          this.$message({
            type: 'success',
            message: this.flag == 'add' ? '新增成功' : '修改成功'
          });
          this.getTableData();
        }else{
          this.$message.error('服务器错误');
        }
      })
      }
    
    },
    cancelUpdate(){  //取消新增或编辑
      this.showDialog = false;
      this.$refs['Form'].resetFields();
      this.lightLevel={  //各时段亮度
        lightLevel1:0,
        lightLevel2:0,
        lightLevel3:0,
        lightLevel4:0,
        lightLevel5:0,
        lightLevel6:0,
      }
    },
    handleSelectionChange(val) {  //获取选中项
      this.multipleSelection = val;
    },
    current_change(currentPage){  //翻页
      this.currentPage = currentPage;
      this.getTableData();
    },
    changeLightLevel(val){  //通过亮度计算电流数值
        this.strategy.detail.currentFirst = this.strategy.currentMax * this.lightLevel.lightLevel1 /100;
        this.strategy.detail.currentSecond = this.strategy.currentMax * this.lightLevel.lightLevel2 /100;
        this.strategy.detail.currentThird = this.strategy.currentMax * this.lightLevel.lightLevel3 /100;
        this.strategy.detail.currentFourth = this.strategy.currentMax * this.lightLevel.lightLevel4 /100;
        this.strategy.detail.currentFifth = this.strategy.currentMax * this.lightLevel.lightLevel5 /100;
        this.strategy.detail.currentSixth = this.strategy.currentMax * this.lightLevel.lightLevel6 /100;
    },
    checkCurrent(){  //控制最大负载电流
      if(this.strategy.currentMax > 2000) this.strategy.currentMax = 2000;
    },
    getBandingDetail(row){  //获取策略绑定详情
      if(row) {
        this.selectedStrategy = row;
      }
      strategyAPI.queryBandLampConList(this.selectedStrategy.rowId).then(res=>{
        var vm = this;
        function filterFunc(item){
          if(vm.searchInfo.strategyState==='0'){
            return item.policyResult === vm.searchInfo.strategyState || item.policyResult === null
          }else{
            return item.policyResult === vm.searchInfo.strategyState
          }
        }
        this.bandingDetail = this.searchInfo.strategyState===""?res:res.filter(filterFunc);
        this.showDetailDialog = true;
      })
    },

    getBandingDetailCity(row){//获取策略绑定详情市灯
      this.selectedStrategy = row;
      strategyAPI.queryLampListByProject(this.selectedStrategy).then(res=>{
        this.bandingDetail = res;
        this.bandingTableDetail = this.bandingDetail;
        this.showCityDetailDialog = true;
        this.bindLampListQuery(); //勾选已绑定灯具
      })
    },

    bindLampListQuery(){//已经绑定的灯具查询
      let params = {
        lampScheduleConfigId: this.selectedStrategy.rowId
      }
      strategyAPI.bindLampListQuery(params).then(res=>{
        let selectIds =  res.map(res=>res.lampId);
        this.multipleSelection = this.bandingTableDetail.filter(res=>selectIds.includes(res.rowId));
        this.multipleSelection.forEach(row => {
          this.$refs.multipleTableCity.toggleRowSelection(row,true)
        });
      })
    },
    dialogStrategyTypeChange(val){ // 点击新增dialog切换策略类型
      
    },
    queryFormOptions(){//获取下拉菜单数据
      this.queryProjectOptions();
    },
    queryProjectOptions(){  //获取项目下拉框数据
      lampConfAPI.queryProjectOptions().then(res=>{
        this.formSelection.projects = res;
        if(this.strategy.projectId){
          this.queryRoadOptions(this.strategy.projectId)
        }
      })
    },       
    queryRoadOptions(projectId){  //获取路段下拉框数据
      lampConfAPI.queryRoadOptions(projectId).then(res=>{
        this.formSelection.roads = res;
      })
    }, 
    selectProject(val){  //选中项目查询路段信息
      this.strategy.roadId = "";
      this.queryRoadOptions(val);
    },
    searchLamp(){ //过滤路灯名称
      this.bandingDetail  =  this.bandingTableDetail.filter(res=>{
        return res.lampName.indexOf(this.searchInfo.lampName)!==-1
      });
    },
    useStrategy(){//保存绑定策略
      switch (this.searchInfo.strategyType) {
        case 0:
          let params = {
            lampScheduleConfigId: this.selectedStrategy.rowId,
            lampIds:this.multipleSelection.map(res=>res.rowId)
          }      
          strategyAPI.bindLampListUpdate(params).then(res=>{
            if(res){          
                this.$message({
                  type: 'success',
                  message: '绑定成功'
                });
              this.showCityDetailDialog = false;
            }else{
              this.$message.error('服务器错误');
            }
          
          })
          break;
      
        default:
          break;
      }
      
    }
  }
}
</script>
<style scoped>
  .el-form-item{
    margin-bottom:0;
  }
  .el-row--flex{
    margin-bottom:20px;
  }
</style>
