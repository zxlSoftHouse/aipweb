<template>
  <el-dialog id="sensorDialog" ref="dialog" :title="dialogObj.title" 
  :visible.sync="dialogObj.isShow" 
  :modal-append-to-body='false' 
  :close-on-click-modal='false'
  @close="closeDialog">
		<el-form :inline="true" ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="传感器名称" prop="sensorName">
        <el-input clearable v-model.trim="form.sensorName" placeholder="请输入传感器名称"></el-input>
      </el-form-item>
      <el-form-item label="传感器注册包" prop="registration">
        <el-input clearable v-model.trim="form.registration" placeholder="请输入传感器注册包"></el-input>
      </el-form-item>
      <el-form-item label="传感器协议" prop="modelCode">
        <el-input clearable v-model.trim="form.modelCode" placeholder="请输入传感器协议"></el-input>
      </el-form-item>
      <el-form-item label="传感器厂家" prop="sensorTenderId">
        <el-select @change="getSensorModel" v-model.trim="form.sensorTenderId" filterable clearable placeholder="请选择传感器厂家">
          <el-option
            v-for="item in tenderOptions"
            :key="item.rowId"
            :label="item.tenderName"
            :value="item.rowId"
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="传感器型号" prop="sensorModelId">
        <el-select v-model.trim="form.sensorModelId" filterable clearable placeholder="请选择传感器型号">
          <el-option
            v-for="item in modelOptions"
            :key="item.rowId"
            :label="item.modelName"
            :value="item.rowId"
            >
          </el-option>
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
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="edit(form)" :loading="isLoading">确 定</el-button>
    </div>
	</el-dialog>
</template>
<script>
  import sensorConfigAPI from '@/api/sensor/sensorConfig'
  export default {
    props: {
      dialogObj: Object
    },
    data() {
      return {
        isLoading: false,
        tenderOptions: [],
        modelOptions: [],
        deviceType: null,
        form: {
          rowId: null,
          lampPostId: null,
          longitude: '',
          latitude: '',
          sensorTenderId: null,
          sensorModelId: null,
          sensorName: null,
          registration: null,
          modelCode: null,
        },
        rules: {
          lampPostId: [
            { required: true, message: '请选择所属灯杆', trigger: 'blur' }
          ],
          sensorTenderId: [
            { required: true, message: '请选择传感器厂家', trigger: 'blur' }
          ],
          sensorModelId: [
            { required: true, message: '请选择传感器型号', trigger: 'blur' }
          ],
          sensorName: [
            { required: true, message: '请输入传感器名称', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符' }
          ],
          registration: [
            { required: true, message: '请输入传感器注册包', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符' }
          ],
          modelCode: [
            { required: true, message: '请输入传感器协议', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符' }
          ]
        }
      }
    },
    methods: {
      closeDialog() {
        this.$emit('handleClose');
        this.$refs['form'].resetFields();
        this.form.rowId = this.form.longitude = this.form.latitude = null;
      },
      refresh() {
        this.$emit('init');
      },
      edit(form) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.isLoading = !this.isLoading
            sensorConfigAPI.addOrEdit(form).then(res=>{
              if(res){
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
        sensorConfigAPI.getItem(id).then(res=>{
          for (let k in this.form) {
            this.form[k] = res[k];
          }
          if (this.form.sensorTenderId == -1) {
            this.form.sensorTenderId = '';
          }
        });
      },
      getDeviceTypeCode(){//1. 获取传感器的设备类型code
        sensorConfigAPI.getDeviceTypeCode().then(res=>{
          this.deviceType = res;
          this.getTender(this.deviceType);
        })
      },
      getTender(res) {
        console.log(res)
        sensorConfigAPI.getTenderInfo(res).then(res=>{
          this.tenderOptions = res;
        });
      },
      getSensorModel(val) {
        sensorConfigAPI.getSensorModel(this.deviceType, val).then(res=>{
          this.modelOptions = res;
        });
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
      }
    },
    created() {
      this.getDeviceTypeCode();
    },
    watch: {
      dialogObj: {
        handler(val, oldVal) {
          if (val.isShow) {
            if (val.rowId) {
              this.getInfo(val.rowId);
            }
            console.log(this.form.rowId);
          }
        },
        deep: true
      }
    },
    computed: {
      lampPostOptions() {
        return this.$store.state.baseData.lampList;
      }
    },
  }
</script>
<style lang="scss">
  #sensorDialog {
    .el-dialog {
      width: 900px;
    }
    .el-form {
      width: 800px;
      margin: 0 auto;
      input {
        width: 220px;
      }
    }
  }
</style>
