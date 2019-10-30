<template>
  <section class="app-main-home">
    <public-header></public-header>
    <transition name="fade-transform" mode="out-in">
      <router-view></router-view>
    </transition>
  </section>
</template>

<script>
import PublicHeader from './components/PublicHeader'

export default {
  name      : 'homePageLayout',
  components: {
    PublicHeader
  },
}
</script>
<style scoped>
  .app-main-home{
    background-image: url('../../../assets/images/bg.png')
  }
</style>
