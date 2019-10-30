<template>
  <el-dialog id="ledConfEditDialog" ref="dialog" :title="dialogObj.title" 
  :visible.sync="dialogObj.isShow" 
  :modal-append-to-body='false' 
  :close-on-click-modal='false'
  width="840px"
  @close="closeDialog">
		<el-form :inline="true" ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="ID" prop="ipAddress">
        <el-input clearable v-model.trim="form.ipAddress" placeholder="请输入ID"></el-input>
      </el-form-item>
      <el-form-item label="屏幕名称" prop="ledName">
        <el-input clearable v-model.trim="form.ledName" placeholder="请输入屏幕名称"></el-input>
      </el-form-item>
      <el-form-item label="厂家" prop="tenderId">
        <el-select v-model.trim="form.tenderId" filterable clearable placeholder="请选择厂家">
          <el-option
            v-for="item in tenderOptions"
            :key="item.rowId"
            :label="item.tenderName"
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
      <el-form-item label="宽(像素)" prop="screenWidth">
        <el-input clearable v-model.trim="form.screenWidth" placeholder="请输入屏幕宽度"></el-input>
      </el-form-item>
      <el-form-item label="高(像素)" prop="screenHeight">
        <el-input clearable v-model.trim="form.screenHeight" placeholder="请输入屏幕高度"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="edit(form)" :loading="isLoading">确 定</el-button>
    </div>
	</el-dialog>
</template>
<script>
  import ledConfAPI from '@/api/led/ledConfAPI'
  export default {
    props: {
      dialogObj: Object
    },
    data() {
      return {
        isLoading: false,
        tenderOptions: [],
        deviceType: null,
        form: {
          rowId: null,
          ipAddress: null,
          ledName: null,
          tenderId: null,
          lampPostId: null,
          longitude: null,
          latitude: null,
          screenWidth: null,
          screenHeight: null
        },
        rules: {
          ipAddress: [
            { required: true, message: '请输入ID', trigger: 'blur' },
            { min: 1, max: 25, message: '长度在 1 到 25 个字符' }
          ],
          ledName: [
            { required: true, message: '请输入屏幕名称', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符' }
          ],
          tenderId: [
            { required: true, message: '请选择厂家', trigger: 'blur' }
          ],
          lampPostId: [
            { required: true, message: '请选择所属灯杆', trigger: 'blur' }
          ],
          screenWidth: [
            { required: true, message: '请输入屏幕宽度', trigger: 'blur' },
            { pattern: /^[1-9]\d{0,4}$/, message: '请输入大于0且不超过10万的整数' }
          ],
          screenHeight: [
            { required: true, message: '请输入屏幕宽度', trigger: 'blur' },
            { pattern: /^[1-9]\d{0,4}$/, message: '请输入大于0且不超过10万的整数' }
          ]
        }
      }
    },
    methods: {
      closeDialog() {
        this.$refs['form'].resetFields();
        this.form.rowId = this.form.latitude = this.form.longitude ='';
        this.$emit('handleClose');
      },
      refresh() {
        this.$emit('init');
      },
      edit(form) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.isLoading = !this.isLoading
            ledConfAPI.addOrEdit(form).then(res=>{
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
        ledConfAPI.getItem(id).then(res=>{
          for (let k in this.form) {
            this.form[k] = res[k];
          }
          if (this.form.tenderId == -1) {
            this.form.tenderId = '';
          }
        });
      },
      getDeviceTypeCode(){//1. 获取led的设备类型code
        ledConfAPI.getDeviceTypeCode().then(res=>{
          this.deviceType = res;
          this.getTender(this.deviceType);
        })
      },
      getTender(res) {
        ledConfAPI.getTenderInfo(res).then(res=>{
          this.tenderOptions = res;
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
  #ledConfEditDialog {
    .el-form {
      input {
        width: 220px;
      }
    }
  }
</style>
