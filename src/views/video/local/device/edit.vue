<template>
<div>
  <el-dialog id="monitorDialog" ref="dialog" :title="dialogObj.title" 
  :visible.sync="dialogObj.isShow" 
  :modal-append-to-body='false' 
  :close-on-click-modal='false'
  @close="closeDialog">
		<el-form id="videoConigForm" :inline="true" ref="form" :model="form" :rules="rules" label-width="130px">
      <el-row>
        <el-form-item label="监控类型">
          <el-radio-group :disabled="form.rowId?true:false" v-model="form.nvr" @change="NVRChange">
            <el-radio label="1">NVR</el-radio>
            <el-radio label="0">IPC</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <el-form-item label="设备名称" prop="cameraName">
        <el-input clearable v-model.trim="form.cameraName" placeholder="请输入设备名称"></el-input>
      </el-form-item>
      <el-form-item label="设备编号" prop="cameraNo">
        <el-input clearable v-model.trim="form.cameraNo" placeholder="请输入设备编号"></el-input>
      </el-form-item>
      <el-form-item label="IP地址" prop="ip">
        <el-input clearable v-model.trim="form.ip" placeholder="请输入IP地址"></el-input>
      </el-form-item>
      <el-form-item label="端口号" prop="port">
        <el-input clearable v-model.trim="form.port" placeholder="请输入端口号"></el-input>
      </el-form-item>
      <el-form-item label="设备用户名" prop="cameraUser">
        <el-input clearable v-model.trim="form.cameraUser" placeholder="请输入设备用户名"></el-input>
      </el-form-item>
      <el-form-item label="设备密码" prop="cameraPassword">
        <el-input clearable v-model.trim="form.cameraPassword" placeholder="请输入设备密码"></el-input>
      </el-form-item>
      <el-form-item label="厂家">
        <el-select v-model.trim="form.tenderId" filterable clearable placeholder="请选择厂家">
          <el-option
            v-for="item in tenderOptions"
            :key="item.rowId"
            :label="item.venderName"
            :value="item.rowId"
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="安装时间">
        <el-date-picker
          v-model.trim="form.installTime"
          type="date"
          value-format="timestamp"
          :editable="false"
          placeholder="请选择安装时间">
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="设备型号" prop="cameraModel">
        <el-input clearable v-model.trim="form.cameraModel" placeholder="请输入设备型号"></el-input>
      </el-form-item>
      <el-form-item label="设备MAC" prop="cameraMac">
        <el-input clearable v-model.trim="form.cameraMac" placeholder="请输入设备MAC"></el-input>
      </el-form-item> -->
      <el-row v-if="form.nvr != '1'">
        <el-form-item label="摄像头类型">
          <el-select v-model.trim="form.cameraType" filterable clearable placeholder="请选择摄像头类型">
            <el-option label="枪机" value="0"></el-option>
            <el-option label="半球" value="1"></el-option>
            <el-option label="球机" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属灯杆" prop="lampPostId">
          <el-select @change="lampPostChange" v-model.trim="form.lampPostId" filterable clearable placeholder="请选择所属灯杆">
            <el-option
              v-for="item in lampPostOptions"
              :key="item.rowId"
              :label="item.lampPostCode"
              :value="item.rowId"
              >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经度">
          <el-input readonly v-model.trim="form.longitude"></el-input>
        </el-form-item>
        <el-form-item label="纬度">
          <el-input readonly v-model.trim="form.latitude"></el-input>
        </el-form-item>
      </el-row>
      <el-row v-if="form.nvr == '1'">
        <el-row>
          <el-button
          size="mini"
          type="success"
          @click="handleAdd">新增通道号</el-button>
          <el-button
          size="mini"
          @click="handleEdit">编辑通道号</el-button>
          <el-button
          size="mini"
          type="danger"
          @click="handleDelete"
          >删除通道号</el-button>
        </el-row>
        <el-table
          :stripe="true"
          ref="multipleTable"
          :data="iChannelOptions"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="40">
          </el-table-column>
          <el-table-column
            prop="cameraNo"
            label="通道号"
            align="center"
            width="100">
          </el-table-column>
          <el-table-column
            prop="cameraName"
            label="通道号名称">
          </el-table-column>
          <el-table-column
            prop="ip"
            label="IP通道地址">
          </el-table-column>
          <el-table-column
            prop="lampPostId"
            label="所属灯杆">
            <template slot-scope="scope">
              <div>
                {{ scope.row.lampPostId | lampPost }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="longitude"
            label="经度"
            >
          </el-table-column>
          <el-table-column
            prop="latitude"
            label="纬度">
          </el-table-column>
        </el-table>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="edit(form)" :loading="isLoading">确 定</el-button>
    </div>
	</el-dialog>
  <iChannelEdit 
  @handleClose="handleClose" 
  @addIChannelOptions="addIChannelOptions" 
  @editIChannelOptions="editIChannelOptions" 
  :iChannelObj="iChannelObj" 
  :lampPostOptions="lampPostOptions">
  </iChannelEdit>
</div>
</template>
<script>
  import videoConfigAPI from '@/api/video/videoConfig'
  import iChannelEdit from './iChannelEdit.vue'
  let that;
  export default {
    props: {
      dialogObj: Object,
      projectId: String
    },
    data() {
      return {
        isLoading: false,
        tenderOptions: [],
        form: {
          rowId: '',
          projectId: '',
          cameraName: '',
          cameraNo: '',
          // cameraModel: '',
          cameraType: '',
          // cameraMac: '',
          cameraUser: '',
          cameraPassword: '',
          nvr: '',
          lampPostId: '',
          longitude: '',
          latitude: '',
          tenderId: '',
          ip: '',
          port: '',
          installTime: '',
          serialNo: '', // 序列号
          verCode: '', // 验证码
          storageType: 0, // 本地
        },
        iChannelOptions: [],
        multipleSelection: [],
        iChannelObj: {
          isShow: false,
          title: '',
          form: ''
        },
        rules: {
          cameraName: [
            { required: true, message: '请输入设备名称', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符' }
          ],
          cameraNo: [
            { required: true, message: '请输入设备编号', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符' }
          ],
          ip: [
            { required: true, message: '请输入IP地址', trigger: 'blur' },
            { pattern: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, message: '请输入正确的IP地址' }
          ],
          port: [
            { required: true, message: '请输入端口号', trigger: 'blur' },
            { pattern: /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/, message: '请输入正确的端口号' }
          ],
          cameraUser: [
            { required: true, message: '请输入设备用户名', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符' }
          ],
          cameraPassword: [
            { required: true, message: '请输入设备密码', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符' }
          ],
          serialNo: [
            { required: true, message: '请输入序列号', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符' }
          ],
          verCode: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符' }
          ],
          // cameraModel: [
          //   { min: 1, max: 15, message: '长度在 1 到 15 个字符' }
          // ],
          // cameraMac: [
          //   { min: 1, max: 15, message: '长度在 1 到 15 个字符' }
          // ]
        }
      }
    },
    methods: {
      compare(propertyName) {
        return function (object1, object2) {
          var value1 = object1[propertyName];
          var value2 = object2[propertyName];
          if (value2 > value1) {
            return -1;
          } else if (value2 < value1) {
            return 1;
          } else {
            return 0;
          }
        }
      },
      addIChannelOptions(val) {
        this.iChannelOptions.push(JSON.parse(val));
        var iChannelOptions = this.iChannelOptions.sort(this.compare("cameraNo"));
      },
      editIChannelOptions(val) {
        var _val = JSON.parse(val);
        for (var i = 0; i < this.iChannelOptions.length; i++) {
          if (_val.cameraNo == this.iChannelOptions[i].cameraNo) {
            this.iChannelOptions.splice(i, 1, _val);
          }
        }
      },
      handleClose() {
        this.iChannelObj.isShow = false;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleAdd(){ 
        this.iChannelObj.isShow = true;
        this.iChannelObj.title = '新增';
        let len = this.iChannelOptions.length;
        let indexArr = [];
        let cameraNo;
        for (let i = 0; i < len; i++) {
          if (this.iChannelOptions[i+1]) {
            var d = parseInt(this.iChannelOptions[i+1].cameraNo) - parseInt(this.iChannelOptions[i].cameraNo);
            if (d > 1) {
              indexArr.push(parseInt(this.iChannelOptions[i].cameraNo) + 1);
            }
          } else {
            var d = parseInt(this.iChannelOptions[0].cameraNo) - 0;
            if (d > 1) {
              indexArr.push(1);
            }
          }
        }
        if (indexArr.length == 0) {
          cameraNo = len + 1;
        } else {
          cameraNo = indexArr[0];
        }
        let form = {
          cameraNo: cameraNo
        } 
        this.iChannelObj.form = JSON.stringify(form);
      },
      handleEdit(){ 
        if (this.multipleSelection.length != 0) {
          if(this.multipleSelection.length === 1){
            this.iChannelObj.form = JSON.stringify(this.multipleSelection[0]);
            this.iChannelObj.isShow = true;
            this.iChannelObj.title = '编辑';
          }else{
            this.$message({
              type: 'warning',
              message: '不支持多条编辑'
            });
          }
        } else{
          this.$message({
            type: 'warning',
            message: '请先选择一条记录'
          });
        }
      },
      handleDelete(){
        if(this.multipleSelection.length != 0){
          for (let i = 0; i < this.multipleSelection.length; i++) {
            for (let j =0; j < this.iChannelOptions.length; j++) {
              if (this.multipleSelection[i].cameraNo == this.iChannelOptions[j].cameraNo) {
                this.iChannelOptions.splice(j, 1);
              }
            }
          }
        }else{
          this.$message({
            type: 'warning',
            message: '请先选择一条记录'
          });
        }
      },
      NVRChange() {
        this.form.lampPostId = this.form.longitude = this.form.latitude = '';
      },
      lampPostChange(rowId) {
        if (rowId) {
          this.lampPostOptions.map(e => {
            if (e.rowId == rowId) {
              this.form.latitude = e.latitude;
              this.form.longitude = e.longitude;
            }
          });
        } else {
          this.form.latitude = '';
          this.form.longitude = '';
        }
      },
      closeDialog() {
        this.$emit('handleClose');
        this.$refs['form'].resetFields();
        this.iChannelOptions = [];
      },
      refresh() {
        this.$emit('init');
      },
      edit(form) {
        this.form.projectId = this.projectId;
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.isLoading = !this.isLoading
            let _form = [];
            _form.push(form);
            if (form.nvr == '1') {
              _form = [..._form, ...this.iChannelOptions];
            }
            videoConfigAPI.batchEdit(_form).then(res=>{
              if(res.status == 1){
                this.$message({
                  type: 'success',
                  message: this.dialogObj.title == '新增' ? '新增成功' : '修改成功'
                });
                setTimeout(() => {
                  this.closeDialog();
                  this.refresh();
                  this.isLoading = !this.isLoading;
                }, 1500);
              } else {
                this.$message.error(res.message);
                this.isLoading = !this.isLoading;
              }
            })
          }
        });
      },
      getInfo(id) {
        videoConfigAPI.getItem(id).then(res=>{
          for (let k in this.form) {
            this.form[k] = res.data.data[k];
          }
          this.iChannelOptions = res.data.data.childs;
          if (this.form.tenderId == -1) {
            this.form.tenderId = '';
          }
          if (this.form.lampPostId == -1) {
            this.form.lampPostId = '';
          }
        });
      },
      getTender() {
        videoConfigAPI.getTenderInfo().then(res=>{
          this.tenderOptions = res;
        });
      }
    },
    created() {
      this.getTender();
    },
    beforeCreate() {
      that = this;
    },
    filters: {
      lampPost(val) {
        for (let i = 0; i < that.lampPostOptions.length; i++) {
          if (val == that.lampPostOptions[i].rowId) {
            return that.lampPostOptions[i].lampPostCode;
          }
        }
      }
    },
    computed: {
      lampPostOptions() {
        return this.$store.state.baseData.lampList;
      }
    },
    watch: {
      dialogObj: {
        handler(val, oldVal) {
          if (val.isShow) {
            if (val.rowId) {
              this.getInfo(val.rowId);
            } else {
              this.form.nvr = '1';
            }
            this.form.rowId = val.rowId;
          }
        },
        deep: true
      },
    },
    components:{
      iChannelEdit
    }
  }
</script>
<style lang="scss">
  #monitorDialog {
    .el-dialog {
      width: 900px;
    }
  }
 
  #videoConigForm {
    width: 800px;
    margin: 0 auto;
    input {
      width: 220px;
    }
    textarea {
    }
  }
</style>
