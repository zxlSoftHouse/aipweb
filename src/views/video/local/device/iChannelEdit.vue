<template>
  <el-dialog ref="dialog" :title="iChannelObj.title" 
  :visible.sync="iChannelObj.isShow" 
  :modal-append-to-body='false' 
  :close-on-click-modal='false'
  @close="closeDialog">
		<el-form id="videoConigForm" :inline="true" ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="通道号">
        <el-input readonly v-model.trim="form.cameraNo"></el-input>
      </el-form-item>
      <el-form-item label="通道名称" prop="cameraName">
        <el-input clearable v-model.trim="form.cameraName" placeholder="请输入设备名称"></el-input>
      </el-form-item>
      <el-form-item label="IP通道地址" prop="ip">
        <el-input clearable v-model.trim="form.ip" placeholder="请输入IP地址"></el-input>
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
      <el-button type="primary" @click="edit(form)">确 定</el-button>
    </div>
	</el-dialog>
</template>
<script>
  export default {
    props: {
      iChannelObj: Object,
      lampPostOptions: Array
    },
    data() {
      return {
        form: {},
        rules: {
          cameraName: [
            { required: true, message: '请输入设备名称', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符' }
          ],
          ip: [
            { required: true, message: '请输入IP地址', trigger: 'blur' },
            { pattern: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, message: '请输入正确的IP地址' }
          ],
          lampPostId: [
            { required: true, message: '请选择所属灯杆', trigger: 'blur' }
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
        this.$refs['form'].resetFields();
        this.$emit('handleClose');
      },
      edit(form) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let _form = JSON.stringify(form)
            if (this.iChannelObj.title == '新增') {
              this.$emit('addIChannelOptions', _form);
            } else {
              this.$emit('editIChannelOptions', _form);
            }
            this.closeDialog();
          }
        });
      }
    },
    created() {
    },
    watch: {
      iChannelObj: {
        handler(val, oldVal) {
          if (val.isShow) {
            this.form = JSON.parse(val.form);
          }
        },
        deep: true
      }
    }
  }
</script>
