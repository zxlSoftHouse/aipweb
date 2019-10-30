<template>
  <div id="bigScreenHeader" :class="{'header-collapse':collapse}">
		<ul class="header-right">
      <li>
        <el-dropdown trigger="click" @command="togglePrj">
          <span class="el-dropdown-link">
            <img src="@/assets/images/aa.gif" alt="" style="margin-right: 2px; position: relative; top: 6px; width: 20px; height: 20px; border-radius: 50%">
            {{getPrjName}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in prjData" :key="item.rowId" :command="item">
              <a>{{item.projectName}}</a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
    </ul>
  </div>
</template>
<script>
import bus from "@/utils/bus";
import userApi from "@/api/sysManage/userManage";
import prjApi from "@/api/config/projectConf";
import Cookies from "js-cookie";
import { mapState } from 'vuex';
export default {
  data() {
    return {
      collapse: false,
      fullscreen: false,
      currentUser: "",
      prjName: "",
      prjData: []
    };
  },
  computed: {
    getPrjName() {
      return this.prjName;
    },
    ...mapState({
      projectId: state=>state.project.projectId,
    }),
  },
  watch:{
    projectId(n,o){
      if(n){
        this.$store.dispatch('getdeviceType');
        this.$store.dispatch('getLampList');
      }
    }
  },
  methods: {
    getCurrentUser() {
      userApi.getCurrnetUser().then(res => {
        this.currentUser = res.userName;
        console.log('bigScreen currentUser' +  res.userName);
        // console.log("currentUser" + res.userName);
        this.logoUrl = "/imgs/logo/" + res.orgId + ".png";
      });
    },
    togglePrj(prjItem) {
      // 选择的项目
      if (prjItem != null) {
        this.prjName = prjItem.projectName;
        // 保存选中的
        this.$store.commit("setProjectId", prjItem.rowId);
      }
    },
    getAllPrj() {
      prjApi.queryList().then(res => {
        if (res.length > 0) {
          this.prjData = res;
          this.prjName = res[0].projectName;
          // 保存默认选中
          this.$store.commit("setProjectId", res[0].rowId);
        } else {
          this.prjName = "当前无项目";
        }
      });
    },
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == "loginout") {
        localStorage.removeItem("ms_username");
        this.$router.push("/login");
      }
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    logout() {
      this.$confirm("确认退出吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let token = Cookies.get("access_token");
          userApi
            .loginOut(token)
            .then(res => {
              Cookies.remove("access_token");
              this.$router.push("/login");
            })
            .catch(function(res) {});
        })
        .catch(() => {});
    }
  },
  beforeMount(){
    this.getAllPrj();

  },
  mounted() {
    this.getCurrentUser();
    if (document.body.clientWidth < 1500) {
      this.collapseChage();
    }

    

  },
  created(){
        bus.$on('collapse', msg => {
            this.collapse = msg;
        })
    }
};
</script>
<style lang="scss">
  #bigScreenHeader {
    width: 100%;
    height: 82px;
    background: url(../../assets/images/title.png) no-repeat rgba(52, 10, 238, 0.1);
    background-size: contain;
    background-position: 50%;
    color: #fff;
    .header-right {
      float: right;
      padding-right: 10px;
      margin-top: 10px;
      li {
        float: left;
        margin-left: 30px;
        .el-dropdown-link {
          cursor: pointer;
          color: #fff;
        }
        a {
          color: #fff;
        }
      }
    }
  }
</style>
