<template>
  <section>
    <!-- <side-bar class="sidebar"></side-bar> -->
    <transition name="fade-transform" mode="out-in">
      <router-view style="padding:20px;min-height: 82vh;"></router-view>
    </transition>
  </section>
</template>

<script>
import SideBar from './components/sidebar/sidebar'

export default {
  name      : 'commonLayout',
  components: {
    SideBar
  },
}
</script>

