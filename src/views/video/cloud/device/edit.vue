<template>
<div>
  <el-dialog id="monitorDialog" ref="dialog" :title="dialogObj.title" 
  :visible.sync="dialogObj.isShow" 
  :modal-append-to-body='false' 
  :close-on-click-modal='false'
  @close="closeDialog">
		<el-form id="videoConigForm" :inline="true" ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="设备名称" prop="cameraName">
        <el-input clearable v-model.trim="form.cameraName" placeholder="请输入序列号"></el-input>
      </el-form-item>
      <el-form-item label="序列号" prop="serialNo">
        <el-input clearable v-model.trim="form.serialNo" placeholder="请输入序列号"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="verCode">
        <el-input clearable v-model.trim="form.verCode" placeholder="请输入验证码"></el-input>
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
</div>
</template>
<script>
  import videoConfigAPI from '@/api/video/videoConfig'
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
          storageType: 1, // 云端
          cameraName: '',
          serialNo: '', // 序列号
          verCode: '', // 验证码
          lampPostId: '',
          longitude: '',
          latitude: '',
        },
        rules: {
          cameraName: [
            { required: true, message: '请输入设备名称', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符' }
          ],
          serialNo: [
            { required: true, message: '请输入序列号', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符' }
          ],
          verCode: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符' }
          ]
        }
      }
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
        this.$emit('handleClose');
        this.$refs['form'].resetFields();
        this.form.longitude = this.form.latitude = '';
      },
      refresh() {
        this.$emit('init');
      },
      edit(form) {
        this.form.projectId = this.projectId;
        console.log(this.form)
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.isLoading = !this.isLoading
            let _form = [];
            _form.push(form);
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
              }else{
                this.$message.error('服务器错误');
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
        });
      },
    },
    computed: {
      lampPostOptions() {
        return this.$store.state.baseData.lampList;
      }
    },
    created() {
    },
    watch: {
      dialogObj: {
        handler(val, oldVal) {
          if (val.isShow) {
            if (val.rowId) {
              this.getInfo(val.rowId);
            }
            this.form.rowId = val.rowId;
          }
        },
        deep: true
      },
    },
    components:{
    },
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
