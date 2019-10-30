<template>
	<div>
    <el-select v-model="localData.modelVal" loading-text @change="changeSel" placeholder="">
      <el-option v-for="item in localData.optData" :key="item.dataValue" :label="item.dataName" :value="item.dataValue">
      </el-option>
    </el-select>
  </div>
</template>
<script>
import { getDict } from '@/api/sysManage/dict'
import axios from "axios";
import qs from "qs";
import Cookies from 'js-cookie';
export default {
  name: "dictionary",
  data() {
    return {
      localData: {
        modelVal: '',
        optData: null,
      }
    };
  },  
  props: {
    indexCode:'',
    type:''
  },
  watch: {
    type(val){
      this.localData.modelVal = val;
    }
  },

  created(){
    this.query();
  },
  methods: {
    query() {
      let indexCode = this.indexCode;
      getDict(indexCode).then(res => {
        this.localData.optData = res;
      }).catch(err => {
        console.log(err);
      })
    },
    changeSel(val) {
      this.localData.modelVal = val;
      this.$emit('changeSelDataVal',val);
    },
    resetFields(){
      this.localData.modelVal = '';
    }
   
  }
};
</script>
<style>

</style>