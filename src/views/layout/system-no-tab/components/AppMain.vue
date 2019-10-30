<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key"></router-view>
    </transition> 
  </section>
  
  <!--   <div class="content-box">
        <v-tags></v-tags>
        <div class="content">
            <transition name="move" mode="out-in">
                <keep-alive :include="tagsList">
                    <router-view></router-view>
                </keep-alive>
            </transition>
        </div>
    </div> -->
</template>

<script>
import vTags from '../../system/Tags';
import bus from '@/utils/bus';
export default {
  name    : 'AppMain',
  computed: {
    key() {
      return this.$route.name !== undefined ? this.$route.name + new Date(): this.$route + new Date()
    }
  },
  data(){
      return {
          tagsList: [],
      }
  },
  created(){
    
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
<style scoped>
.app-main {
  position  : absolute;
  top: 50px;
  left: 180px;
  bottom: 0;
  right: 0;
  overflow: auto;
}
</style>