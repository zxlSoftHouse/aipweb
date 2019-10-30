<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <ul>
      <li>
        <router-link to="/bigScreen">
          <i class="iconfont icon-AirplayFilled"></i>
        </router-link>
      </li>
      <li>
        <el-dropdown @command="togglePrj">
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
        <el-dropdown>
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
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";
import Hamburger from "@/components/hamburger";
import userApi from "@/api/sysManage/userManage";
import prjApi from '@/api/config/projectConf'
import Cookies from "js-cookie";
export default {
  components: {
    Hamburger
  },
  data() {
    return {
      logoUrl: '',
			currentUser: '',
      prjName: '',
			prjData: []
    };
  },
  mounted() {
    this.getCurrentUser();
		this.getAllPrj();
	},
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
    getPrjName() {
			return this.prjName;
		}
  },
  methods: {
    getCurrentUser() {
			userApi.getCurrnetUser().then(res => {
        this.currentUser = res.userName;
        console.log('system-no-tab/navbar currentUser' +  res.userName);
				this.logoUrl = "/imgs/logo/" + res.orgId + ".png";
			})
		},
    toggleLang(lang) {
      if (lang == "zh") {
        localStorage.setItem("locale", "zh");
        this.$i18n.locale = localStorage.getItem("locale");
        this.$message({
          message: "切换为中文！",
          type: "success"
        });
      } else if (lang == "en") {
        localStorage.setItem("locale", "en");
        this.$i18n.locale = localStorage.getItem("locale");
        this.$message({
          message: "Switch to English!",
          type: "success"
        });
      }
    },
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    togglePrj(prjItem) {
			// 选择的项目
			if (prjItem != null) {
				this.prjName = prjItem.projectName;
				// 保存选中的
    			this.$store.commit('setProjectId', prjItem.rowId);
			}
		},
    getAllPrj() {
			prjApi.queryList().then(res => {
				if (res.length > 0) {
					this.prjData = res;
					this.prjName = res[0].projectName;
					// 保存默认选中	
    				this.$store.commit('setProjectId', res[0].rowId);
				} else {
					this.prjName = "当前无项目"
				}
			})
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
              // location.reload()// 为了重新实例化vue-router对象 避免bug
            })
            .catch(function(res) {});
        })
        .catch(() => {});
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 180px;
  right: 0;
  z-index: 10000;
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  padding: 0 30px 0 20px;
  .right-menu {
    float: right;
    height: 100%;
    .nx-help {
      display: inline-block;
      vertical-align: top;
    }
  }
  .hamburger-container {
    line-height: 58px;
    float: left;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
  ul {
    float: right;
    li {
      float: left;
      margin-left: 30px;
      a {
        color: #000;
      }
      .icon-AirplayFilled {
        font-size: 28px;
      }
      .el-dropdown {
        .el-dropdown-link {
          cursor: pointer;
        }
      }
    }
  }
}
</style>