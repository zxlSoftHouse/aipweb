<template>
  <bm-control class="map-menu">
    <div class="menu-collapse" v-if="isShow" @click="toggle">
      <i class="iconfont icon-zhedie"></i>
    </div>
    <div class="menu-expand" v-else @click="toggle">
      <i class="iconfont icon-zhedie1"></i>
    </div>
    <el-menu v-if="isShow" :default-active="mapMenu[0].icon" :collapse="true" 
    active-text-color="#e0d811"
    @select="handleSelect">
      <el-menu-item :key="idx" v-for="(item, idx) in mapMenu" :index="item.icon">
        <i class="iconfont" :class="'icon-'+item.icon"></i>
        <span slot="title">{{item.title}}</span>
      </el-menu-item>
    </el-menu>
  </bm-control>
</template>

<script>
export default {
  props: {
    mapMenu: Array
  },
  data() {
    return {
      isShow: true
    }
  },
  methods: {
    handleSelect (index, indexPath) {
      this.$emit('menuToggle', index);
    },
    toggle() {
      this.isShow = !this.isShow;
    }
  }
}
</script>

<style lang="scss">
  .map-menu {
    top: 50% !important;
    right: 0 !important;
    left: auto !important;
    transform: translateY(-50%);
    .el-menu {
      background: rgba(30, 74, 105, 0.8);
      border-color: rgba(30, 74, 105, 0.8);
    }
    .iconfont {
      font-size: 25px;
      color: #fff;
      &.icon-tubiao-zhihuidenggan {
        font-weight: bold;
      }
    }
    .menu-collapse {
      background: rgba(30, 74, 105, 0.8);
      color: #fff;
      text-align: center;
      border-right: 1px solid rgba(30, 74, 105, 0.8);
      cursor: pointer;
      .iconfont {
        font-size: 18px;
      }
    }
    .menu-expand {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(30, 74, 105, 0.8);
      color: #fff;
      padding: 12px 2px;
      cursor: pointer;
      .iconfont {
        font-size: 12px;
      }
    }
  }
</style>
