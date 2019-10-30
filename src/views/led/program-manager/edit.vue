<template>
  <el-dialog
    id="ledProEditDialog"
    ref="dialog"
    :title="dialogObj.title"
    width="90%"
    :visible.sync="dialogObj.isShow"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <el-row :gutter="15" class="dialog-container">
      <el-col :span="8" class="left box">
        <el-card>
          <div slot="header">
            <label>
              <i class="iconfont icon-meitiziyuanguanli"></i>
              <span>媒体资源</span>
            </label>
          </div>
          <div class="body">
            <el-collapse v-model="activeName" accordion @change="getSrcList">
              <el-collapse-item title="图片资源" name="Image">
                <ul class="source">
                  <li v-for="(item, index) in imgSrcList" :key="index">
                    <el-button class="lf" type="primary" size="mini" @click="addSrc(item)">
                      <i class="iconfont icon-xinzeng"></i>
                    </el-button>
                    <img class="img-mini lf" :src="GLOBAL.ftpuri + item.filePath">
                    <div class="lf">
                      <span class="resource-name">{{item.resourceName}}</span>
                      <span class="file-size">{{(item.fileSize/1000000).toFixed(3) + "M"}}</span>
                    </div>
                  </li>
                </ul>
                <div>
                  <el-pagination
                    background
                    layout="prev, next"
                    :total="total"
                    :page-size="5"
                    @current-change="current_change"
                  ></el-pagination>
                </div>
              </el-collapse-item>
              <el-collapse-item title="视频资源" name="Video">
                <ul class="source">
                  <li v-for="(item, index) in videoSrcList" :key="index">
                    <el-button class="lf" type="primary" size="mini" @click="addSrc(item)">
                      <i class="iconfont icon-xinzeng"></i>
                    </el-button>
                    <img class="img-mini lf" src="/static/imgs/video.jpg">
                    <div class="lf">
                      <span class="resource-name">{{item.resourceName}}</span>
                      <span class="file-size">{{(item.fileSize/1000000).toFixed(3) + "M"}}</span>
                    </div>
                  </li>
                </ul>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="middle box">
        <el-card>
          <div slot="header">
            <label>
              <i class="iconfont icon-meitiziyuanguanli"></i>
              <span>节目</span>
            </label>
          </div>
          <div class="body">
            <el-form class="basic-info" ref="program" :model="program" :rules="rules">
              <el-form-item label="" prop="itemName">
                <el-input placeholder="节目名" v-model="program.itemName"></el-input>
              </el-form-item>
              <el-row :gutter="13">
                <el-col :span="8">
                  <el-form-item label="" prop="itemWidth">
                    <el-input placeholder="宽(像素)" v-model="program.itemWidth"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="" prop="itemHeight">
                    <el-input placeholder="高(像素)" v-model="program.itemHeight"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-button type="success" @click="edit()" :loading="isLoading">
                    <i class="iconfont icon-baocun"></i>
                    保存
                  </el-button>
                </el-col>
              </el-row>
            </el-form>
            <el-row>
              <el-col>
                <el-button type="warning" @click="deleteItem()">
                  <i class="iconfont icon-shanchu"></i>
                  批量删除
                </el-button>
              </el-col>
            </el-row>
            <div>
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
              >全选</el-checkbox>
              <el-checkbox-group v-model="checkList" @change="handleCheckList">
                <draggable v-model="programSrcList" @update="datadragEnd" :options="{animation:500}">
                  <transition-group>
                    <el-row class="program-item" v-for="(item,index) in programSrcList" :key="index+'key'">
                      <el-checkbox class="lf" :label="item">{{index+1}}</el-checkbox>
                      <img class="img-mini lf" :src="item.fileType=='Image'?GLOBAL.ftpuri + item.filePath:'/static/imgs/video.jpg'" @click="preview(item)">
                      <div class="lf">
                        <span class="program-name">{{item.resourceName}}</span>
                        <el-row type="flex">
                          <el-col>
                            <el-input placeholder="" v-model="item.timeSpan"></el-input>
                          </el-col>
                          <el-col style="margin-left: 10px; margin-top: 8px;">
                            秒
                          </el-col>
                        </el-row>
                      </div>
                    </el-row>
                  </transition-group>
                </draggable>
              </el-checkbox-group>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="right box">
        <el-card>
          <div slot="header">
            <label>
              <i class="iconfont icon-meitiziyuanguanli"></i>
              <span>视图</span>
            </label>
          </div>
          <div class="body">
            <img class="img-big" v-if="isImg" :src="GLOBAL.ftpuri + imgSrc">
            <video v-show="isVideo" ref="playVideos" width="320" controls="controls">
              <source :src="GLOBAL.ftpuri + videoSrc">
            </video>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import draggable from "vuedraggable";
import programManagerAPI from "@/api/led/programManagerAPI";

export default {
  props: {
    dialogObj: Object
  },
  data() {
    return {
      isLoading: false,
      program: {
        rowId: '',
        fileSize: "",
        itemHeight: "",
        itemName: "",
        itemWidth: "",
        itemType: "",
        ledItemLayerList: [
          {
            ledItemDetailList: []
          }
        ]
      },
      total: 0, //数据总条数
      pageSize: 10, //每页容量
      currentPage: 1, //当前页
      checkAll: false, //是否全选
      isIndeterminate: true, //isIndeterminate状态
      imgSrc: "", //图片浏览路径
      videoSrc: "", //图片浏览路径
      programSrcList: [
        //节目资源列表
      ],
      imgSrcList: [
        //图片资源列表
      ],
      videoSrcList: [], //视频资源列表
      checkList: [], //选中值
      activeName: "", //左侧选中资源类型,
      isImg: false, //预览显示图片
      isVideo: false, //预览显示视频
      ledItemDetail: {
        //节目详细信息对象
        entryEffrct: "",
        entryEffrctSpan: "",
        exitEffect: "",
        exitEffectSpan: "",
        itemDetailDes: "",
        itemDetailHeight: "",
        itemDetailLeft: "",
        itemDetailName: "",
        itemDetailTop: "",
        itemDetailType: "",
        itemDetailWidth: "",
        ledItemLayerId: "",
        ledResourceId: "",
        rowId: "",
        sortNo: "",
        timePlay: "",
        timeSpan: ""
      },
      rules: {
        itemName: [
          { required: true, message: '请输入节目名', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符' }
        ],
        itemWidth: [
          { required: true, message: '请输入屏幕宽度', trigger: 'blur' },
          { pattern: /^[1-9]\d{0,4}$/, message: '请输入大于0且不超过10万的整数' }
        ],
        itemHeight: [
          { required: true, message: '请输入屏幕宽度', trigger: 'blur' },
          { pattern: /^[1-9]\d{0,4}$/, message: '请输入大于0且不超过10万的整数' }
        ]
      }
    };
  },
  components: {
    draggable
  },
  methods: {
    closeDialog() {
      this.$emit("handleClose");
      this.$refs['program'].resetFields();
      this.program.ledItemLayerList.ledItemDetailList = this.programSrcList = [];
      this.program.rowId = '';
    },
    getInfo(id) {
      programManagerAPI.getItem(id).then(res=>{
        this.programSrcList = res.ledItemLayerList[0].ledItemDetailList;
        this.program = res;
      });
    },
    getSrcList() {
      if (this.activeName === "") return;
      programManagerAPI
        .getSrcList(this.currentPage, this.pageSize, this.activeName)
        .then(res => {
          switch (this.activeName) {
            case "Image":
              this.imgSrcList = res.records;
              break;
            case "Video":
              this.videoSrcList = res.records;
              break;
            default:
              break;
          }
          this.total = res.total;
        });
    },
    handleCheckAllChange(val) {
      //全选
      this.checkList = val ? this.programSrcList : [];
      this.isIndeterminate = false;
    },
    handleCheckList(value) {
      //选中单个
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.programSrcList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.programSrcList.length;
    },
    datadragEnd(evt) {
      //拖动后的回调函数
      evt.preventDefault();
    },
    preview(item) {
      //浏览资源
      this.isImg = false;
      this.isVideo = false;
      switch (item.fileType) {
        case "Image":
          this.imgSrc = item.filePath;
          this.isImg = true;
          break;
        case "Video":
          this.isVideo = true;
          let vdo = this.$refs.playVideos;
          vdo.src = this.GLOBAL.ftpuri + item.filePath;
          vdo.play();
          break;
        default:
          break;
      }
    },
    addSrc(item) {
      //添加资源到节目列表
      let flag = true;
      this.programSrcList.forEach(i => {
        if (i.ledResourceId === item.rowId) {
          flag = false;
          this.$message.error("请勿重复添加!");
        }
      });
      if (flag) {
        var obj = this.ledItemDetail;
        obj.ledResourceId = item.rowId;
        obj.filePath = item.filePath;
        obj.resourceName = item.resourceName;
        obj.fileType = item.fileType;
        var str = JSON.stringify(obj);
        this.programSrcList.push(JSON.parse(str));
      }
    },
    deleteItem() {
      this.programSrcList = this.programSrcList.reduce((pre, cur) => {
        if (this.checkList.every(item => item.rowId !== cur.rowId)) {
          pre.push(cur);
        }
        return pre;
      }, []);
      this.checkList = [];
      this.checkAll = false;
    },
    refresh() {
      this.$emit('init');
    },
    edit() {
      this.programSrcList.map((item, index) => {
        item.sortNo = index;
        item.timeSpan = item.timeSpan === "" ? "10" : item.timeSpan;
      });
      this.program.ledItemLayerList[0].ledItemDetailList = this.programSrcList;
      this.program.itemType = "2"; //简易节目
      this.$refs['program'].validate((valid) => {
        if (valid) {
          this.isLoading = !this.isLoading
          programManagerAPI.addOrEdit(this.program).then(res => {
            if (res.result) {
              this.$message({
                type: "success",
                message: this.dialogObj.title == "新增" ? "新增成功！" : "修改成功！"
              });
              setTimeout(() => {
                this.closeDialog();
                this.refresh();
                this.isLoading = !this.isLoading;
              }, 1500);
            } else {
              this.$message.error(res.errorMsg);
              this.isLoading = !this.isLoading;
            }
          });
        }
      })
    },
    current_change(currentPage) {
      this.currentPage = currentPage;
      this.getSrcList();
    }
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
};
</script>
<style lang="scss">
#ledProEditDialog {
  .el-dialog {
    height: 90%;
    margin-top: 5vh !important;
    .el-dialog__body {
      height: 90%;
      .dialog-container {
        height: 100%;
      }
      .box {
        height: 100%;
      }
      .middle {
        .basic-info {
          border-bottom: 1px solid #ddd;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .el-row {
          margin-bottom: 10px;
        }
      }
    }
    .el-card {
      height: 100%;
      .el-card__header {
        border-bottom: 0;
        label {
          padding: 10px 50px 10px 0;
          border-bottom: 2px solid #60b8f6;
          font-size: 16px;
          i {
            font-size: 20px;
            color: rgb(87, 87, 87);
          }
        }
      }
      .el-card__body {
        height: 100%;
        .body {
          margin-right: -20px;
          padding-right: 20px;
          height: 90%;
          overflow: auto;
          &::-webkit-scrollbar {
            width: 5px;
            background-color: #fff;
          }

          &::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
            border-radius: 0;
            background-color: lightgray;
          }

          &::-webkit-scrollbar-thumb {
            border-radius: 0;
            -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
            background-color: rgb(121, 121, 121);
          }
          &::-webkit-scrollbar-button {
            background-color: #fff;
            border: 0;
          }
          .img-mini {
            width: 100px;
            height: 70px;
            margin: 0 10px;
            vertical-align: top;
          }
          .source {
            li {
              padding: 5px 10px;
              overflow: hidden;
              &:hover {
                background: #ddd;
              }
              .el-button--mini {
                padding: 5px 10px;
              }
              .resource-name {
                // width: 200px;
                // text-overflow: ellipsis;
                // overflow: hidden;
                // white-space:nowrap;
                display: block;
                word-wrap: break-word; 
                word-break: normal; 
                min-height: 30px;
              }
              .file-size {
                color: #8b8b8b;
              }
            }
          }
          .program-item {
            overflow: hidden;
            font-size: 14px;
            &>div {
              margin-left: 10px;
            }
            .program-name {
              display: block;
              margin-bottom: 10px;
            }
          }
          .img-big {
            width: 100%;
            height: 90%;
          }
        }
      }
    }
  }
}
</style>
