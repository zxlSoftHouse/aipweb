<template>
  <div>
    <el-cascader
      :disabled="disabled"
      size="large"
      :options="options"
      v-model="selectedOptions"
      @change="handleChange">
    </el-cascader>
  </div>
</template>
 
<script>
  import { regionData } from 'element-china-area-data'
  export default {
    props:{
        selectedOptionsVal: Array,
        disabled: Boolean,
        flag: String
    },
    data () {
      return {
        options: regionData,
        selectedOptions:this.selectedOptionsVal
      }
    },
    methods: {
      handleChange (value) {
        this.$emit('getSelection',value);
      }
    },
    watch: {
        selectedOptionsVal: function (newVal) {
           this.selectedOptions = newVal; 
        }
    }
  }
 
</script>
