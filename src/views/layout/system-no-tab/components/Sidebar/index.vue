
<template>
    <el-menu
    :unique-opened="true" mode="vertical" :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF"
    >
    <div class="menu-wrapper logo">
      <router-link to="/home">
        <el-menu-item index="1">
          LOGO
        </el-menu-item>
      </router-link>
    </div>
    <sidebar-item v-for="route in navTree" :key="route.menuName" :item="route" :base-path="route.url"></sidebar-item>
    </el-menu>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import SidebarItem from './SidebarItem'
import store from '@/store'
// import { getMenu } from '@/api/menu-manage'
import menuApi from '@/api/sysManage/menuManage'
import Cookies from "js-cookie";
export default {
  data() {
    return {
      menu:[]
    }
  },
  components: { SidebarItem },  
  computed: {
    ...mapState({
      navTree: state=>state.menu.navTree
    }),
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  mounted() {
    // this.menu = this.$store.state.navTree;
    // this.getMenu();
  },
  methods: {
    getMenu(){
      menuApi.getMenu().then((resp) => {x
        this.menu = resp;
      }).catch((err) => {
        console.log('获取数据出现异常');
      });
   }
  },
}
</script>
