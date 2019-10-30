<template>
  <div class="app-container menuManage">
    <el-row class="container">
      <el-row class="header">
        <el-col>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="addMenu('addOrUpdataForm')"
          >新增菜单</el-button>
        </el-col>
      </el-row>
      <el-col :lg="8" class="left-tree pl-20 pb-20">
        <el-tree
          :data="treeData"
          :props="treeProps"
          node-key="rowId"
          :render-content="renderContent"
          @node-click="handleNodeClick"
        ></el-tree>
      </el-col>
      <el-col :lg="16" class="pl-20">
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane name="first">
            <span slot="label">菜单</span>
            <el-form :model="menu" ref="addOrUpdataForm" :inline="true">
              <el-row>
                <el-col :sm="15" :lg="10">
                  <el-form-item label="类型" :label-width="formLabelWidth" prop="menuType">
                    <dictionary
                      ref="menuType"
                      :indexCode="MENUTYPE"
                      :type.sync="menuType"
                      @changeSelDataVal="customChange"
                    ></dictionary>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :sm="15" :lg="10">
                  <el-form-item label="是否有子节点" :label-width="formLabelWidth" prop="leafFlag">
                    <dictionary
                      ref="leafFlag"
                      :indexCode="leafFlag"
                      :type.sync="menu.leafFlag"
                      @changeSelDataVal="leafFlagChange"
                    ></dictionary>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :sm="15" :lg="10">
                  <el-form-item label="菜单代码" :label-width="formLabelWidth" prop="menuCode">
                    <el-input v-model="menu.menuCode" auto-complete="off" placeholder></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :sm="15" :lg="10">
                  <div class="validate-box">
                    <el-form-item label="菜单名称" :label-width="formLabelWidth" prop="menuName">
                      <el-input
                        class="meu_name"
                        v-model.trim="menu.menuName"
                        size="medium"
                        @onkeyup="this.value=this.value.replace(/\s+/g,'')"
                        :maxlength="20"
                        auto-complete="off"
                        placeholder
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :sm="15" :lg="10">
                  <div class="validate-box">
                    <el-form-item label="菜单URL" :label-width="formLabelWidth" prop="url">
                      <el-input
                        v-model.trim="menu.url"
                        size="medium"
                        @onkeyup="this.value=this.value.replace(/\s+/g,'')"
                        auto-complete="off"
                        placeholder
                      ></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :sm="15" :lg="10">
                  <el-form-item label="上级菜单" :label-width="formLabelWidth" prop="parentName">
                    <select-tree
                      v-model="parentNodeSelected"
                      :options="parentNodeOptions"
                      :props="parentNodeDefaultProps"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :sm="15" :lg="10">
                  <el-form-item label="排序" :label-width="formLabelWidth" prop="sortNo">
                    <el-input
                      v-model.trim="menu.sortNo"
                      size="medium"
                      auto-complete="off"
                      placeholder
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :sm="15" :lg="10">
                  <el-form-item label="图标" :label-width="formLabelWidth" prop="icon">
                    <el-input v-model="menu.icon" auto-complete="off" placeholder></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :sm="10" :lg="10">
                  <el-form-item label :label-width="formLabelWidth">
                    <el-button
                      type="primary"
                      size="medium"
                      :disabled="isMenuSaveBtn"
                      @click="saveOrUpdateMenu(menu,'addOrUpdataForm')"
                    >保存</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <!-- 资源 是该菜单下已经有的资源-->
            <el-row class="top-line">
              <el-col>
                <h4>资源</h4>
              </el-col>
            </el-row>
            <el-row v-loading="resourceLoading">
              <el-col>
                <el-table
                  ref="resourceRefTable"
                  :data="resourceSelAll"
                  @selection-change="handleSelResource"
                  border
                  tooltip-effect="dark"
                  highlight-current-row
                  style="width: 100%"
                >
                  <el-table-column property="resourceType" label="资源类型" show-overflow-tooltip></el-table-column>
                  <el-table-column property="resourceName" label="资源名称" show-overflow-tooltip></el-table-column>
                  <el-table-column label="操作" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-button
                        @click="shareResourceRole(scope.row)"
                        type="primary"
                        size="mini"
                        icon="el-icon-share"
                      >分配角色</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="分配角色" name="second" :disabled="isDisabled">
            <el-row>
              <el-col>
                <el-table
                  ref="menuShareRoleTable"
                  @selection-change="handleSelRoleChange"
                  :data="menuRoleObj.allRole"
                  border
                  tooltip-effect="dark"
                  highlight-current-row
                  style="width: 100%"
                >
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column label="角色代码" prop="roleCode"></el-table-column>
                  <el-table-column label="角色名称" prop="roleName"></el-table-column>
                </el-table>
              </el-col>
            </el-row>
            <div class="pagination-wrapper block">
              <el-pagination
                @size-change="menuRoleHandleSizeChange"
                @current-change="menuRoleCurrentPage"
                :current-page="menuRoleObj.pageNum"
                :page-size="menuRoleObj.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="menuRoleObj.total"
              ></el-pagination>
            </div>
            <el-row>
              <el-col>
                <div class="pagination-wrapper block">
                  <el-button type="primary" size="medium" @click="saveMenuShareRole">保存</el-button>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <!-- 上级菜单 菜单弹出框 -->
      <el-dialog :visible.sync="menuDialog" :modal-append-to-body="false" width="30%" title="提示">
        <el-row>
          <el-col>
            <el-tree
              class="left-tree"
              :data="treeData"
              :props="treeProps"
              node-key="rowId"
              @node-click="treeNodeClick"
            ></el-tree>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button size="samll" @click="menuDialog=false">取 消</el-button>
          <el-button size="samll" type="primary" @click="sureAddMenu">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 资源的模态框 -->
      <el-dialog title="给资源分配角色" :modal-append-to-body="false" :visible.sync="resourceDialog">
        <el-table
          ref="resourceRoleRefTable"
          :data="resourseRoleObj.allRole"
          @selection-change="handleSelResourceRole"
          border
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="角色代码" prop="roleCode"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
        </el-table>
        <div class="pagination-wrapper block">
          <el-pagination
            @current-change="resourceRoleCurrentPage"
            :current-page="resourseRoleObj.pageNum"
            :page-size="resourseRoleObj.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="resourseRoleObj.total"
          ></el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resourceDialog=false" size="medium">取 消</el-button>
          <el-button type="primary" @click="saveByResourceIdRoles" size="medium">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="提示"
        type="warning"
        :modal-append-to-body="false"
        :visible.sync="tipDialog"
        width="20%"
      >
        <h3 class="tipDialogTxt">{{tipDialogTxt}}</h3>
        <span slot="footer" class="dialog-footer">
          <el-button size="samll" type="primary" @click="tipDialog = false">确 定</el-button>
        </span>
      </el-dialog>
    </el-row>
  </div>
</template>
<script>
import menuApi from "@/api/sysManage/menuManage";
import { getDict } from "@/api/sysManage/dict";
import Cookies from "js-cookie";
import SelectTree from "@/components/select-tree/index";

export default {
  components: {
    SelectTree
  },
  data() {
    var checkNumber = (rule, value, callback) => {
      var reg = /^[0-9]+.?[0-9]*$/;
      setTimeout(() => {
        if (value) {
          if (!reg.test(value)) {
            callback(new Error("请输入数字值"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    return {
      // 默认选中值
      parentNodeSelected: "",
      // 数据默认字段
      parentNodeDefaultProps: {
        parent: "parentNodId", // 父级唯一标识
        value: "nodeId", // 唯一标识
        label: "nodeName", // 标签显示
        children: "nodeChilds" // 子级
      },
      // 数据列表
      parentNodeOptions: [],
      typeDictData: [], //类型的字典
      leafDictData: [], //节点的字典
      MENUTYPE: "MENUTYPE", //查询菜单的字典
      leafFlag: "YN_FLAG", // 查询 是否有子节点
      customDataVal: "",
      menuType: "", //点击菜单获得
      isMenuSaveBtn: false, //菜单保存按钮是否为禁止状态
      isHasMenuRowId: "", //新增或编辑菜单 判断后台是否返回rowId  才能继续新增或编辑资源
      isDisableBtn: true, //同上
      resourceTable: [], //资源表格数据
      resourceSelAll: [], //就是根据菜单Id 查询出来的资源集合
      resourceSels: [], //资源当前页选中的数据
      resourceLoading: false, // 资源表格加载
      resourceId: "",
      resourseRoleObj: {
        hasRoleIds: [],
        allRole: [], //所有角色
        pageNum: 1,
        pageSize: 5,
        total: 0,
        multipleSelection: []
      },
      menuRoleObj: {
        //给菜单 分配角色
        menuHasroleIds: [], // 接口返回所拥有ID
        menuRoleData: [],
        multipleSelection: [], // 所有选中的数据包含跨页数据
        multipleSelectionAll: [], // 当前页选中的数据
        idKey: "menuRole", // 标识列表数据中每一行的唯一键的名称(需要按自己的数据改一下)
        allRole: [], // 表格数据
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      isTipMenuName: false,
      isTipMenuUrl: false,
      isChangeBtnVal: 1,
      treeData: [],
      treeProps: {
        children: "childs",
        label: "menuName"
      },
      menuCode: "",
      recordCount: 0,
      pageSize: 0,
      tipDialog: false,
      tipDialogTxt: "",
      showAddDialog: false,
      showChangeDialog: false,
      showDistribution: false,
      menu: {},
      treeBg: false,
      menuName: "",
      parentName: "",
      formLabelWidth: "120px",
      filterMethod(query, item) {
        return item.roleName.indexOf(query) > -1;
      },
      fatherFlag: "N",
      menuHasRole: [], //该菜单下已经有的角色
      notRole: [], //所有角色
      roleProps: {
        key: "rowId",
        label: "roleName"
      },
      menuId: 0,
      dialogTitle: "新增",
      activeName: "first",
      addNewDialog: false,
      multipleSelection: [],
      addRole: false,
      menuDialog: false,
      isDisabled: true,
      parentId: 0,
      menuName: "",
      changeRadio: {
        isCatalogue: true,
        isButton: true,
        isFlag: true
      },
      haspageNum: 1,
      hasPageSize: 10,
      hasRecordCount: 0,
      selectionChange: [],
      yetpageNum: 1,
      yetPageSize: 10,
      yetRecordCount: 0,
      resourceDialog: false,
      tabObj: "" //tab页属性
    };
  },
  watch: {
    menuType(val) {}
  },
  created() {
    this.getDict(this.MENUTYPE);
  },
  mounted() {
    this.getTreeList();
    this.getLeafDict(this.leafFlag);
  },
  methods: {
    // menuType下拉框选择改变事件
    customeTypeChange(val) {
      this.menu.menuType = val;
    },

    menuTypeVisibleChange() {},
    //查询单个字典的集合 类型
    getDict(type) {
      getDict(type)
        .then(res => {
          this.typeDictData = res;
        })
        .catch(err => {
          console.log(err);
        });
    },

    getLeafDict(type) {
      getDict(type)
        .then(res => {
          this.leafDictData = res;
        })
        .catch(err => {
          console.log(err);
        });
    },

    //是否有子节点 下拉框选择改变事件
    leafFlagChange(val) {
      this.menu.leafFlag = val;
    },

    //下拉框显示或影藏事件
    leafFlagVisibleChange() {},

    customChange(val) {
      this.menu.menuType = val;
    },
    //焦点的菜单名称
    changeMenuName(val) {
      this.menu.menuName = val;
    },
    //焦点的菜单url
    changeMenuUrl(val) {
      this.menu.url = val;
    },

    //初始化 验证的tip
    initTip() {
      this.isTipMenuName = false;
      this.isTipMenuUrl = false;
    },
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <span>
            <span class="menu-content">{node.label}</span>
          </span>
          <span style="float: right; margin-right: 20px">
            <el-button
              class="branch-btn del-btn"
              type="primary"
              size="mini"
              on-click={e => {
                e.stopPropagation();
                return this.sureDelete(store, data);
              }}
            >
              删除
            </el-button>
          </span>
        </span>
      );
    },
    treeRenderContent(h, { node, data, store }) {
      return (
        <span>
          <span>
            <span>{node.label}</span>
          </span>
          <span style="float: right; margin-right: 20px" />
        </span>
      );
    },
    //左侧的 菜单树
    getTreeList() {
      menuApi
        .getMenuAll()
        .then(resp => {
          this.treeData = resp;
          this.parentNodeOptions = resp;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //删除树菜单
    sureDelete(store, data) {
      if (data.list !== undefined && data.list !== null) {
        this.tipDialog = true;
        this.tipDialogTxt = "有子元素未删除,暂时不能删除!";
      } else {
        this.$confirm("确定要删除该菜单?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.removeNode(store, data);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    //树删除
    removeNode(store, data) {
      store.remove(data);
      menuApi
        .deleteMenu(data.rowId)
        .then(res => {
          this.$message({
            type: "success",
            message: "删除成功！"
          });
          setTimeout(() => {
            this.getTreeList();
          }, 1000);
        })
        .catch(err => {
          console.log(err);
          this.tipDialog = true;
          this.tipDialogTxt = "网络连接异常，无法执行该操作!";
        });
    },

    //控制tab
    handleClick(tab, event) {
      if (tab) this.tabObj = tab;
      if (this.tabObj.name === "first") {
        this.getResource(); //查询菜单下的资源
      } else if (this.tabObj.name === "second") {
        this.getRoleMenuPageList(); //查询菜单分配角色模块下所有角色
      }
    },
    //左侧菜单树
    handleNodeClick(data) {
      this.dialogTitle = "编辑";
      this.menu = Object.assign(this.menu, data);
      this.menuId = data.rowId;
      this.parentNodeSelected = data.parentNodeId;
      this.menuType = data.menuType;
      this.isDisabled = false;
      this.resourseRoleObj.pageSize = 5;
      (this.resourseRoleObj.pageNum = 1), (this.menuRoleObj.pageSize = 5);
      this.menuRoleObj.pageNum = 1;
      this.menuRoleObj.menuHasroleIds = [];
      this.menuRoleObj.menuRoleData = [];
      this.menuRoleObj.multipleSelection = [];
      this.handleClick();
      this.getResource(); //根据菜单id查询已有的资源
    },
    //根据菜单Id 查询 资源
    getResource() {
      menuApi
        .getMenuResource(this.menuId)
        .then(res => {
          var vm = this;
          vm.resourceSelAll = res;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getAllResource() {
      //获取所有资源
      menuApi
        .getAllResource()
        .then(res => {
          this.resourceTable = res;
        })
        .catch(err => {
          console.log(err);
        });
    },
    treeNodeClick(data) {
      this.parentId = data.rowId;
      this.parentName = data.menuName;
    },

    //选择上级菜单
    focusParentMenu() {
      this.menuDialog = true;
    },
    //确定选择的菜单
    sureAddMenu() {
      this.menu.parentId = this.parentId;
      this.menu.parentName = this.parentName;
      this.menuDialog = false;
    },
    //新增菜单按钮
    addMenu(formName) {
      this.menu = {};
      this.menuType = "";
      this.activeName = "first";
      this.isDisabled = true;
      this.dialogTitle = "新增";
      this.menu.parentId = 0;
      (this.customDataVal = ""), this.$refs[formName].resetFields();
      this.$refs.menuType.resetFields(); //清空组件中的缓存
      this.$refs.leafFlag.resetFields(); //清空组件中的缓存
    },

    //菜单保存- 新增/编辑
    saveOrUpdateMenu(menu, formName) {
      let url = this.dialogTitle == "新增" ? "menuSave" : "menuUpdate";
      menu.parentId = this.parentNodeSelected;
      delete menu.parentName;
      menuApi
        .saveOrUpdateMenu(menu)
        .then(res => {
          setTimeout(() => {
            this.getTreeList();
            this.$refs[formName].resetFields();
            this.$message({
              type: "success",
              message: this.dialogTitle == "新增" ? "新增成功!" : "修改成功!"
            });
          }, 500);
        })
        .catch(err => {
          this.$message.error("网络异常，无法执行该操作!");
          console.log(err);
        });
    },

    //部门已经分配好的人员
    getHasSelect() {},
    //部门已经分配好的人员 分页
    hasPagePost(val) {
      this.haspageNum = val;
      global.post(
        api.roleList,
        {},
        { params: { hasSelectMenuId: this.menuId, _pageNum: val } },
        res => {
          this.menuHasRole = res.body.result || [];
          this.hasPageSize = res.body.pageSize;
          this.hasRecordCount = res.body.recordCount;
        },
        res => {},
        false
      );
    },
    //删除
    doDelete(rowId) {
      this.$confirm("确定要删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {})
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    delmenuHasRole(rowId) {
      global.post(
        api.menuRoleDel,
        {},
        { params: { selectMenuIds: this.menuId, roleId: rowId } },
        res => {
          this.$message({
            type: "success",
            message: "删除成功"
          });
          this.getHasSelect();
          this.getAableRole();
        },
        res => {
          this.tipDialog = true;
          this.tipDialogTxt = "网络连接异常，无法执行该操作!";
        },
        false
      );
    },
    sureRomoveOut() {},

    //查询所有角色 若为tab页切换 1：列表分页初始化到第一页  2：查询已有权限 3：勾选默认选中项
    //仅分页翻页情况 1：勾选默认选中项
    getRoleMenuPageList(flag) {
      if (flag !== "changePage") {
        //点击TAB页
        this.menuRoleObj.pageNum = 1;
      }
      let vm = this;
      let queryList = {
        pageSize: vm.menuRoleObj.pageSize,
        pageNum: vm.menuRoleObj.pageNum
      };
      menuApi
        .getRolePageList(queryList)
        .then(res => {
          vm.menuRoleObj.allRole = res.records;
          vm.menuRoleObj.pageSize = res.size;
          vm.menuRoleObj.total = res.total;
          if (flag !== "changePage") {
            //点击TAB页
            this.getMenuQueryRole(); //根据菜单ID 查询已有的角色
          } else {
            setTimeout(() => {
              this.$utils.setSelectRow(
                this.menuRoleObj.menuHasroleIds,
                this.$refs.menuShareRoleTable,
                this.menuRoleObj.allRole
              );
            }, 200);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //根据菜单id 查询已有的角色
    getMenuQueryRole() {
      this.menuRoleObj.menuHasroleIds = [];
      menuApi
        .getMenuQueryRole({ menuId: this.menuId })
        .then(res => {
          res.map(it => {
            this.menuRoleObj.menuHasroleIds.push(it.roleId);
          });
          // 设置选中
          this.$utils.setSelectRow(
            this.menuRoleObj.menuHasroleIds,
            this.$refs.menuShareRoleTable,
            this.menuRoleObj.allRole
          );
        })
        .catch(err => {
          console.log(err);
        });
    },

    //菜单 选择角色
    handleSelRoleChange(val) {
      this.menuRoleObj.multipleSelection = val;
    },

    // 菜单下的 角色 保存
    saveMenuShareRole() {
      this.menuRoleObj.menuHasroleIds = this.$utils.changePageCoreRecordData(
        this.menuRoleObj.menuHasroleIds,
        this.menuRoleObj.multipleSelection,
        this.menuRoleObj.allRole
      );
      let data = {
        menuId: this.menuId,
        roleIds: this.menuRoleObj.menuHasroleIds
      };
      menuApi
        .saveMenuShareRole(data)
        .then(res => {
          this.getRoleMenuPageList();
          this.getMenuQueryRole(this.menu.rowId);
          this.$message({
            type: "success",
            message: "保存成功"
          });
        })
        .catch(err => {
          console.log(err);
        });
    },

    //菜单下的 角色 分页 翻页
    menuRoleCurrentPage(val) {
      this.menuRoleObj.menuHasroleIds = this.$utils.changePageCoreRecordData(
        this.menuRoleObj.menuHasroleIds,
        this.menuRoleObj.multipleSelection,
        this.menuRoleObj.allRole
      );
      this.menuRoleObj.pageNum = val;
      this.getRoleMenuPageList("changePage");
    },
    //菜单下的 角色 每页多少条
    menuRoleHandleSizeChange(val) {
      this.$utils.changePageCoreRecordData(
        this.menuRoleObj.menuHasroleIds,
        this.menuRoleObj.multipleSelection,
        this.menuRoleObj.allRole
      );
      this.menuRoleObj.pageSize = val;
      this.getRoleMenuPageList("changePage");
    },

    //保存 选中的人员
    addSaveCheck() {
      if (this.selectionChange.length === 0) {
        this.tipDialog = true;
        this.tipDialogTxt = "请选择人员!";
      } else {
        global.post(
          api.saveSmRoleMenuByMenuId,
          {},
          {
            params: {
              menuId: this.menuId,
              roleIds: this.selectionChange.join(",")
            }
          },
          res => {
            this.tipDialog = true;
            this.tipDialogTxt = "操作成功!";
            this.getHasSelect();
            this.getAableRole();
            this.addRole = false;
          },
          res => {
            this.tipDialog = true;
            this.tipDialogTxt = "网络连接异常，无法执行该操作!";
          },
          false
        );
      }
    },

    // ----------------------------     资源     --------------------------------------------------

    //资源 当前选中的
    handleSelResource(val) {
      this.resourceSels = val.map(item => item.rowId);
    },

    //资源 表格 每行的分配角色的保存
    saveByResourceIdRoles() {
      let vm = this;
      vm.resourseRoleObj.hasRoleIds = vm.$utils.changePageCoreRecordData(
        vm.resourseRoleObj.hasRoleIds,
        vm.resourseRoleObj.multipleSelection,
        vm.resourseRoleObj.allRole
      );
      let data = {
        resourceId: vm.resourceId,
        roleIds: vm.resourseRoleObj.hasRoleIds
      };
      menuApi
        .saveByResourceIdRoles(data)
        .then(res => {
          vm.getRolePageList();
          vm.getHasResourceRoleList();
          vm.$message({
            type: "success",
            message: "保存成功"
          });
        })
        .catch(err => {
          console.log(err);
        });
    },

    //每一行的资源分配角色 打开对话框
    shareResourceRole(row) {
      this.resourceDialog = true;
      this.resourseRoleObj.pageNum = 1;
      this.resourseRoleObj.hasRoleIds = [];
      this.resourseRoleObj.multipleSelection = [];
      this.getRolePageList();
      this.resourceId = row.rowId;
      this.getHasResourceRoleList(); //根据资源resourceId 查询已经有的角色
    },
    // ------------------角色 ----------------------
    //查询所有角色 同时也是未被分配的角色
    getRolePageList() {
      let queryList = {
        pageSize: this.resourseRoleObj.pageSize,
        pageNum: this.resourseRoleObj.pageNum
      };
      menuApi
        .getRolePageList(queryList)
        .then(res => {
          this.resourseRoleObj.allRole = res.records;
          this.resourseRoleObj.pageSize = res.size;
          this.resourseRoleObj.total = res.total;
          setTimeout(() => {
            this.$utils.setSelectRow(
              this.resourseRoleObj.hasRoleIds,
              this.$refs.resourceRoleRefTable,
              this.resourseRoleObj.allRole
            );
          }, 200);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //根据资源resourceId 查询已经有的角色
    getHasResourceRoleList() {
      this.resourseRoleObj.hasRoleIds = [];
      menuApi
        .getHasResourceRoleList(this.resourceId)
        .then(res => {
          res.map(it => {
            this.resourseRoleObj.hasRoleIds.push(it.roleId);
          });
          this.$utils.setSelectRow(
            this.resourseRoleObj.hasRoleIds,
            this.$refs.resourceRoleRefTable,
            this.resourseRoleObj.allRole
          );
        })
        .catch(err => {
          console.log(err);
        });
    },

    //资源 角色 行
    handleSelResourceRole(val) {
      this.resourseRoleObj.multipleSelection = val;
    },

    //资源 角色 分页 翻页
    resourceRoleCurrentPage(val) {
      this.resourseRoleObj.hasRoleIds = this.$utils.changePageCoreRecordData(
        this.resourseRoleObj.hasRoleIds,
        this.resourseRoleObj.multipleSelection,
        this.resourseRoleObj.allRole
      );
      this.resourseRoleObj.pageNum = val;
      this.getRolePageList();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.menuManage {
  .header {
    background: #fff;
    margin-bottom: 10px;
  }
  .left-tree {
    border: 1px solid #ddd;
  }
  .mg-r-10 {
    margin-right: 10px;
  }
  .top-line {
    border-top: 1px solid #ddd;
  }
  .el-tree-node__content {
    line-height: 26px;
    font-size: 15px;
    &:hover {
      .del-btn {
        display: block;
        margin-top: 1px;
      }
    }
    .menu-content:hover {
      background: #ddd;
    }
    .del-btn {
      padding: 4px 2px;
      margin-left: 34px;
      display: none;
    }
  }
  .testcontent {
    color: #f00;
  }

  .lfTitle {
    vertical-align: middle;
    background: #ccc;
    height: 39px;
    padding-top: 5px;
    line-height: 36px;
    padding: 5px;
  }
  .pt-10 {
    padding-top: 10px;
  }
  // .pl-20{
  //   // padding-left: 20px
  // }
  .pb-20 {
    padding-bottom: 20px;
    padding-top: 5px;
  }
  .validate-box {
    position: relative;
    .red-star {
      color: #ff4949;
      display: inline-block;
      position: absolute;
      left: 40px;
      bottom: 7px;
    }
  }
  .error-tip {
    color: #ff4949;
    font-size: 12px;
    position: absolute;
    left: 120px;
    bottom: 6px;
  }
}
</style>
