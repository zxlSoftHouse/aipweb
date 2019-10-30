<template>
    <el-menu-item :index="intToString(indexNum)">
        <router-link :to="{name: path}">
            <span :class="icon"></span>
            <span>{{name}}</span>
        </router-link>
    </el-menu-item>
</template>

<script>
export default {
    name : 'sidebarItem',
    props: {
        path:{
            type: String
        },
        icon:{
            type: String
        },
        indexNum:{
            type: Number
        },
        name:{
            type: String
        }
    },
    methods:{
        intToString(val){
            return val + "";
        }
    }
}
</script>