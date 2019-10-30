<template>
  <el-dialog id="relTimeMsg" ref="dialog" title="实时消息" 
  :visible.sync="dialogObj.isShow" 
  :modal-append-to-body='false' 
  :close-on-click-modal='false'
  width="800px"
  @close="closeDialog">
    <el-form :inline="true" ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="间隔时间(ms)" prop="interval">
        <el-input clearable v-model.trim="form.interval" placeholder="请输入步进间隔时间"></el-input>
      </el-form-item>
      <el-form-item label="步进距离(px)" prop="step">
        <el-input clearable v-model.trim="form.step" placeholder="请输入步进距离"></el-input>
      </el-form-item>
      <el-form-item label="垂直对齐" prop="align">
        <el-select v-model.trim="form.align" filterable clearable placeholder="请选择垂直对齐">
          <el-option
            v-for="item in alignOption"
            :key="item.key"
            :label="item.name"
            :value="item.key"
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="移动方向" prop="direction">
        <el-select v-model.trim="form.direction" filterable clearable placeholder="请选择移动方向">
          <el-option
            v-for="item in directionOption"
            :key="item.key"
            :label="item.name"
            :value="item.key"
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="限定方式" prop="">
        <el-radio v-model="number" :label="-1">永久</el-radio>
        <el-radio v-model="number" :label="0">停止</el-radio>
        <el-radio v-model="number" label="range">自定义</el-radio>
      </el-form-item>
      <el-form-item label="自定义限定(次)" prop="num" v-if="number == 'range'">
        <el-input clearable v-model.trim="form.num" placeholder="请输入限定"></el-input>
      </el-form-item>
    </el-form>
    <el-card shadow="never">
      <div slot="header">
        <label>
          <span>文字内容</span>
        </label>
      </div>
      <div class="body">
        <div id="websiteEditorElem"></div>
      </div>
    </el-card>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" :loading="isLoading" @click="ctrl()">确 定</el-button>
    </div>
	</el-dialog>
</template>
<script>
  import E from "wangeditor"
  import ledConfAPI from '@/api/led/ledConfAPI'
  export default {
    props: {
      dialogObj: Object,
      idList: Array
    },
    data() {
      return {
        isLoading: false,
        editor: null,
        alignOption: [
          {
            key: 'top',
            name: '垂直靠上'
          },
          {
            key: 'center',
            name: '垂直居中'
          },
          {
            key: 'bottom',
            name: '垂直靠下'
          }
        ],
        directionOption: [
          {
            key: 'left',
            name: '向左移动'
          },
          {
            key: 'right',
            name: '向右移动'
          }
        ],
        number: 'always',
        form: {
          interval: null, // 步进的间隔时间
          step: null, // 步进距离
          align: null, // 垂直对齐
          direction: null, // 移动方向
          num: null, // 限定
          html: null, // 滚动的文字
        },
        rules: {
          interval: [
            { pattern: /^[1-9]\d{0,4}$/, message: '请输入大于0且不超过10万的整数' }
          ],
          step: [
            { pattern: /^[1-9]\d{0,4}$/, message: '请输入大于0且不超过10万的整数' }
          ],
          num: [
            { pattern: /^-?\d+$/, message: '请输入整数' }
          ]
        }
      }
    },
    methods: {
      closeDialog() {
        this.$refs['form'].resetFields();
        this.destoryEditor();
        this.$emit('handleClose');
      },
      ctrl() {
        var html = this.editor.txt.html();
        html = html.replace(/<p>/g, "");
        html = html.replace(/<\/p>/g,'<br>');
        this.form.html = html;
        var data = {
          idList: this.idList
        };
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.isLoading = !this.isLoading
            ledConfAPI.ctrlRealTimeMsg(Object.assign(data, this.form)).then(res=>{
              if(res.result){
                this.$message.success('实时消息推送成功！');
                setTimeout(() => {
                  this.closeDialog();
                  this.isLoading = !this.isLoading;
                }, 1500);
              }else{
                this.$message.error('服务器错误');
                this.isLoading = !this.isLoading;
              }
            });
          }
        });
      },
      createEditor() {
        this.editor = null;
        this.editor = new E("#websiteEditorElem");
        this.editor.customConfig.menus = [
          'bold',  // 粗体
          'fontSize',  // 字号
          'fontName',  // 字体
          'italic',  // 斜体
          'underline',  // 下划线
          'strikeThrough',  // 删除线
          'foreColor',  // 文字颜色
          'backColor',  // 背景颜色
          'code',  // 插入代码
          'undo',  // 撤销
          'redo'  // 重复
        ];
        this.editor.create();
      },
      destoryEditor() {
        // this.editor.destory();
        $('#websiteEditorElem').html('');
        this.editor = null;
      }
    },
    watch: {
      dialogObj: {
        handler(val, oldVal) {
          if (val.isShow) {
            this.$nextTick(function(){
              this.createEditor();
            });
          }
        },
        deep: true
      },
      number(val, oldVal) {
        if (val != 'range') {
          this.form.num = val;
        } else {
          this.form.num = null;
        }
      }
    }
  }
</script>
<style lang="scss">
  #relTimeMsg {
    .el-form {
      width: 720px;
      margin: 0 auto;
      input {
        width: 220px;
      }
    }
    .el-card {
      height: 100%;
      border: 0;
      .el-card__header {
        border-bottom: 0;
        label {
          padding: 10px 50px 10px 0;
          border-bottom: 2px solid #60b8f6;
          font-size: 16px;
        }
      }
      .body {
        .w-e-text-container{
          height: 200px !important;
        }
      }
    }
  }
</style>