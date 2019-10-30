<template>
  <el-row class="app-container">
    <el-col>
      <el-row>
        <el-col :span="16">
          <el-button type="success" @click="doAdd">新增</el-button>
        </el-col>
      </el-row>
      <el-table
        ref="multipleTable"
        :data="tableList"
        tooltip-effect="dark"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column property="menuName" label="关联菜单" show-overflow-tooltip></el-table-column>
        <el-table-column property="resourceType" label="资源类型" show-overflow-tooltip></el-table-column>
        <el-table-column property="resourceName" label="资源名称" show-overflow-tooltip></el-table-column>
        <el-table-column property="resourceCode" label="资源编码" show-overflow-tooltip></el-table-column>
        <el-table-column property="createTime" label="创建时间" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.createTime | formatDate }}</template>
        </el-table-column>
        <el-table-column property="updateTime" label="更新时间" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.updateTime | formatDate }}</template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button @click="delResourceRow(scope.row.rowId)" type="text">删除</el-button>
            <el-button @click="doModify(scope.row)" type="text">修改</el-button>
            <el-button @click="doShareRole(scope.row)" type="text">权限设置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-wrapper block" v-if="isHasPage">
        <el-pagination
          @current-change="pagePost"
          :current-page="pageNum"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <!-- 资源新增或修改模态框 -->
      <el-dialog
        width="30%"
        :modal-append-to-body="false"
        :title="dialogTitle"
        :visible.sync="showDialog"
        :before-close="cannelChange"
      >
        <el-form :model="resource" :rules="rules" ref="ruleForm">
          <el-form-item label="资源类型" :label-width="formLabelWidth" prop="resourceType">
            <el-input v-model="resource.resourceType"></el-input>
          </el-form-item>
          <el-form-item label="资源名称" :label-width="formLabelWidth" prop="resourceName">
            <el-input v-model="resource.resourceName"></el-input>
          </el-form-item>
          <el-form-item label="资源编码" :label-width="formLabelWidth" prop="resourceCode">
            <el-input v-model="resource.resourceCode"></el-input>
          </el-form-item>
          <el-form-item label="所属菜单" :label-width="formLabelWidth" prop="menuId">
            <select-tree v-model="resource.menuId" :options="menuData" :props="menuProps"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cannelChange">取 消</el-button>
          <el-button type="primary" @click="saveAddOrUpdate(resource,'ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 权限设置弹出框 -->
      <el-dialog
        width="40%"
        :modal-append-to-body="false"
        class="moreSel-dialog"
        title="权限设置"
        :visible.sync="showSetDialog"
      >
        <el-select v-model="roleIds" placeholder="请选择要给该人员分配的权限角色" multiple>
          <el-option
            v-for="item in roleData"
            :key="item.rowId"
            :label="item.roleName"
            :value="item.rowId"
          ></el-option>
        </el-select>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cannelSet">取 消</el-button>
          <el-button type="primary" @click="postSet">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        class="tipDialog"
        :modal-append-to-body="false"
        title="提示"
        :visible.sync="tipDialog"
        size="tiny"
      >
        <span class="el-icon-circle-check"></span>
        <span class="tipDialogTxt">{{tipDialogTxt}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="tipDialog = false">确 定</el-button>
        </span>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
import { parseTime } from "@/utils/index";
import roleApi from "@/api/sysManage/role";
import resourceApi from "@/api/sysManage/resource";
import menuManageApi from "@/api/sysManage/menuManage";
import SelectTree from "@/components/select-tree/index";
export default {
  components: {
    SelectTree
  },
  data() {
    return {
      resourceId: "",
      searchInput: "", //绑定头部搜索框
      roleCode: "",
      tableList: [],
      total: 0,
      pageSize: 10,
      pageNum: 1,
      isHasPage: false,
      resource: {
        //表单
        resourceType: "",
        resourceName: "",
        resourceCode: ""
      },
      rules: {
        resourceType: [
          { required: true, message: "请输入资源类型", trigger: "blur" },
          { min: 1, max: 1, message: "长度在 1 个字符", trigger: "blur" }
        ],
        resourceName: [
          { required: true, message: "请输入资源名称", trigger: "blur" },
          { min: 1, max: 8, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        resourceCode: [
          { required: true, message: "请输入资源编码", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      userId: 0,
      menuId: -1,
      roleIds: [],
      showSetDialog: false,
      roleData: [],
      menuData: [],
      // 数据默认字段
      menuProps: {
        parent: "parentId", // 父级唯一标识
        value: "rowId", // 唯一标识
        label: "menuName", // 标签显示
        children: "childs" // 子级
      },
      parentName: "",
      dialogTitle: "新增",
      showDialog: false,
      tipDialog: false,
      tipDialogTxt: "",
      showTreeDialog: false,
      role: {
        roleCode: "",
        roleName: "",
        rowId: ""
      },
      formLabelWidth: "80px",
      treeCount: 0,
      treeData: [],
      roleId: 0,
      filterMethod(query, item) {
        return item.userName.indexOf(query) > -1;
      }
    };
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      return parseTime(date, "{y}-{m}-{d}");
    }
  },
  methods: {
    // 查询所有菜单
    getAllMenu() {
      menuManageApi.getMenuAll().then(res => {
        this.menuData = res;
      });
    },
    //查询所有角色
    getAllSelect() {
      roleApi.queryList({}).then(
        res => {
          this.roleData = res;
        },
        res => {},
        false
      );
    },
    getList() {
      let queryList = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      resourceApi
        .getResourcePageLsit(queryList)
        .then(res => {
          if (res.records.length > 0) {
            this.isHasPage = true;
            this.tableList = res.records;
            this.total = res.total;
            this.pageSize = res.size;
          } else {
            this.isHasPage = false;
          }
        })
        .catch(err => {
          console.log(err);
          this.isHasPage = false;
        });
    },

    doQuery() {
      this.pageNum = 1;
      this.getList();
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    doAdd() {
      this.showDialog = true;
      this.dialogTitle = "新增";
      this.resource = {
        resourceName: "",
        resourceCode: "",
        resourceType: ""
      };
    },
    delResourceRow(rowId) {
      this.$confirm("确定要删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          resourceApi.delResourceRow(rowId).then(
            res => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getList();
            },
            res => {
              this.$message.error("网络异常，无法执行该操作!");
            },
            false
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    doModify(row) {
      this.dialogTitle = "修改";
      this.showDialog = true;
      this.resource.rowId = row.rowId;
      this.resource.resourceName = row.resourceName;
      this.resource.resourceCode = row.resourceCode;
      this.resource.resourceType = row.resourceType;
    },
    //资源的新增或保存
    saveAddOrUpdate(resource, formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.showDialog = false;
          resourceApi.saveAddOrUpdate(this.resource).then(
            res => {
              this.$message({
                type: "success",
                message: this.dialogTitle == "新增" ? "新增成功!" : "修改成功!"
              });
              this.getList();
              this.$refs[formName].resetFields();
            },
            res => {
              this.$message.error("网络异常，无法执行该操作!");
            },
            false
          );
        } else {
          return false;
        }
      });
    },

    cannelSet() {
      this.showSetDialog = false;
    },

    //每一行权限设置按钮
    doShareRole(row) {
      this.showSetDialog = true;
      this.resourceId = row.rowId;
      this.getHasSelect(row.rowId);
    },

    //查询当前行资源的角色
    getHasSelect(resourceId) {
      resourceApi.getResourceHasRole(resourceId).then(
        res => {
          this.roleIds = [];
          res.map(it => {
            this.roleIds.push(it.roleId);
          });
          this.getAllSelect();
        },
        res => {},
        false
      );
    },

    // 保存权限设置
    postSet() {
      this.showSetDialog = false;
      let data = {
        resourceId: this.resourceId,
        roleIds: this.roleIds
      };
      resourceApi.saveByResourceId(data).then(
        res => {
          this.$message({
            type: "success",
            message: "分配权限成功!"
          });
        },
        res => {
          this.$message.error("网络异常，无法执行该操作!");
        },
        false
      );
    },

    cannelChange() {
      this.showDialog = false;
      this.getList();
    },

    pagePost(val) {
      this.pageNum = val;
      this.getList();
    }
  },

  mounted() {
    this.getList();
    this.getAllMenu();
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
</style>

