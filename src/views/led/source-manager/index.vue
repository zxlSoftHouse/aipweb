<template>
  <div class="app-container ledSource">
    <el-row>
      <el-col>
        <el-upload
          class="upload-demo"
          action="/api/SERVICE-AIP/ledResource/ledResourceUpload"
          multiple
          accept="image/jpeg, image/gif, image/png, image/bmp, video/mp4"
          :headers="{'access_token':token,'Authorization':'bearer '+token}"
          :show-file-list="false"
          :before-upload="beforeSrcUpload"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :on-progress="uploadVideoProcess"
        >
          <el-button type="success">
            <i class="iconfont icon-xinzeng"></i>
            上传
          </el-button>
        </el-upload>
        <el-button type="warning" @click="handleDelete()">
          <i class="iconfont icon-shanchu"></i>
          删除
        </el-button>
      </el-col>
      <el-col>
        <el-progress v-if="videoFlag" :percentage="videoUploadPercent"></el-progress>
      </el-col>
    </el-row>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="resourceName" label="资源名称"></el-table-column>
      <el-table-column prop="fileSize" label="资源大小" :formatter="fileSizeFormatter"></el-table-column>
      <el-table-column prop="md5Code" label="MD5"></el-table-column>
      <el-table-column property="createTime" label="上传时间">
        <template slot-scope="scope">{{scope.row.createTime | formatDate }}</template>
      </el-table-column>
			<el-table-column property="createByName" label="上传人"></el-table-column>
      <el-table-column label="下载" width="55">
        <template slot-scope="scope">
          <el-tooltip content="下载" placement="top">
            <el-button
              type="primary"
              icon="el-icon-download"
              circle
              @click="download(scope.row.rowId, scope.row.resourceName)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="预览" width="55">
        <template slot-scope="scope">
          <el-tooltip content="预览" placement="top">
            <el-button
              type="warning"
              icon="el-icon-search"
              circle
              @click="preview(scope.row.filePath)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: center;margin-top: 30px;">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
        @current-change="current_change"
        :page-size="pageSize"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
import Cookies from "js-cookie";
import { parseTime } from "@/utils/index";
import sourceManagerAPI from "@/api/led/sourceManagerAPI";

export default {
  data() {
    return {
      total: 0, //数据总条数
      pageSize: 10, //每页容量
      currentPage: 1, //当前页
      tableData: [], //表格数据
      multipleSelection: [], //表格多选框选中项
      videoFlag: false,
      videoUploadPercent: 0
    };
  },
  computed: {
    token: () => Cookies.get("access_token")
  },
  created() {
    this.initDataByProjectId();
  },
  methods: {
    initDataByProjectId() {
      this.getTableData();
    },
    getTableData() {
      sourceManagerAPI.getList(this.currentPage, this.pageSize).then(res => {
        this.total = res.total;
        this.tableData = res.records;
      });
    },
    fileSizeFormatter(val) {
      return (val.fileSize / 1000000).toFixed(3) + "M";
    },
    handleSelectionChange(val) {
      //获取选中项
      this.multipleSelection = val;
    },
    current_change(currentPage) {
      this.currentPage = currentPage;
      this.getTableData();
    },
    handleDelete() {
      //删除选中记录
      if (this.multipleSelection.length != 0) {
        //判断是否选中
        this.$confirm("确定要删除此条记录?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            var idList = [];
            this.multipleSelection.map(item => {
              idList.push(item.rowId);
            });
            this.doDelete(idList);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: "请先选择一条记录"
        });
      }
    },
    doDelete(ids) {
      //处理删除请求
      sourceManagerAPI.doDelete(ids).then(res => {
        if (res.result) {
          this.$message({
            type: "success",
            message: "删除成功"
          });
        } else {
          this.$message.error(res.errorMsg);
        }
        this.getTableData();
      });
    },
    beforeSrcUpload(file) {
      const allowList = [
        "image/jpeg",
        "image/gif",
        "image/png",
        "image/bmp",
        "video/mp4"
      ];
      let flag = allowList.some(item => item === file.type);
      if (!flag) {
        this.$message.error(
          "文件格式错误！只能上传jpeg/gif/png/bmp/mp4格式的文件"
        );
        return false;
      }
    },
    uploadSuccess(res, file) {
      this.videoFlag = false;
      this.videoUploadPercent = 0;
      this.$message({
        type: "success",
        message: "上传成功"
      });
      this.getTableData();
    },
    uploadError(err) {
      this.$message.error(err);
    },
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true;
      this.videoUploadPercent = Number.parseInt(file.percentage.toFixed(0));
    },
    preview(filePath) {
      //预览
      var url = this.GLOBAL.ftpuri + filePath;
      window.open(url, "_blank");
		},
		
    download(id, name) {
      //下载
      sourceManagerAPI.ledResourceDownload(id).then(blob => {
				let filename = name;
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, filename);
        } else {
          const link = document.createElement("a");
          const body = document.querySelector("body");
          link.href = URL.createObjectURL(blob);
          link.download = filename;
          // fix Firefox
          link.style.display = "none";
          body.appendChild(link);
          link.click();
          body.removeChild(link);
					window.URL.revokeObjectURL(link.href);
        }
      });
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      return parseTime(date, "{y}-{m}-{d} {h}:{i}:{s}");
    }
  }
};
</script>

<style lang="scss">
.ledSource {
  .upload-demo {
    display: inline-block;
  }
  .el-progress {
    width: 124px;
  }
}
</style>