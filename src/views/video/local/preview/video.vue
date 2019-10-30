<template>
  <el-dialog ref="dialog" :title="dialogObj.monitorId?'绑定摄像头':'新增监控点'" 
  :visible.sync="dialogObj.isShow" 
  :modal-append-to-body='false' 
  :close-on-click-modal='false'
  @close="closeDialog">
		<el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="监控点名称" prop="monitorName">
        <el-input clearable v-model.trim="form.monitorName" placeholder="请输入监控点名称"></el-input>
      </el-form-item>
      <el-form-item label="监控点编号" prop="monitorNo">
        <el-input clearable v-model.trim="form.monitorNo" placeholder="请输入监控点编号"></el-input>
      </el-form-item>
      <el-form-item label="监控点类型">
        <el-radio-group v-model="form.nvr">
          <el-radio label="1" :disabled="dialogObj.monitorId?true:false">NVR</el-radio>
          <el-radio label="0" :disabled="dialogObj.monitorId?true:false">IPC</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="nvr==1?'nvr设备':'摄像头'" v-if="dialogObj.monitorId">
        <el-select
        @change="handleNvrChange"
         v-model.trim="cameraId" filterable clearable :placeholder="nvr==1?'请选择nvr设备':'请选择摄像头'">
          <el-option
            v-for="item in cameraOptions"
            :key="item.rowId"
            :label="item.cameraName"
            :value="item.rowId"
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通道号名称" v-if="dialogObj.monitorId && form.nvr == 1">
        <el-select
          :disabled="cameraId?false:true"
          v-model.trim="iChannelID" filterable clearable placeholder="请选择通道号名称">
          <el-option
            v-for="item in iChannelOptions"
            :key="item.cameraNo"
            :label="item.cameraName"
            :value="item.cameraNo"
            >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="edit(form)" :loading="isLoading">确 定</el-button>
    </div>
	</el-dialog>
</template>
<script>
  import videoConfigAPI from '@/api/video/videoConfig'
  import monitor from '@/api/video/monitor'
  export default {
    props: {
      dialogObj: Object
    },
    data() {
      return {
        isLoading: false,
        iChannelOptions: [], // 通道号列表
        cameraOptions: [], // 设备列表
        cameraIdArr: [],
        cameraId: '',
        iChannelID: '',
        form: {
          rowId: '',
          monitorName: '',
          monitorNo: '',
          nvr: '1',
          cameraIds: '',
          cameraNum: ''
        },
        rules: {
          monitorName: [
            { required: true, message: '请输入监控点名称', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符' }
          ],
          monitorNo: [
            { min: 1, max: 15, message: '长度在 1 到 15 个字符' }
          ]
        }
      }
    },
    methods: {
      closeDialog() {
        this.$emit('handleClose');
        this.$refs['form'].resetFields();
      },
      refresh() {
        this.$emit('getMonitorInfo');
      },
      monitorSel() {
        this.$emit('monitorSel');
      },
      edit(form) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            var _cameraIdArr = [];
            this.cameraIdArr[this.dialogObj.g_iWndIndex].id = this.cameraId;
            if (this.iChannelID) {
              this.cameraIdArr[this.dialogObj.g_iWndIndex].iChannelID = this.iChannelID;
            } else {
              if (form.nvr == '0') {
                this.cameraIdArr[this.dialogObj.g_iWndIndex].iChannelID = 1;
              }
            }
            for (var i = 0; i < this.cameraIdArr.length; i++) {
              _cameraIdArr.push(this.cameraIdArr[i].id + '_' + this.cameraIdArr[i].iChannelID);
            }
            this.form.cameraIds = _cameraIdArr.join(',');
            this.isLoading = !this.isLoading;
            monitor.addOrEdit(form).then(res=>{
              if(res.status == 1){
                this.$message({
                  type: 'success',
                  message: '绑定成功'
                });
                setTimeout(() => {
                  this.closeDialog();
                  this.refresh();
                  setTimeout(() => {
                    this.monitorSel();
                  }, 500);
                  this.isLoading = !this.isLoading;
                }, 1500);
              }else{
                this.$message.error('服务器错误');
                this.isLoading = !this.isLoading;
              }
            })
          }
        });
      },
      getCameraInfo (nvr, func) {
        videoConfigAPI.getNVRList(nvr).then(res=>{
          this.cameraOptions = res;
        })
      },
      handleNvrChange(val) {
        this.getIChannelID(val);
      },
      getIChannelID(id) {
        videoConfigAPI.getItem(id).then(res=>{
          this.iChannelOptions = res.data.data.childs;
        });
      }
    },
    created() {
    },
    watch: {
      dialogObj: {
        handler(val, oldVal) {
          if (val.isShow) {
            this.form.rowId = val.monitorId;
            this.form.monitorName = val.monitorName;
            this.form.monitorNo = val.monitorNo;
            this.form.cameraNum = val.cameraNum;
            this.form.nvr = val.nvr;
            this.cameraIdArr = val.cameraIdArr;
            if (this.form.rowId) {
              this.cameraId = val.cameraIdArr[val.g_iWndIndex].id;
              if (val.cameraIdArr[val.g_iWndIndex].iChannelID) {
                this.iChannelID = val.cameraIdArr[val.g_iWndIndex].iChannelID;
              } else {
                this.iChannelID = '';
              }
            } else {
              this.form.nvr = '1';
            }
            this.getCameraInfo(val.nvr);
          }
        },
        deep: true
      },
      cameraOptions: {
        handler(val, oldVal) {
          if (val.length > 0 && this.cameraId) {
            this.getIChannelID(this.cameraId);
          }
        },
        deep: true
      }
    }
  }
</script>
<style lang="scss">
</style>
