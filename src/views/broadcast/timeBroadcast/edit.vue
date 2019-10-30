<template>
  <el-dialog id="timeDialog" ref="dialog" :title="dialogObj.title" 
    :visible.sync="dialogObj.isShow" 
    :modal-append-to-body='false' 
    :close-on-click-modal='false'
    :append-to-body="true" 
    @close="closeDialog">
		<el-form id="equipConigForm" :inline="true" ref="formData" :model="formData" :rules="rules" label-width="130px">
      <el-form-item label="任务名称" prop="taskname">
        <el-input clearable v-model.trim="formData.taskname" placeholder="任务名称"></el-input>
      </el-form-item>
      <el-form-item label="执行时间" prop="starttime">
        <el-time-picker v-model="formData.starttime"
          type="fixed-time"
          placeholder="选择时间"
        >
        </el-time-picker>
      </el-form-item>
      <el-form-item label="执行模式" prop="scheduletype">
        <el-select v-model="formData.scheduletype" placeholder="请选择" @change="selType">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="周期类型" v-show="isTrue" prop="weekdays">
        <el-checkbox-group v-model="formData.weekdays" @change="handleCheckList">
          <el-checkbox v-for="week in weekData" :label="week.value" :key="week.label" style="margin-left: 14px;">{{week.label}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="开始日期" prop="startdate">
        <el-date-picker
          v-model="formData.startdate"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期" prop="enddate">
        <el-date-picker
          v-model="formData.enddate"
          type="date"
          placeholder="选择日期"
          >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="播放模式" prop="playModeData">
        <el-select v-model="formData.playModeData" placeholder="请选择">
          <el-option
            v-for="item in playData"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="持续时间">
        <el-radio-group v-model="playTime" @change="handleClick">
          <el-radio-button label="0">播放一遍</el-radio-button>
          <el-radio-button label="1">自定义</el-radio-button>
        </el-radio-group>
        <div class="timeNumber">
          <el-input clearable type="number" :disabled="isStart" min="0" max="24" oninput="if(value>24)value=24" v-model="formData.hours" class="number"></el-input>时
          <el-input clearable type="number" :disabled="isStart" min="0" max="59" oninput="if(value>59)value=59" v-model="formData.minutes" class="number"></el-input>分
          <el-input clearable type="number" :disabled="isStart" min="0" max="59" oninput="if(value>59)value=59" v-model="formData.seconds" class="number"></el-input>秒
        </div>
      </el-form-item>
      <el-form-item label="媒体文件" style="display:block;" prop="fileListData">
        <el-button type="primary" @click="selFile" style="float:left;margin-right: 10px;">选择</el-button>
        <div class="terminalText">
          <span v-for="selFileName in fileListData">//{{selFileName.name}},</span>
        </div>
      </el-form-item>
      <el-form-item label="目标终端" style="display:block;" prop="terminalData">
        <el-button type="primary" @click="selTerminal" style="float:left;margin-right: 10px;">选择</el-button>
        <div class="terminalText">
          <span v-for="terminal in terminalData">{{terminal.name}},</span>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="edit(form)" :loading="isLoading">确 定</el-button>
    </div>
    <file @fileClose="fileClose" :fileDialog="fileDialog" @fileDialogClose="fileDialogClose"></file>
    <terminal @terminalClose="terminalClose" :terminalDialog="terminalDialog" @terminalDialogClose="terminalDialogClose"></terminal>
	</el-dialog>
</template>
<script>
  import timeConfigAPI from '@/api/broadcast/timeBroadcast'
  import file from './fileList.vue'
  import terminal from './terminal.vue'
  import '@/assets/js/plugins/hkvVideo/jquery-1.7.1.min.js'
  import { parseTime,formatSeconds } from '@/utils/index'
  export default {
    props: {
      dialogObj: Object,
    },
    data() {
      var validateFileList = (rule, value, callback) => {
        if(this.fileListData.length>0){
          callback();
        }else{
          callback(new Error('请选择文件')); 
        }
      };
      var validateTerminal = (rule, value, callback) => {
        if(this.terminalData.length>0){
          callback();
        }else{
          callback(new Error('请选择目标终端')); 
        }
      };
      return {
        fileDialog: {
          isHidden: false,
        },
        terminalDialog:{
          isShow: false
        },
        options: [
          {
            value: '0',
            label: '每天'
          },
          {
            value: '1',
            label: '每周'
          }
   
        ],
        weekData:[
          {
            value: '1',
            label: '星期一'
          },
          {
            value: '2',
            label: '星期二'
          },
          {
            value: '3',
            label: '星期三'
          },
          {
            value: '4',
            label: '星期四'
          },
          {
            value: '5',
            label: '星期五'
          },
          {
            value: '6',
            label: '星期六'
          },
          {
            value: '7',
            label: '星期日'
          }
        ],
        playData:[
          {
            value: '0',
            label: '顺序播放'
          },
          {
            value: '1',
            label: '随机播放'
          },
        ],
        isLoading: false,
        isTrue: false,
        isStart: true,
        form: {
          taskname: null,
          isdisable:0,
          level:0,
          creator: "admin",
          triggers: null,
          commands: null,
        },
        formData:{
          taskname: null,
          starttime: null,
          startdate: '',
          scheduletype: null,
          weekdays: [],
          enddate: '',
          playModeData:null,
          hours:"00",
          minutes:'00',
          seconds:'00'
        },
        fileListData: [],//媒体文件
        terminalData: [],//目标终端
        taskId:null,
        pageCount: 10,
        pageIndex: 0,
        playTime:'0',//持续时间
        rules: {
          taskname: [
            { required: true, message: '请输入任务名称', trigger: 'blur' }
          ],
          starttime: [
            { type: 'date', required: true, message: '请选择执行时间', trigger: 'change' }
          ],
          scheduletype: [
            { required: true, message: '请选择执行模式', trigger: 'change' }
          ],
          startdate: [
            { required: true, message: '请选择开始日期', trigger: 'change' }
          ],
          enddate: [
            { required: true, message: '请选择结束日期', trigger: 'change' }
          ],
          playModeData: [
            { required: true, message: '请选择播放模式', trigger: 'change' }
          ],
          fileListData: [
            { validator: validateFileList, trigger: 'blur' }
          ],
          terminalData: [
            { validator: validateTerminal, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      // 执行模式选择
      selType(selVal){
        if(selVal == "1"){
          this.isTrue = true;
        }else{
          this.isTrue = false;
        }
      },

      handleCheckList(val){  //选中单个
        this.formData.weekdays = val;  
      },

      // 点击选择文件
      selFile(){
        this.fileDialog.isHidden = true;
      },

      // 持续时间
       handleClick(val) {
        if(val == '0'){
          this.isStart = true;
          this.playTime = val;
        }else{
          this.isStart = false;
          this.playTime = val;
        }
      },

      // 点击选择目标终端
      selTerminal(){
        this.terminalDialog.isShow = true;
      },
      closeDialog() {
        this.$refs['formData'].resetFields();
        this.$emit('handleClose');
        this.resetFields();
      },
      resetFields(){
        this.form.triggers = null;
        this.form.commands = null;
        this.formData.starttime = null;
        this.formData.startdate = '';
        this.formData.scheduletype = null;
        this.formData.weekdays = [];
        this.formData.enddate = '';
        this.isTrue = false;
        this.fileListData = [];
        this.terminalData = [];
      },
      fileClose(){
        this.fileDialog.isHidden = false;
      },
      terminalClose(){
        this.terminalDialog.isShow = false;
      },
      fileDialogClose(data){
        this.fileListData = data;
      },
      terminalDialogClose(data){
        this.terminalData = data;
      },
      edit(form) {
        this.$refs['formData'].validate((valid) => {
          if (valid) {
            this.isLoading = !this.isLoading;
            this.form.taskname = this.formData.taskname;
            let newStartDate =  parseTime(this.formData.startdate,'{y}-{m}-{d}');//开始日期
            let newEndDate =  parseTime(this.formData.enddate,'{y}-{m}-{d}');//结束日期
            let starttime = new Date(this.formData.starttime)
            starttime =  starttime.getHours()+"-"+starttime.getMinutes()+"-"+starttime.getSeconds();//开始执行时间
            let weekdays = this.formData.weekdays.sort();//周期类型
            weekdays = weekdays.join("<");
            let saveForm = '|0*'+ newStartDate + '*'+newEndDate+'*'+ starttime+'*'+this.formData.scheduletype+'*'+weekdays+'|';
            this.form.triggers = saveForm;
            var fileListDataUpload = [];//选中的文件
            if(this.fileListData.length>0){
              for(var i=0;i<this.fileListData.length;i++){
                fileListDataUpload.push('//'+this.fileListData[i].name+"<");
              }
            }
            // 选中的终端
            let terminalDataList = [];
            if(this.terminalData.length>0){
              for(var i=0;i<this.terminalData.length;i++){
                terminalDataList.push(this.terminalData[i].id);
              }
            }
            fileListDataUpload = fileListDataUpload.toString();
            terminalDataList = terminalDataList.join("<");

            let duringTime;
            if(this.playTime == '0'){
              duringTime = '0';
            }else {
              duringTime = parseInt(this.formData.hours)*3600 + parseInt(this.formData.minutes)*60 + parseInt(this.formData.seconds);
            }
            let fileUpload = '|3*'+duringTime+'*0*0*'+fileListDataUpload+'*'+terminalDataList+'*0*0*0**'+this.formData.playModeData+'|';
            this.form.commands = fileUpload;
            if(this.taskId){
              this.form.taskId = this.taskId;
              timeConfigAPI.taskEdit(form).then(res=>{
                if(res.res == 1){
                  setTimeout(() => {
                    this.closeDialog();
                    this.refresh();
                    this.isLoading = !this.isLoading;
                    this.resetFields();
                  }, 1500);
                }
              })
            }else{
              timeConfigAPI.add(form).then(res=>{
                if(res.res == 1){
                  setTimeout(() => {
                    this.closeDialog();
                    this.refresh();
                    this.isLoading = !this.isLoading;
                    this.resetFields();
                  }, 1500);
                }
              })
            }
          }
        });
      },
      refresh() {
        this.$emit('init');
      },
      // 获取单个任务信息
      getTableData(data){
        timeConfigAPI.edit(data).then(res=>{
          this.formData.taskname = res.name;
          let startTime = res.triggers[0].starttime;
          startTime = new Date(2016, 9, 10,  startTime.split(":")[0], startTime.split(":")[1], startTime.split(":")[2]);
          this.formData.starttime = startTime;
          this.formData.startdate = res.triggers[0].startdate;
          this.formData.enddate = res.triggers[0].enddate;
          this.formData.scheduletype = res.triggers[0].scheduletype;
          if(res.triggers[0].scheduletype == '0'){
            this.isTrue = false;
          }else if(res.triggers[0].scheduletype == '1'){
            this.isTrue = true;
          }
          let filesItem = res.commands[0].files;
          filesItem = filesItem.split(',');
          let newFilesItem = [];
          for(var i=0;i<filesItem.length;i++){
            newFilesItem.push(filesItem[i].slice(2,-1))
          }
          newFilesItem = newFilesItem.map(item => ({name:item}))
          this.fileListData = newFilesItem;
          let weekDays = res.triggers[0].weekdays;
          weekDays = weekDays.split("<");
          for(var i=0;i<this.weekData.length;i++){
            for(var j=0;j<weekDays.length;j++){
             if(this.weekData[i].value == weekDays[j]){
                this.formData.weekdays.push(weekDays[j]);
             }
            }
          }
          let targetId = res.commands[0].targets;
          this.formData.playModeData = res.commands[0].israndom;
          targetId = targetId.replace(/</g, ',');
          let data = {
            pageIndex: this.pageIndex,
            pageCount: this.pageCount,
            showType: 0,
            user: "admin",
            searchTxt:targetId
          };
          timeConfigAPI.singTask(data).then(res=>{
            this.terminalData = res.rows;
          });
          let formatSecond = formatSeconds(res.commands[0].durations);
          if(formatSecond == "00:00:00"){
            this.isStart = true;
            this.playTime = '0';
            this.formData.hours = '00';
            this.formData.minutes = '00';
            this.formData.seconds = '00';
          }else{
            this.isStart = false;
            this.playTime = '1';
            formatSecond = formatSecond.replace(/:/g, ',')
            formatSecond = formatSecond.split(',');
            this.formData.hours = formatSecond[0];
            this.formData.minutes = formatSecond[1];
            this.formData.seconds = formatSecond[2];
          }
        })
      },
    },
    watch: {
      dialogObj:{
        handler(val, oldVal) {
          this.taskId = val.id;
          let data = {
            taskId: this.taskId,
          }
          if(val.isShow){
            if(val.id){
              this.getTableData(data);
            }
          }
        },
        deep: true
      }
    },
    components:{
      file,
      terminal
    },
  }
</script>
<style lang="scss">
  #timeDialog {
    .el-dialog {
      width: 800px;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 200px;
    }
  }
 
  #videoConigForm {
    width: 700px;
    margin: 0 auto;
    input{
      width: 220px;
    }
    .el-checkbox {
      margin-left: 14px!important;
    }
  }
  .terminalText {
    display: inline-block;
    width: 490px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .timeNumber {
    display: inline-block;
    margin-left: 20px;
    .number {
      display: inline-block;
      width: 85px;
      margin-right: 15px;
      margin-right: 3px;
      margin-left: 10px;
    }
    .el-input--suffix .el-input__inner{
      padding-right: 0;
    }
    .el-input__suffix {
      display: none;
    }
  }
</style>
