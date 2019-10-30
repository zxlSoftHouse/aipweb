<template>
	<div id="bigScreen">
		<v-header></v-header>
		<v-main></v-main>
	</div>
</template>

<script>
import vHeader from '@/views/bigScreen/header'
import vMain from '@/views/bigScreen/main'

export default {
  components: {
		vHeader,
		vMain
  },
  data() {
    return {
    }
  },
			
}
</script>

<style lang="scss">
	#bigScreen {
		background: url(../../assets/images/bg.png) no-repeat #002c5a;
	}
</style>
