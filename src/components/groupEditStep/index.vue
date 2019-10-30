<template>
    <el-dialog class="dialog-common-sys dialog-step"  :title="groupModalInfo.editType==='1'?'新增':'修改'" :visible.sync="showDialog" :modal-append-to-body='false' :close-on-click-modal='false' @close="cancelUpdate()">
      
    <el-steps :active="active" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="策略"></el-step>
        <el-step title="成员"></el-step>
    </el-steps>
        <el-form :model="groupModalInfo.groupInfo" v-if="active ===0"  :inline="true" :rules="rules" ref="groupInfoForm">
            <el-form-item label="分组名称" prop="groupName">
                <el-input v-model="groupModalInfo.groupInfo.groupName"></el-input>
            </el-form-item>
            <el-form-item label="分组类型" prop="groupTypeFlag">
                <el-select v-model="groupModalInfo.groupInfo.groupTypeFlag">
                    <el-option 
                        v-for="item in groupTypeOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
        </el-form>

        <div v-if="active ===1 || active ===2">
            <el-table 
                ref="multipleTable"
                :data="active === 1?tableData:tableDataLamp"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="expand">
                    <template v-if="active === 1" slot-scope="scope">
                        <el-row :gutter="24" v-for="item in scope.row.scheduleConfigList" :key="item.rowId">
                            <el-col :span="8">策略类型：{{item.scheduleType | scheduleTypeFilter(scheduleTypeOptions)}}</el-col>
                            <el-col :span="8">时间：{{item.theTime}}</el-col>
                            <el-col :span="8" v-if="item.scheduleType==='3'">调光值：{{item.brightness}}</el-col>
                        </el-row>
                    </template>
                    <template v-if="active === 2" slot-scope="scope">
                        <el-row >
                            <el-col :span="8">路段：{{scope.row.roadName || '-'}}</el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                
                <el-table-column style="height:500px;overflow:auto"
                    v-for="col in active === 1?scheduleCol:lampCol"
                    :prop="col.prop" :label="col.label"  :formatter="col.formatter" :key="col.prop">
                </el-table-column>
            </el-table>
        </div>

        <!-- <div v-if="active ===2">
            <el-table 
                ref="multipleTableLamp"
                :data="tableDataLamp"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    prop="controlerName"
                    :sortable="true"
                    label="单控器">
                </el-table-column>
            </el-table>
        </div> -->
        
      <div slot="footer" class="dialog-footer"> 
        <el-button @click="cancelUpdate()">取 消</el-button>
        <el-button style="margin-top: 12px;" v-if="active!==0" @click="prev()">上一步</el-button>
        <el-button style="margin-top: 12px;" v-if="active!==2"  @click="next()">下一步</el-button>
        <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
      </div>
    </el-dialog>
</template>

<script>
import api from '@/api/lighting/groupAPI'
import { Message, MessageBox } from 'element-ui'
import { validForbid } from '@/utils/validate'
import { mapState } from 'vuex';
export default {
    name: 'groupEditStep',
    props:["groupModalInfo"],
    data() {
        return {
            showDialog: false,
            centralizedControllorList: [],
            groupTypeOption: [],
            dialogTitle:'',
            active: 0,
            total            : 0,  //数据总条数
            pageSize         : 6,  //每页容量
            currentPage      : 1,  //当前页
            tableData: [], //所有策略
            tableDataLamp: [],//单控器
            scheduleTypeOptions:[],//策略类型
            scheduleCol:[
                {
                    label:'策略名称',
                    prop:'scheduleName'
                }],
            lampCol:[
                {
                    label:'单控器',
                    prop:'controlerName'
                },{
                    label:'组号',
                    prop:'groupNo',
                    formatter:this.groupNoFormatter
                }],
            rules:{
                groupName: [
                    { required: true, message: '请输入策略名', trigger: 'blur' },
                    { trigger: 'blur', validator: validForbid }
                ],
                groupTypeFlag: [
                    { required: true, message: '请选择分组类型', trigger: 'change' }
                ],
            },
            loading:'',
            progressShow: false,
            progress:0,//操作进度
            actionKeyList:[],
            totalActionKeyList:[],
            sucActionKeyList:[],
            failActionKeyList:[],
            progressTimeOut: '',
        };
    },
    beforeMount(){
        this.getScheduleTypeMap();//获取策略类型
    },
    computed:{
        ...mapState({
            websocketData: state=>state.websock.websocketData,
        }),
    },
    filters: {
        scheduleTypeFilter:function(value,args1){  //策略写入状态格式化
            let item = args1.find(res=>res.value==value)
            return item?item.label:'-'
        },
    },
    destroyed(){
        
        clearTimeout(this.progressTimeOut);
    },
    watch: {
        active(newValue, oldValue) {
            switch (newValue) {
                case 1:
                    this.getStrategyList();
                    break;
            
                case 2:
                    this.getLampListByProject();
                    break;
                default:
                    break;
            }
    　　},
        groupModalInfo: {
    　　　　handler(newValue, oldValue) {
    　　　　　　this.groupModalInfo = newValue;
    　　　　},
        },

        websocketData(newer, older){
            if(newer.result!=='resend' && this.totalActionKeyList.indexOf(newer.actionKey)!==-1){
                if(newer.result==='fail'){
                    this.failActionKeyList.push(newer.actionKey)
                }else if(newer.result==='success'){                
                    this.sucActionKeyList.push(newer.actionKey)
                }
                this.actionKeyListCheck(newer.actionKey)
            }
        },
　　　　deep: true
    },
    methods: {
        
        actionKeyListCheck(actionKey){
            this.actionKeyList.splice(this.actionKeyList.findIndex(item => item === actionKey), 1)
            let failLen = this.failActionKeyList.length||0;
            let TolLen = this.totalActionKeyList.length;
            let sucLen = this.sucActionKeyList.length||0;
            this.progress = parseFloat(sucLen/TolLen).toFixed(2)*100;//当前进度
            if(this.actionKeyList.length===0){
                this.progress = 50;
                if(this.failLen!==0){                    
                    this.$message({
                        type: 'warning',
                        message: sucLen+"条成功,"+failLen+"条失败！"
                    });
                }else{ 
                    this.$message({
                        type: 'success',
                        message: "成员保存成功"
                    });
                }   
                this.loading.close();
                clearTimeout(this.progressTimeOut);             
                this.getLampListByProject();
            }
        },
        // 显示加载Loading
        lodingShow(){
            this.progressTimeOutFun();        
            this.loading = this.$loading({
                lock: true,
                text: '指令发送中，请稍候',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });        
        },

        
        progressTimeOutFun(){
            this.progressTimeOut = setTimeout(() => {
                if(this.loading){
                    this.loading.close();            
                    this.$message({
                        type: 'warning',
                        message: "指令发送超时"
                    });
                }
            }, 1000 * 90);
        },
    
        next() {
            switch (this.active) {
                case 0:
                    this.saveGroupName({type:"next"});
                    break;
                case 1:
                    this.bindStrategy({type:"next"});
                    break;
                default:
                    if (this.active++ > 2) this.active = 0;
                    break;
            }
        },
        prev() {
            if(this.active === 1 && this.groupModalInfo.editType===1) this.groupModalInfo.editType = 2;//新增点击上一步变更为修改，否则多次提交新增
            if (this.active-- < 0) this.active = 2;
        },
       
        getScheduleTypeMap(){//获取策略类型
            api.getScheduleTypeMap().then(res=>{
                this.scheduleTypeOptions = res;
            })
        },
        groupNoFormatter(val){ //分组格式化
            return val.groupNo?val.groupNo:"未分组";
        },
        saveGroupName(obj){//修改分组名称
            this.$refs['groupInfoForm'].validate((valid,e) => {
                if (valid) {
                    let params = {
                        projectId: this.$parent.projectId,
                        groupName: this.groupModalInfo.groupInfo.groupName,
                        groupTypeFlag: this.groupModalInfo.groupInfo.groupTypeFlag
                    }            
                    if(this.groupModalInfo.editType===2){
                        params = this.groupModalInfo.groupInfo;
                    }
                    delete params["groupType"]; //后台暂未开发分组类型
                    api.updateLampGroup(params).then(res=>{
                        this.groupModalInfo.groupInfo = res.LightingLampGroup;
                        if(obj.type==='cancel'){this.cancelUpdate();}
                        else if(obj.type==="next"){ if (this.active++ > 2) this.active = 0;}
                    })
                }
            })
        },
        bindStrategy(obj){//绑定策略
            let params = {
                groupId: this.groupModalInfo.groupInfo.rowId,
                scheduleIdList:this.multipleSelection.map(res=>res.rowId)
            }      
            api.updateSchedule(params).then(res=>{
                if(res){          
                    this.$message({
                        type: 'success',
                        message: '策略绑定成功'
                    });
                    if(obj.type==='cancel'){this.cancelUpdate();}
                    else if(obj.type==="next"){ if (this.active++ > 2) this.active = 0;}
                }else{
                    this.$message.error('服务器错误');
                }
            
            })
        },
        
        setGroupLamp(){  //修改分组--成员修改
            let lampIdList = this.multipleSelection.map(it=>it.rowId)
            var data = {
                groupId: this.groupModalInfo.groupInfo.rowId,
                lampConIdList: lampIdList
            }
            api.bindLampListUpdate(data).then(res=>{
                if(res.result==="success"){          
                    this.$message({
                        type: 'success',
                        message: '成员绑定成功'
                    });
                    this.cancelUpdate();
                    this.active = 0;
                }else if(res.result==="error"){      
                    this.$message.error('成员绑定失败');
                }else if(res.result==="wait"){    
                    this.lodingShow();  
                    this.sucActionKeyList=[];
                    this.failActionKeyList=[];
                    this.actionKeyList = res.actionKeyList.map(it=>it.actionKey);
                    this.totalActionKeyList = res.actionKeyList.map(it=>it.actionKey);
                }else{
                    this.$message.error('服务器错误');
                }
            })
            
            
        },
        getStrategyList(){  //获取所有策略信息
            let params = {
                groupId: this.groupModalInfo.groupInfo.rowId
            };      
            api.getStrategyList(params).then(res=>{
                this.tableData = res;
                res.map(it=>{
                    if(it.isBind){
                        this.$nextTick(()=> {
                            this.$refs.multipleTable.toggleRowSelection(it);
                        })
                    }
                })
            })
        },     
        getLampListByProject(){  //获取所有单控器/路灯
            let params = {                
                groupId: this.groupModalInfo.groupInfo.rowId
            }
            api.queryLampListByProject(params).then(res=>{
                this.tableDataLamp = res;
                res.map(it=>{
                    if(it.inGroup){
                        this.$nextTick(()=> {
                            this.$refs.multipleTable.toggleRowSelection(it);
                        })
                    }
                })
            })
        },           
        handleSelectionChange(val) {  //获取选中项
            this.multipleSelection = val;
        },
        
        current_change(currentPage){  //翻页
            this.currentPage = currentPage;
            switch (this.active) {
                case 1:
                    this.getStrategyList();
                    break;
                case 2:
                    this.getLampListByProject();
                    break;
            
                default:
                    break;
            }
        },
        cancelUpdate(){
            this.showDialog = false;
            this.$parent.getTableData();
        },

        saveOrUpdate(){
            switch (this.active) {
                case 0:
                    this.saveGroupName({type:'cancel'});
                    break;
                case 1:
                    this.bindStrategy({type:'cancel'});
                    break;
                case 2:
                    this.setGroupLamp(1);
                    break;
            
                default:
                    break;
            }
        },
    }
}
</script>

<style rel="stylesheet/scss" scoped lang="scss">
    .dialog-step .dialog-footer{
        text-align: center;
    }
    .dialog-step .el-table{
        height: 500px;
        overflow: auto;
    }
    
</style>