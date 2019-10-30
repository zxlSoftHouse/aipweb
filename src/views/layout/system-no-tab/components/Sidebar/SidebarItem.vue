<template>
  <div class="menu-wrapper">
    <!-- <div v-if="!item.hidden&&item.childs" class="menu-wrapper"> -->
    <!-- <router-link v-if="hasOneShowingChild(item.childs) && !onlyOneChild.childs&&!item.alwaysShow" :to="resolveurl(onlyOneChild.url)">
      <el-menu-item :index="resolveurl(onlyOneChild.url)" :class="{'submenu-menuName-noDropdown':!isNest}">
        <svg-icon v-if="onlyOnechild&&onlyOnechild.icon" :icon-class="onlyOnechild.icon"></svg-icon>
        <span v-if="onlyOnechild&&onlyOnechild.menuName" slot="title">{{generateTitle(onlyOnechild.menuName)}}</span>
      </el-menu-item>
    </router-link> -->
    <el-menu-item v-if="!item.childs" :index="item.menuName||item.url">
      <router-link :to="resolveurl(item.url)" :key="item.menuName">
        <el-menu-item :index="resolveurl(item.url)">
          <i v-if="item&&item.icon" class="iconfont" :class="item.icon"></i>
          <span v-if="item&&item.menuName" slot="title">
            <!-- {{generateTitle(item.menuName)}} -->
            {{item.menuName}}
            </span>
        </el-menu-item>
      </router-link>
    </el-menu-item>
    <el-submenu v-else :index="item.menuName||item.url">
      <template slot="title">
        <i v-if="item&&item.icon" class="iconfont" :class="item.icon"></i>
        <span v-if="item&&item.menuName" slot="tile">
          <!-- {{generateTitle(item.menuName)}} -->
          {{item.menuName}}
          </span>
      </template>

      <template v-for="child in item.childs" v-if="!child.hidden">
        <sidebar-item :is-nest="true" class="nest-menu" v-if="child.childs&&child.childs.length>0" :item="child" :key="child.url" :base-path="resolveurl(child.url)"></sidebar-item>
        <router-link v-else :to="resolveurl(child.url)" :key="child.menuName">
          <el-menu-item :index="resolveurl(child.url)">
            <span v-if="child&&child.menuName" slot="title">
              <!-- {{generateTitle(child.menuName)}} -->
              {{child.menuName}}
              </span>
          </el-menu-item>
        </router-link>
      </template>
    </el-submenu>

  </div>
</template>

<script>
import url from 'url'
import { generateTitle } from '@/utils/i18n'

export default {
  name: 'SidebarItem',
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    baseurl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      onlyOneChild: null
    }
  },
  mounted(){
    // console.log(this.item.childs)
  },
  methods: {
    hasOneShowingChild(childs) {
      const showingchilds = childs.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // temp set(will be used if only has one showing child )
          this.onlyOneChild = item
          return true
        }
      })
      // if (showingchilds.length === 1) {
      //   return true
      // }
      return false
    },
    resolveurl(...urls) {
      return url.resolve(this.baseurl, ...urls)
    },
    generateTitle
  }
}
</script>

<style lang="scss">
  .menu-wrapper {
    .iconfont {
      color: rgb(191, 203, 217);
      font-size: 20px;
      margin-right: 15px;
      &.icon-shezhi {
        font-size: 18px;
      }
    }
  }
</style>

