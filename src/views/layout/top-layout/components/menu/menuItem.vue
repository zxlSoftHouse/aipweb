<template>
  <el-menu-item
  v-if="!item.childs"
  :index="item.url">
    <router-link :to="{name: item.url}">
      <i :class="item.icon"></i>
      {{item.menuName}}
    </router-link>
  </el-menu-item>
  <el-submenu 
  v-else
  :index="item.url">
    <template slot="title">
      <router-link :to="{name: item.url}">
        <i :class="item.icon"></i>
        {{item.menuName}}
      </router-link>
    </template>
    <el-menu-item 
    v-for="(key, idx) in item.childs"
    :key="idx" 
    :index="key.url">
      <router-link :to="{name: key.url}">
        {{key.menuName}}
      </router-link>
    </el-menu-item>
  </el-submenu>
</template>

<script>
import path from 'path'
import { generateTitle } from '@/utils/i18n'

export default {
  name: 'menuItem',
  props: {
    item: {
      type: Object
    }
  },
  data() {
    return {
      
    }
  },
  methods: {
    generateTitle
  }
}
</script>

