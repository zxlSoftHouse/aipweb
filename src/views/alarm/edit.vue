<template>
  <el-dialog id="monitorDialog" ref="dialog" :title="dialogObj.title" 
  :visible.sync="dialogObj.isShow" 
  :modal-append-to-body='false' 
  :close-on-click-modal='false'
  @close="closeDialog">
		<el-form id="videoConigForm" :inline="true" ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="设备名称" prop="deviceName">
        <el-input clearable v-model.trim="form.deviceName" placeholder="请输入设备名称"></el-input>
      </el-form-item>
      <el-form-item label="设备编号" prop="deviceNo">
        <el-input clearable v-model.trim="form.deviceNo" placeholder="请输入设备编号"></el-input>
      </el-form-item>
      <!-- <el-form-item label="SN编码" prop="deviceSn">
        <el-input clearable v-model.trim="form.deviceSn" placeholder="请输入设SN编码"></el-input>
      </el-form-item>
      <el-form-item label="IP地址" prop="ip">
        <el-input clearable v-model.trim="form.ip" placeholder="请输入IP地址"></el-input>
      </el-form-item>
      <el-form-item label="端口号" prop="port">
        <el-input clearable v-model.trim="form.port" placeholder="请输入端口号"></el-input>
      </el-form-item> -->
      <el-form-item label="厂家" prop="tenderId">
        <el-select v-model.trim="form.tenderId" filterable clearable placeholder="请选择厂家" @change="getModel">
          <el-option
            v-for="item in formSelection.tenderOptions"
            :key="item.rowId"
            :label="item.tenderName"
            :value="item.rowId"
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备型号" filterable clearable prop="deviceType">
          <el-select v-model.trim="form.deviceType" placeholder="请选择设备型号">
              <el-option
              v-for="item in formSelection.centerControllerTypeOption"
              :key="item.rowId"
              :label="item.modelName"
              :value="item.rowId">
              </el-option>
          </el-select>
      </el-form-item>
      <!-- <el-form-item label="设备MAC" prop="deviceMac">
        <el-input clearable v-model.trim="form.deviceMac" placeholder="请输入设备MAC"></el-input>
      </el-form-item> -->
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
      <el-form-item label="经度" prop="longitude">
        <el-input readonly v-model.trim="form.longitude"></el-input>
      </el-form-item>
      <el-form-item label="纬度" prop="latitude">
        <el-input readonly v-model.trim="form.latitude"></el-input>
      </el-form-item>
      <el-form-item label="安装时间" prop="installTime">
        <el-date-picker
          v-model.trim="form.installTime"
          type="date"
          value-format="timestamp"
          :editable="false"
          placeholder="请选择安装时间">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input
          clearable
          type="textarea"
          :rows="4"
          :cols="76"
          placeholder="请输入备注"
          v-model.trim="form.remark">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="edit(form)" :loading="isLoading">确 定</el-button>
    </div>
	</el-dialog>
</template>
<script>
  import alarmAPI from '@/api/alarm/alarm'
  export default {
    props: {
      dialogObj: Object
    },
    data() {
      return {
        isLoading: false,
        lampPostOptions: [],
        formSelection:{
            tenderOptions: [],
            centerControllerTypeOption:[]
        },
        form: {
          rowId: '',
          deviceName: '',
          deviceNo: '',
          deviceModel: '',
          deviceMac: '',
          lampPostId: '',
          longitude: '',
          latitude: '',
          tenderId: '',
          deviceType:'',
          ip: '',
          port: '',
          installTime: '',
          statusFlag: '',
          remark: ''
        },
        rules: {
          deviceName: [
            { required: true, message: '请输入设备名称', trigger: 'blur' }
          ],
          deviceNo: [
            { required: true, message: '请输入设备编号', trigger: 'blur' }
          ],
          ip: [
            { required: true, message: '请输入IP地址', trigger: 'blur' }
          ],
          port: [
            { required: true, message: '请输入端口号', trigger: 'blur' }
          ]
        },
        deviceType:''
      }
    },
    mounted(){
      this.getDeviceType();
    },
    methods: {
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
        this.$refs['form'].resetFields();
        this.$emit('handleClose');
      },
      refresh() {
        this.$emit('init');
      },
      edit(form) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.isLoading = !this.isLoading
            console.log(form)
            alarmAPI.addOrEdit(form).then(res=>{
              if(res.rowId){
                this.$message({
                  type: 'success',
                  message: this.dialogObj.title == '新增' ? '新增成功' : '修改成功'
                });
                setTimeout(() => {
                  this.closeDialog();
                  this.refresh();
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
      getInfo(id) {
        alarmAPI.getItem(id).then(res=>{
          for (let k in this.form) {
            this.form[k] = res.data.data[k];
          }
          if (this.form.tenderId == -1) {
            this.form.tenderId = '';
          }
        });
      },
      getLampPost() {
        alarmAPI.getLampPostInfo().then(res=>{
          this.lampPostOptions = res;
        });
      },
      getDeviceType(){
        alarmAPI.getDeviceTypeCode().then(res=>{
          this.deviceType = res;
          this.getTender();
        });
      },
      //获取厂家 及 设备型号
      getTender() {
        let params = {deviceType:this.deviceType}
        alarmAPI.getTenderInfo(params).then(res=>{
          this.formSelection.tenderOptions = res;
        });
      },
      getModel(val){
        let params = {
          tenderId:val,
          deviceType: this.deviceType
        }
        alarmAPI.queryDeviceModel(params).then(res=>{
          this.formSelection.centerControllerTypeOption = res;
        });
      }
    },
    created() {
      this.getLampPost();
    },
    watch: {
      dialogObj: {
        handler(val, oldVal) {
          console.log(val)
          if (val.isShow) {
            if (val.tid) {
              this.getInfo(val.tid);
            }
          }
        },
        deep: true
      }
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
  }
</style>
