<template>
    <el-menu mode="horizontal" default-active="home" background-color="transparent" text-color="#ffffff" active-text-color="#ffffff">
      <menu-item v-for="(k,i) in menuList" 
      :key="i" 
      :item="k">
      </menu-item>
    </el-menu>
</template>
<script>
import { mapGetters } from 'vuex'
import menuItem from './menuItem'
import store from '@/store'

export default {
  data() {
    return {
    }
  },
  computed: {
    menuList() {
      return this.$store.state.menu.buTree
    }
  },
  components: { menuItem }
}
</script>
