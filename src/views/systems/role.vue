<template>
  <el-row class="app-container">
    <el-col>
      <div class="heading">
        <el-button
          type="primary"
          v-if="hasPerms('role-xz001')"
          size="small"
          @click="doAdd"
          icon="el-icon-plus"
        >新增</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableList"
        tooltip-effect="dark"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column v-if="false" property="roleCode" label="角色代码" show-overflow-tooltip></el-table-column>
        <el-table-column property="roleName" label="角色名称" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button
              v-if="hasPerms('role-sc001')"
              @click="doDelete(scope.row.rowId)"
              type="text"
            >删除</el-button>
            <el-button v-if="hasPerms('role-xg001')" @click="doModify(scope.row)" type="text">修改</el-button>
            <el-button @click="treeRow(scope.row.rowId)" type="text">分配菜单</el-button>
            <el-button @click="manRow(scope.row.rowId)" type="text">分配用户</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        width="30%"
        :modal-append-to-body="false"
        :title="dialogTitle"
        :visible.sync="showDialog"
        :before-close="cannelChange"
      >
        <el-form :model="role" :rules="rules" ref="ruleForm">
          <el-form-item label="角色代码" :label-width="formLabelWidth" prop="roleCode">
            <el-input v-model="role.roleCode" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
            <el-input v-model="role.roleName" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="角色类型" :label-width="formLabelWidth" prop="roleType">
            <dictionary
              ref="roleType"
              :indexCode="roleType"
              :type.sync="role.roleType"
              @changeSelDataVal="roleTypeChange"
            ></dictionary>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cannelChange" size="medium">取 消</el-button>
          <el-button type="primary" @click="saveOrUpdate(role,'ruleForm')" size="medium">保 存</el-button>
        </div>
      </el-dialog>
      <!-- 分配菜单dialog -->
      <el-dialog
        title="菜单"
        width="40%"
        :modal-append-to-body="false"
        :visible.sync="showTreeDialog"
      >
        <el-tree
          ref="menuTree"
          :default-expanded-keys="menuIds"
          :default-checked-keys="menuIds"
          :data="treeData"
          show-checkbox
          :props="treeProps"
          node-key="rowId"
        ></el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cannelPostTree" size="medium">取 消</el-button>
          <el-button type="primary" @click="postTree" size="medium">保 存</el-button>
        </div>
      </el-dialog>
      <!-- 分配用户dialog -->
      <el-dialog
        title="分配用户"
        :modal-append-to-body="false"
        :visible.sync="showManDialog"
        class="role-dialog"
      >
        <el-table
          ref="multipleTable"
          @selection-change="handleSelUserChange"
          :data="userList"
          border
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column property="userName" label="用户名"></el-table-column>
        </el-table>
        <div class="pagination-wrapper">
          <el-pagination
            @current-change="pagePost"
            :current-page="pageAt"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="recordCount"
          ></el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cannelPostMan" size="medium">取 消</el-button>
          <el-button type="primary" @click="postMan" size="medium">保 存</el-button>
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
          <el-button type="primary" @click="tipDialog = false" size="medium">保 存</el-button>
        </span>
      </el-dialog>
    </el-col>
  </el-row>
</template>
<script>
import menuApi from "@/api/sysManage/menuManage";
import userApi from "@/api/sysManage/userManage";
import roleApi from "@/api/sysManage/role";
import { hasPermission } from "@/permission.js";

export default {
  data() {
    return {
      roleType: "ROLETYPE", // 角色类型字典表
      multipleSelection: [], //checkbox选中集合
      multipleSelectionAllIds: [], //所有选中集合，用于翻页后默认勾选
      userList: [],
      searchInput: "", //绑定头部搜索框
      roleCode: "",
      tableList: [],
      recordCount: 0,
      pageSize: 5,
      pageAt: 1,
      dialogTitle: "新增",
      showDialog: false,
      tipDialog: false,
      tipDialogTxt: "",
      showTreeDialog: false,
      showManDialog: false,
      role: {
        roleCode: "",
        roleName: "",
        rowId: ""
      },
      formLabelWidth: "80px",
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],

        roleCode: [
          { required: true, message: "请输入角色代码", trigger: "blur" }
        ]
      },
      treeCount: 0,
      treeData: [],
      treeProps: {
        children: "childs",
        label: "menuName"
      },
      assignObj: {
        roleId: null,
        menuId: []
      },
      menuIds: [],
      expandedRowIds: [10],
      manProps: {
        key: "rowId",
        label: "userName"
      },
      notSelectRoleIds: [],
      selectRoleIds: [],
      roleId: 0,
      smRoleMenu: {
        roleId: null
      },
      filterMethod(query, item) {
        return item.userName.indexOf(query) > -1;
      }
    };
  },

  methods: {
    // 根据权限标识和外部指示状态进行权限判断
    hasPerms(perms) {
      return hasPermission(perms) & !this.disabled;
    },

    //角色类型字典修改
    roleTypeChange(val) {
      this.role.roleType = val;
    },

    getList() {
      menuApi.getRoleList().then(
        res => {
          this.tableList = res;
        },
        res => {
          this.tableList = res.body;
        },
        false
      );
    },

    doRefresh() {
      this.pageAt = 1;
      this.getList();
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    doAdd() {
      this.showDialog = true;
      this.dialogTitle = "新增";
      this.role = {
        roleCode: "",
        roleName: ""
      };
    },

    doDelete(rowId) {
      roleApi.deleteRow(rowId).then(
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
    },

    doModify(row) {
      this.dialogTitle = "修改";
      this.showDialog = true;
      this.role.rowId = row.rowId;
      this.role.roleName = row.roleName;
      this.role.roleCode = row.roleCode;
    },
    // 新增或修改 角色
    saveOrUpdate(role, formName) {
      delete role.gmtCreate;
      let url = this.dialogTitle == "新增" ? "roleSave" : "roleUpdate";
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.showDialog = false;
          roleApi.addOrUpdate(this.role).then(
            res => {
              this.$message({
                type: "success",
                message: this.dialogTitle == "新增" ? "新增成功!" : "修改成功!"
              });
              this.getList();
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

    cannelChange() {
      this.resetForm("ruleForm");
      this.showDialog = false;
      this.getList();
    },

    getMenu(rowId) {
      let userId = "1"; // =》后期后台接口 不需要。就可以删除  sidebarItem中也有。
      menuApi
        .getMenuAll()
        .then(res => {
          this.treeData = res;
          this.getRoleIdSearchMenu(rowId);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //根据角色查询菜单
    getRoleIdSearchMenu(roleId) {
      menuApi
        .getMenuQueryRole({ roleId: roleId })
        .then(res => {
          this.menuIds = [];
          res.map(res => {
            this.menuIds.push(res.menuId);
          });
          this.menuIds = Array.from(new Set(this.menuIds));
          this.$refs.menuTree.setCheckedKeys(this.menuIds);
        })
        .catch(err => {
          console.log(err);
        });
    },

    treeRow(rowId) {
      this.getMenu(rowId);
      if (this.treeCount > 0) {
        setTimeout(() => {
          this.showTreeDialog = true;
        }, 100);
      } else {
        this.showTreeDialog = true;
      }
      this.assignObj.roleId = rowId;
      this.treeCount++;
    },

    //勾选过后的 菜单 提交
    postTree() {
      let [a, b] = [
        this.$refs.menuTree.getCheckedKeys(),
        this.getIndeterminate()
      ];
      this.assignObj.menuId = a;
      roleApi
        .saveMenu(this.assignObj)
        .then(res => {
          this.assignObj = {
            roleId: null,
            menuId: []
          };
          this.$message({
            type: "success",
            message: "调整成功!"
          });
          this.showTreeDialog = false;
        })
        .catch(err => {
          this.$message.error("网络异常，无法执行该操作!");
        });
    },

    cannelPostTree() {
      this.showTreeDialog = false;
      this.assignObj = {
        roleId: null,
        menuId: []
      };
    },

    getHasSelect() {
      global.post(
        api.smUser,
        {},
        { params: { hasSelectRoleId: this.roleId } },
        res => {
          if (res.body.result && res.body.result.length != 0) {
            this.selectRoleIds = res.body.result.map(item => item.rowId);
          }
        },
        res => {},
        false
      );
    },

    // 分配人员
    manRow(flag) {
      var vm = this;
      if (flag !== "changePage") {
        //点击分配用户
        this.pageAt = 1;
        vm.roleId = flag;
        this.role.roleId = flag;
      }
      vm.selectRoleIds = [];
      vm.showManDialog = true;
      var queryList = {
        pageNum: this.pageAt,
        pageSize: this.pageSize
      };
      //查询所有用户
      userApi
        .getUserList(queryList)
        .then(res => {
          this.userList = res.records || [];
          this.recordCount = res.total;
          if (flag !== "changePage") {
            //点击分配用户
            roleApi.queryByInfo({ roleId: this.role.roleId }).then(it => {
              this.multipleSelectionAllIds = [];
              it.map(it => {
                this.multipleSelectionAllIds.push(it.userId);
              });
              this.$utils.setSelectRow(
                this.multipleSelectionAllIds,
                this.$refs.multipleTable,
                this.userList
              );
            });
          } else {
            setTimeout(() => {
              this.$utils.setSelectRow(
                this.multipleSelectionAllIds,
                this.$refs.multipleTable,
                this.userList
              );
            }, 200);
          }
        })
        .catch(err => {});
    },
    //勾选用户
    handleSelUserChange(val) {
      this.multipleSelection = val;
    },
    postMan() {
      this.multipleSelectionAllIds = this.$utils.changePageCoreRecordData(
        this.multipleSelectionAllIds,
        this.multipleSelection,
        this.userList
      );
      let params = {
        roleId: this.role.roleId,
        userIds: this.multipleSelectionAllIds
      };
      roleApi
        .saveUsersByRoleId(params)
        .then(res => {
          this.$message({
            type: "success",
            message: "调整成功!"
          });
          this.showManDialog = false;
        })
        .catch(err => {
          this.$message.error("网络异常，无法执行该操作!");
        });
    },

    cannelPostMan() {
      this.showManDialog = false;
    },

    pagePost(val) {
      this.multipleSelectionAllIds = this.$utils.changePageCoreRecordData(
        this.multipleSelectionAllIds,
        this.multipleSelection,
        this.userList
      );
      this.pageAt = val;
      this.manRow("changePage");
    },

    getIndeterminate() {
      let nodesDOM = this.$refs.menuTree.$el.querySelectorAll(".el-tree-node");
      let nodesVue = [].map.call(nodesDOM, node => node.__vue__);
      let a = nodesVue.filter(item => item.indeterminate === true);
      let b = a.map(item => item.$vnode.data.key);
      return b;
    }
  },

  mounted() {
    this.getList();
  }
};
</script>

