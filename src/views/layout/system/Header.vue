<template>
  <div id="header" :class="{'header-collapse':collapse}">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i class="el-icon-menu"></i>
    </div>
		<ul class="header-right">
      <li>
				<el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
					<i class="iconfont icon-fullscreen btn-fullscreen" @click="handleFullScreen"></i>
				</el-tooltip>
			</li>
      <li>
				<el-tooltip effect="dark" content="大屏" placement="bottom">
					<router-link to="/bigScreen" target="_blank">
						<i class="iconfont icon-xingzhuang btn-bigScreen"></i>
					</router-link>
				</el-tooltip>
      </li>
      <li>
        <el-dropdown trigger="click" @command="togglePrj">
          <span class="el-dropdown-link">
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
      <li>
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            <span :title="currentUser">{{currentUser}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <span @click="logout" style="display:block;">{{$t('navbar.signOut')}}</span>
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
        console.log("layout currentUser" + res.userName);
        this.$store.commit("setLogoUrl", this.GLOBAL.imgUrl + res.orgId + ".png");
      });
    },
    togglePrj(prjItem) {
      // 选择的项目
      if (prjItem != null) {
        let params = {
          projectId: prjItem.rowId
        }
        prjApi.bindPro(params).then(res=>{
          if(res){
            this.prjName = prjItem.projectName;
            // 保存选中的
            this.$store.commit("setProjectId", prjItem.rowId);
          }
        })
      }
    },
    getAllPrj() {
      prjApi.queryList().then(res => {
        if (res.length > 0) {
          this.prjData = res;
          this.prjName = res[0].projectName;
          let rowId =  res[0].rowId;
          let params = {
            projectId: rowId
          }
          prjApi.bindPro(params).then(it=>{
            if(it){
              // 保存默认选中
              this.$store.commit("setProjectId", rowId);
            }
          })
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
              this.$store.commit("removeProjectId");
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
    
    this.$store.dispatch('getdeviceType');
    this.$store.dispatch('getLampList');
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
#header {
  position: relative;
  float: right;
  box-sizing: border-box;
  width: calc(100% - 180px);
	height: 40px;
	font-size: 22px;
  border-bottom: 1px solid #ddd;
  &.header-collapse {
    width: calc(100% - 64px);
  }
  .collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 40px;
  }
  .header-right {
    float: right;
		padding-right: 40px;
		margin-top: 0px;
		li {
			float: left;
      margin-left: 30px;
			.el-dropdown-link {
				cursor: pointer;
			}
      a {
        color: #333;
      }
      .btn-bigScreen {
        font-size: 20px;
        position: relative;
        top: 4px;
			}
			.btn-fullscreen {
				cursor: pointer;
				font-size: 23px;
        position: relative;
        top: 2px;
  		}
		}
  }
}
</style>
