<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <div class="main-container">
      <navbar></navbar>
      <sidebar class="sidebar-container"></sidebar>
      <app-main></app-main>
    </div>
  </div>

</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
export default {
  name      : 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    }
  },
}
</script>