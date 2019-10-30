<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
			<template>
				<el-menu-item class="logo" index="/home" key="首页">
					<!-- <span slot="title">LOGO</span> -->
          <img :src="logoUrl" alt="" v-if="!collapse">
          <!-- <img src="@/assets/images/logo.png" alt="" v-if="!collapse"> -->
          <p v-else>
            IOT
            <br>
            V1.0
          </p>
				</el-menu-item>
			</template>
      <template v-for="item in items">
        <template v-if="item.nodeChilds">
          <el-submenu :index="item.url" :key="item.menuName">
            <template slot="title">
              <i class="iconfont" :class="item.icon"></i>
              <span slot="title">{{ item.menuName }}</span>
            </template>
            <template v-for="subItem in item.nodeChilds">
              <el-submenu v-if="subItem.nodeChilds" :index="subItem.url" :key="subItem.menuName">
                <template slot="title">{{ subItem.menuName }}</template>
                <el-menu-item
                  v-for="(threeItem,i) in subItem.nodeChilds"
                  :key="i"
                  :index="threeItem.url"
                >{{ threeItem.menuName }}</el-menu-item>
              </el-submenu>
              <el-menu-item
                v-else
                :index="subItem.url"
                :key="subItem.menuName"
              >{{ subItem.menuName }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.url" :key="item.menuName">
            <i class="iconfont" :class="item.icon"></i>
            <span slot="title">{{ item.menuName }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>
<script>
import bus from "@/utils/bus";
import { mapState } from "vuex";
export default {
  data() {
    return {
      collapse: false
    };
  },
  computed: {
    ...mapState({
      items: state => state.menu.navTree,
      logoUrl: state=>state.project.logoUrl,
    }),
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });
  }
};
</script>
<style lang="scss">
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
	overflow-y: scroll;
  background: rgb(50, 65, 87);
  .el-menu {
    border: none !important;
  }
	.iconfont {
		color: rgb(191, 203, 217);
		font-size: 20px;
		margin-right: 15px;
		&.icon-shezhi {
			font-size: 18px;
		}
	}
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 180px;
}
.sidebar > ul {
  height: 100%;
}

.sidebar .logo {
	background: #34495E  !important;
	color: #fff !important;
	text-align: center;
	font-size: 40px;
  height: 80px;
  margin-bottom: 20px;
  padding: 0 !important;
  position: relative;
  img {
    width: 80%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  p {
    padding-top: 20px;
    font-size: 18px;
    line-height: 18px;
  }
}
</style>
