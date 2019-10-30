<template>
    <el-menu
    mode  = "horizontal" default-active = "0" background-color = "transparent" text-color = "#ffffff" active-text-color = "#e0d811"
    >
    <sidebar-item v-for="(route,index) in menu" :key="index" :path="route.url" :name="route.menuName" :indexNum="index"></sidebar-item>
    </el-menu>
</template>
<script>
import sidebarItem from './sidebarItem'

export default {
    data() {
        return {
          menu: []
        }
    },
    components:{
        sidebarItem
    },
    mounted(){
        var vm      = this;
            vm.menu = [
            {
                menuName: "项目设置",
                url     : "projectConf"
            },
            {
                menuName: "路段配置",
                url     : "roadConf"
            },
            {
                menuName: "路灯配置",
                url     : "lampConf"
            },
            {
                menuName: "集控器配置",
                url     : "centerControllerConf"
            },
            {
                menuName: "单控器配置",
                url     : "singleControllerConf"
            }
        ]
    }
}
</script>