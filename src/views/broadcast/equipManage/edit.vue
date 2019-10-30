<template>
  <el-dialog id="equipDialog" ref="dialog" :title="dialogObj.title" 
  :visible.sync="dialogObj.isShow" 
  :modal-append-to-body='false' 
  :close-on-click-modal='false'
  @close="closeDialog">
		<el-form id="equipConigForm" :inline="true" ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="灯杆编号" prop="lampPostId">
        <el-select v-model.trim="form.lampPostId" filterable clearable placeholder="请选择所属灯杆">
          <el-option
            v-for="item in lampPostOptions"
            :key="item.rowId"
            :label="item.lampPostCode"
            :value="item.rowId"
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="终端编号" prop="tid">
        <el-input clearable v-model.trim="form.tid" placeholder="请输入终端编号" id="equip-number"></el-input>
      </el-form-item>
      <el-form-item label="终端名称" prop="tname">
        <el-input clearable v-model.trim="form.tname" placeholder="请输入终端名称"></el-input>
      </el-form-item>
      <el-form-item label="广播输出音量" prop="tbcoutv" id="outputVolume">
        <el-input v-model.trim="form.tbcoutv" type="number" min="0" max="15" style="width:200px;"></el-input>
      </el-form-item>
      <el-form-item label="广播输入音量" prop="tbcinv" id="inputVolume">
        <el-input v-model.trim="form.tbcinv" type="number" min="0" max="15" style="width:200px;"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="edit(form)" :loading="isLoading">确 定</el-button>
    </div>
	</el-dialog>
</template>
<script>
  import equipConfigAPI from '@/api/broadcast/equipConfig'
  import sensorConfigAPI from '@/api/sensor/sensorConfig'
  export default {
    props: {
      dialogObj: Object,
      singInfo:Array
    },
    data() {
      return {
        isLoading: false,
        lampPostOptions:[],
        form: {
          tid:null,
          tname:null,
          tbcoutv:9,
          tbcinv:9,
          tpass:1234
        },
        rules: {
          tid: [
            { required: true, message: '请输入终端编号', trigger: 'blur' }
          ],
          tname: [
            { required: true, message: '请输入终端名称', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      closeDialog() {
        this.$refs['form'].resetFields();
        this.$emit('handleClose');
      },
      refresh() {
        this.$emit('init');
      },
      getLampPost() {
        sensorConfigAPI.getLampPostInfo().then(res=>{
          this.lampPostOptions = res;
        });
      },
      edit(form) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.isLoading = !this.isLoading
            if(this.dialogObj.title == "新增"){
              equipConfigAPI.add(form).then(res=>{
                if(res.res == "1"){
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
            }else{
              equipConfigAPI.edit(form).then(res=>{
                if(res.res == "1"){
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
          }
        });
      }
    },
    created() {
      this.getLampPost();
    },
    watch: {
      singInfo:{
        handler(val, oldVal) {
          if(val.length>0){
            this.form.tid = val[0].id;
            this.form.tname = val[0].name;
            this.form.tbcoutv = val[0].bcoutv;
            this.form.tbcinv = val[0].bcinv;
          }
        },
        deep: true
      }
    }
  }
</script>
<style lang="scss">
  #equipDialog {
    .el-dialog {
      width: 800px;
    }
  }
 
  #videoConigForm {
    width: 700px;
    margin: 0 auto;
    input{
      width: 220px;
    }
  } 
</style>
