<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <v-tags></v-tags>
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view ref="FBMS"></router-view>
                    </keep-alive>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    import vTags from './Tags.vue';
    import bus from '@/utils/bus';
    import '@/assets/css/theme/dark/main.css'
    import '@/assets/css/theme/dark/color.css'
import { mapState } from 'vuex';
    export default {
        data(){
            return {
                tagsList: [],
                collapse: false
            }
        },
        components:{
            vHead, vSidebar, vTags
        },
        computed:{
            ...mapState({
                projectId: state=>state.project.projectId,
            }),
        },
        watch: {
            projectId (newV, oldV) {
                // Our fancy notification (2).
                console.log(newV+"___"+oldV)
                if(newV){
                    typeof(this.$refs['FBMS'].initDataByProjectId)=="function"?this.$refs['FBMS'].initDataByProjectId():''
                    typeof(this.$refs['FBMS'].getTableData)=="function"?this.$refs['FBMS'].getTableData():''
                } 
            }
        },
        created(){
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })

            // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
            bus.$on('tags', msg => {
                let arr = [];
                for(let i = 0, len = msg.length; i < len; i ++){
                    msg[i].name && arr.push(msg[i].name);
                }
                this.tagsList = arr;
            })
        }
    }
</script> 